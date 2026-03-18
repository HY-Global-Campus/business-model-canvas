import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { Op } from "sequelize";
import * as oidc from "openid-client";
import User from "../models/user.js";
import config from "../config.js";
import { UserTokenForm } from "../types/user.js";
import { sendErrorResponse, handleUnexpectedError, validateRequest, ErrorTypes } from "../utilities/errorHandler.js";
import { validateRequest as validateMiddleware, ValidationRules, checkEmailNotExists } from "../middlewares/validation.js";
import { validateStrongPassword, checkPasswordStrength } from "../middlewares/security.js";
import { sendPasswordResetEmail } from "../services/email.js";


const loginRouter = express.Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MoocCookiePayload = {
  state: string;
  nonce: string;
  codeVerifier: string;
};

const MOOC_COOKIE_NAME = "mooc_oidc";

let moocConfigPromise: Promise<oidc.Configuration> | null = null;
const getMoocConfig = async () => {
  if (!moocConfigPromise) {
    moocConfigPromise = oidc.discovery(
      new URL(config.MOOC_ISSUER_URL),
      config.MOOC_CLIENT_ID,
      undefined,
      oidc.ClientSecretPost(config.MOOC_CLIENT_SECRET)
    );
  }
  return await moocConfigPromise;
};

const getCookieOptions = (req: express.Request) => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps = req.secure || (typeof forwardedProto === "string" && forwardedProto.split(",")[0].trim() === "https");
  // In development (plain http://localhost), browsers reject SameSite=None cookies without Secure.
  // Use Lax for dev, and None+Secure for production/https.
  const secure = config.NODE_ENV === "production" || isHttps;
  const sameSite = secure ? ("none" as const) : ("lax" as const);
  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 10 * 60 * 1000, // 10 minutes
    signed: true,
    path: "/login",
  };
};

const getClearCookieOptions = (req: express.Request) => {
  const { secure, sameSite, path } = getCookieOptions(req);
  return { secure, sameSite, path };
};

const safeParseSignedMoocCookie = (req: express.Request): MoocCookiePayload | null => {
  const raw = (req as any).signedCookies?.[MOOC_COOKIE_NAME];
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as Partial<MoocCookiePayload>;
    if (!parsed.state || !parsed.nonce || !parsed.codeVerifier) return null;
    return { state: parsed.state, nonce: parsed.nonce, codeVerifier: parsed.codeVerifier };
  } catch {
    return null;
  }
};

// GET /login/mooc/start - Start OIDC Authorization Code + PKCE flow
loginRouter.get("/mooc/start", async (req, res) => {
  try {
    const moocConfig = await getMoocConfig();

    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const codeVerifier = oidc.randomPKCECodeVerifier();
    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    const cookiePayload: MoocCookiePayload = { state, nonce, codeVerifier };
    res.cookie(MOOC_COOKIE_NAME, JSON.stringify(cookiePayload), getCookieOptions(req));

    const redirectTo = oidc.buildAuthorizationUrl(moocConfig, {
      redirect_uri: config.MOOC_REDIRECT_URI,
      scope: "openid offline_access",
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    res.redirect(redirectTo.href);
  } catch (error) {
    handleUnexpectedError(error, res, "Mooc OIDC start");
  }
});

// POST /login/mooc/exchange - Exchange code -> tokens (PKCE + DPoP), mint internal JWT
loginRouter.post("/mooc/exchange", async (req, res) => {
  try {
    const { code, state } = req.body as { code?: string; state?: string };
    if (!code || !state) {
      sendErrorResponse(res, "MISSING_FIELDS");
      return;
    }

    const cookie = safeParseSignedMoocCookie(req);
    if (!cookie || cookie.state !== state) {
      sendErrorResponse(res, "UNAUTHORIZED", { message: "Invalid state" });
      return;
    }

    const moocConfig = await getMoocConfig();

    const keyPair = await oidc.randomDPoPKeyPair("ES256");
    const dpopHandle = oidc.getDPoPHandle(moocConfig, keyPair);

    const currentUrl = new URL(config.MOOC_REDIRECT_URI);
    currentUrl.searchParams.set("code", code);
    currentUrl.searchParams.set("state", state);

    const tokens = await oidc.authorizationCodeGrant(
      moocConfig,
      currentUrl,
      {
        expectedState: cookie.state,
        expectedNonce: cookie.nonce,
        pkceCodeVerifier: cookie.codeVerifier,
        idTokenExpected: true,
      },
      { redirect_uri: config.MOOC_REDIRECT_URI },
      { DPoP: dpopHandle }
    );

    const claims = tokens.claims();
    if (!claims) {
      sendErrorResponse(res, "UNAUTHORIZED", { message: "Missing id_token claims" });
      return;
    }

    const sub = typeof claims.sub === "string" ? claims.sub : null;
    if (!sub) {
      sendErrorResponse(res, "UNAUTHORIZED", { message: "Missing sub claim" });
      return;
    }

    const email = typeof (claims as any).email === "string" ? String((claims as any).email).toLowerCase().trim() : null;
    const name = typeof (claims as any).name === "string" ? String((claims as any).name).trim() : null;

    const [user] = await User.findOrCreate({
      where: { oauthProvider: "mooc", oauthId: sub },
      defaults: {
        email: email || `mooc_${sub}@invalid.local`,
        displayName: name || email || "User",
        oauthProvider: "mooc",
        oauthId: sub,
        isAdmin: false,
      },
    });

    // Keep user info fresh when claims are available.
    const nextEmail = email || user.email;
    const nextDisplayName = name || user.displayName || nextEmail;
    if (user.email !== nextEmail || user.displayName !== nextDisplayName) {
      await user.update({ email: nextEmail, displayName: nextDisplayName });
    }

    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    };
    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET, { expiresIn: "7d" });

    res.clearCookie(MOOC_COOKIE_NAME, getClearCookieOptions(req));
    res.status(200).json({
      token,
      displayName: user.displayName,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    handleUnexpectedError(error, res, "Mooc OIDC exchange");
  }
});

// POST /login - Email/Password Login
loginRouter.post('/', 
  validateMiddleware(ValidationRules.login),
  async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (!user) {
      sendErrorResponse(res, 'INVALID_CREDENTIALS');
      return;
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.passwordHash) {
      sendErrorResponse(res, 'OAUTH_REQUIRED');
      return;
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      sendErrorResponse(res, 'INVALID_CREDENTIALS');
      return;
    }
    
    // Generate JWT with 7 day expiration
    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    };
    
    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({
      token,
      displayName: user.displayName,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    handleUnexpectedError(error, res, 'Login');
  }
});

// POST /register - User Registration
loginRouter.post('/register',
  validateMiddleware([
    ...ValidationRules.register,
    checkEmailNotExists(User)
  ]),
  async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email: normalizedEmail }
    });
    
    if (existingUser) {
      sendErrorResponse(res, 'EMAIL_ALREADY_REGISTERED');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      displayName: displayName.trim(),
      isAdmin: false,
      oauthProvider: null,
      oauthId: null,
    });
    
    // Auto-login: Generate JWT with 7 day expiration
    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    };
    
    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      displayName: user.displayName,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    handleUnexpectedError(error, res, 'Registration');
  }
});

// POST /oauth/callback - OAuth2 Callback (Placeholder for future implementation)
loginRouter.post('/oauth/callback', async (req, res) => {
  const { provider, code } = req.body;
  
  // FEATURE: OAuth2 implementation planned for future release
  // Implementation steps:
  // 1. Exchange authorization code for access token with OAuth provider
  // 2. Fetch user profile from OAuth provider using access token
  // 3. Find existing user by oauthProvider + oauthId or create new user
  // 4. Generate JWT token for authenticated session
  // 4. Generate JWT and return token
  
  sendErrorResponse(res, 'INTERNAL_SERVER_ERROR', {
    feature: 'OAuth authentication',
    message: `OAuth provider '${provider}' will be supported in a future update`
  });
});

// POST /forgot-password - Request password reset
loginRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Validate email format
    if (!email || !EMAIL_REGEX.test(email)) {
      sendErrorResponse(res, 'INVALID_EMAIL_FORMAT');
      return;
    }
    
    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (!user) {
      // Don't reveal whether email exists for security
      sendErrorResponse(res, 'SUCCESS', {
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
      return;
    }
    
    // Check if user has a password (not OAuth-only user)
    if (!user.passwordHash) {
      sendErrorResponse(res, 'OAUTH_USER_NO_PASSWORD');
      return;
    }
    
    // Generate secure token (64-character random string)
    const token = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour
    
    // Store token in database
    await user.update({
      passwordResetToken: {
        token,
        expiresAt
      }
    });
    
    // Send password reset email
    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email.'
    });
  } catch (error) {
    handleUnexpectedError(error, res, 'Forgot Password');
  }
});

// POST /reset-password - Reset password using token
loginRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    // Validate token and password
    if (!token || !newPassword) {
      sendErrorResponse(res, 'MISSING_FIELDS');
      return;
    }
    
    // Validate password strength (just length now)
    if (newPassword.length < 6) {
      sendErrorResponse(res, 'PASSWORD_TOO_SHORT');
      return;
    }
    
    // Find user with this token
    const user = await User.findOne({
      where: {
        passwordResetToken: {
          token,
          expiresAt: { [Op.gt]: new Date() } // Token not expired
        }
      }
    });
    
    if (!user) {
      sendErrorResponse(res, 'INVALID_OR_EXPIRED_TOKEN');
      return;
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear token
    await user.update({
      passwordHash,
      passwordResetToken: null
    });
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully.'
    });
  } catch (error) {
    handleUnexpectedError(error, res, 'Reset Password');
  }
});

// Helper function to validate token
loginRouter.get('/validate-reset-token', async (req, res) => {
  const { token } = req.query;
  
  try {
    if (!token || typeof token !== 'string') {
      sendErrorResponse(res, 'INVALID_TOKEN');
      return;
    }
    
    // Find user with valid token
    const user = await User.findOne({
      where: {
        passwordResetToken: {
          token,
          expiresAt: { [Op.gt]: new Date() } // Token not expired
        }
      }
    });
    
    if (!user) {
      sendErrorResponse(res, 'INVALID_OR_EXPIRED_TOKEN');
      return;
    }
    
    // Token is valid
    res.status(200).json({
      valid: true,
      email: user.email
    });
  } catch (error) {
    handleUnexpectedError(error, res, 'Validate Reset Token');
  }
});

export default loginRouter;

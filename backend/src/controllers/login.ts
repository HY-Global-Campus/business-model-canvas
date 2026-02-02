import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import config from "../config.js";
import { UserTokenForm } from "../types/user.js";
import { sendErrorResponse, handleUnexpectedError, validateRequest, ErrorTypes } from "../utilities/errorHandler.js";
import { validateRequest as validateMiddleware, ValidationRules, checkEmailNotExists } from "../middlewares/validation.js";
import { validateStrongPassword } from "../middlewares/security.js";


const loginRouter = express.Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  
  // TODO: Implement OAuth2 flow
  // 1. Exchange code for access token with OAuth provider
  // 2. Get user info from OAuth provider
  // 3. Find or create user with oauthProvider and oauthId
  // 4. Generate JWT and return token
  
  sendErrorResponse(res, 'INTERNAL_SERVER_ERROR', {
    feature: 'OAuth authentication',
    message: `OAuth provider '${provider}' will be supported in a future update`
  });
});

export default loginRouter;

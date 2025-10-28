import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import config from "../config.js";
import { UserTokenForm } from "../types/user.js";

const loginRouter = express.Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /login - Email/Password Login
loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.passwordHash) {
      res.status(401).json({ error: 'This account uses OAuth login. Please use the OAuth provider.' });
      return;
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    
    // Generate JWT
    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    };
    
    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET);
    
    res.status(200).json({
      token,
      displayName: user.displayName,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /register - User Registration
loginRouter.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  
  // Validate required fields
  if (!email || !password || !displayName) {
    res.status(400).json({ error: 'Email, password, and display name are required' });
    return;
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  // Validate display name length
  if (displayName.trim().length < 2) {
    res.status(400).json({ error: 'Display name must be at least 2 characters long' });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email: normalizedEmail }
    });
    
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
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
    
    // Auto-login: Generate JWT
    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    };
    
    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET);
    
    res.status(201).json({
      token,
      displayName: user.displayName,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  
  res.status(501).json({ 
    error: 'OAuth authentication not yet implemented',
    message: `OAuth provider '${provider}' will be supported in a future update`
  });
});

export default loginRouter;

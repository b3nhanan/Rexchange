import { Router } from 'express';
import { db, verifyPassword } from '../db';

export const authRouter = Router();

// POST /api/auth/signup
authRouter.post('/signup', (req, res) => {
  try {
    const { name, email, password, college, department, year, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and campus email are required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A student account with this campus email already exists.' });
    }

    const user = db.createUser({
      name,
      email,
      password,
      college: college || 'State University',
      department: department || 'General Studies',
      year: year || '1st Year',
      bio: bio || 'Active campus student ready to trade resources and collaborate.',
    });

    const token = db.createSession(user.id);
    
    // Don't expose password hash back to client
    const { password: _, ...safeUser } = user;
    return res.status(201).json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Signup failed.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both your campus email and password.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'No campus account found with this email. Please check your credentials or create a new account.' });
    }

    // Verify salted password hash
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = db.createSession(user.id);
    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      db.deleteSession(authHeader);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Logout failed.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided.' });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized or invalid session.' });
    }
    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: 'Session check failed.' });
  }
});

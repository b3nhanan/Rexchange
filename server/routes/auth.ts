import { Router } from 'express';
import { db } from '../db';

export const authRouter = Router();

// POST /api/auth/signup
authRouter.post('/signup', (req, res) => {
  try {
    const { name, email, password, college, department, year, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A student account with this email already exists' });
    }

    const user = db.createUser({
      name,
      email,
      password: password || 'password123',
      college: college || 'State University',
      department: department || 'General Studies',
      year: year || 'Sophomore',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: bio || 'Active campus student ready to trade resources and collaborate.',
    });

    const token = db.createSession(user.id);
    return res.status(201).json({ user, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = db.getUserByEmail(email);
    // If not found, or demo login, try finding first user
    if (!user) {
      if (email.includes('@campus.edu') || email.includes('alex')) {
        user = db.getUserById('user-1');
      } else {
        return res.status(404).json({ error: 'Invalid email or student not found' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = db.createSession(user.id);
    return res.json({ user, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      db.deleteSession(authHeader);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me
authRouter.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = db.getUserByToken(authHeader) || db.getUserById('user-1');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: 'Session check failed' });
  }
});

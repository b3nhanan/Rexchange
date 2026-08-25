import { Router } from 'express';
import { db } from '../db';

export const usersRouter = Router();

// GET /api/users
usersRouter.get('/', (req, res) => {
  try {
    const users = db.getAllUsers().map(({ password, ...rest }) => rest);
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
usersRouter.get('/:id', (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id
usersRouter.put('/:id', (req, res) => {
  try {
    const { name, bio, college, department, year, avatar } = req.body;
    const updated = db.updateUser(req.params.id, {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(college && { college }),
      ...(department && { department }),
      ...(year && { year }),
      ...(avatar && { avatar }),
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...safeUser } = updated;
    return res.json({ user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

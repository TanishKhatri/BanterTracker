// Controller for CRUD operations of Users:
// - currently only does create operation via a post request with, username, name, password

import express from 'express';
import bcrypt from 'bcrypt'
import User from '../models/user.js';

const usersRouter = express.Router();

// Requires: { username, name(optional), password }
usersRouter.post('/', async (req, res) => {
  const body = req.body;

  // Username/Password not provided send 400
  if (!(body.username && body.password)) {
    return res.status(400).json({ error: 'Username or password not specified' });
  }

  // Password length is <= 3 send 400
  if (body.password.length <= 3) {
    return res.status(400).json({ error: 'Password must have length more than 3' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const newUser = new User({
    username: body.username,
    name: body.name || body.username,
    passwordHash,
  })

  // Sent 201 for creating the user
  await newUser.save();
  return res.status(201).json(newUser);
});

export default usersRouter;
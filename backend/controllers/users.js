import express from 'express';
import bcrypt from 'bcrypt'
import User from '../models/user.js';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
  const body = req.body;

  if (!(body.username && body.password)) {
    return res.status(400).json({ error: 'Username or password not specified' });
  }

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

  await newUser.save();
  return res.status(201).json(newUser);
});

export default usersRouter;
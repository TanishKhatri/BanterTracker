// Controller for logging in to the website:
// - Uses a Post request to /api/login with username and password to give a jwt token

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../utils/config.js';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Find the user, if found check if the password matches with the user
  const user = await User.findOne({ username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // If not found send error 401
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: `Username or password is incorrect` });
  }

  const forUserToken = {
    username: user.username,
    id: user._id,
  };

  // JWT returns forUserToken on verification so we are giving it the
  // two identifiable pieces of info for the user
  const token = jwt.sign(forUserToken, config.JWT_SECRET, { expiresIn: 3600 });
  return res.status(200).send({
    token,
    username: user.username,
    name: user.name,
    id: user._id,
  });
});

export default loginRouter;

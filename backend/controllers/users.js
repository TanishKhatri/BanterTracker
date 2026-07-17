// import express from 'express';
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken';
// import User from '../models/user';

// const signupRouter = express.Router();

// signupRouter.post('/', async (req, res) => {
//   const body = req.body;

//   if (!(body.username && body.password)) {
//     return res.status(400).json({ error: 'Username or password not specified' });
//   }

//   if (body.password.length <= 3) {
//     return res.status(400).json({ error: 'Password must have length more than 3' });
//   }

//   const saltRounds = 10;
//   const passwordHash = bcrypt.hash(body.password, saltRounds)

//   const newUser = new User({

//   })
// });
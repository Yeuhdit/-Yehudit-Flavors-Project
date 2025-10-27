// node-server/controllers/user.controller.js
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { User, generateToken } from '../models/user.model.js';

// ===== Joi Schemas =====
export const userValidator = {
  signUpSchema: Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().optional(),
  }),
  logInSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// ===== REGISTER / SIGN UP =====
export const signUp = async (req, res, next) => {
  try {
    // 1. Validate input
    const { error, value } = userValidator.signUpSchema.validate(req.body);
    if (error) return next({ message: error.details[0].message, status: 400 });

    const { username, email, password, address } = value;
    const role = 'registered user';

    // 2. Check if email exists
    const existUser = await User.findOne({ email });
    if (existUser) return next({ message: 'User already exists', status: 409 });

    // 3. Check if password already used
    const allUsers = await User.find();
    for (const u of allUsers) {
      const samePassword = await bcrypt.compare(password, u.password);
      if (samePassword) return next({ message: 'Password already used by another user', status: 409 });
    }

    // 4. Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, address });
    await user.save();

    // 5. Generate token
    const token = generateToken(user);

    return res.status(201).json({ _id: user._id, username: user.username, token });
  } catch (err) {
    next({ message: err.message, status: 500 });
  }
};

// ===== LOGIN / SIGN IN =====
export const signIn = async (req, res, next) => {
  try {
    // 1. Validate input
    const { error } = userValidator.logInSchema.validate(req.body);
    if (error) return next({ message: error.details[0].message, status: 400 });

    const { email, password } = req.body;

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) return next({ message: 'Auth Failed (user does not exist)', status: 401 });

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next({ message: 'Auth Failed (details are not correct)', status: 401 });

    // 4. Generate token
    const token = generateToken(user);
    return res.json({ _id: user._id, username: user.username, token });
  } catch (err) {
    next({ message: err.message, status: 500 });
  }
};

// ===== GET ALL USERS =====
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v -password'); // exclude password and __v
    return res.json(users);
  } catch (err) {
    next({ message: err.message, status: 500 });
  }
};
//בקיצור: זה דף שמנהל את הלוגיקה של משתמשים בצד השרת 
// – הרשמה, התחברות וצפייה במשתמשים.
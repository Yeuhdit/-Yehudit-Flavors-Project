// node-server/routes/user.route.js
import express from 'express';
import { signIn, signUp, getAllUsers } from '../controllers/user.controller.js';
import { auth } from '../middlewares/userAuth.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// הרשמה
router.post('/signup', signUp);

// התחברות
router.post('/signin', signIn);

// כל המשתמשים
// router.get('/getAllUser', adminAuth, getAllUser);
router.get('/getAllUser', getAllUsers);

export default router;

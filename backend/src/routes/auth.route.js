import express from 'express';

import { protectRoute } from '../middlewares/auth.middleware.js';
import { login, logout, signup, updateProfile } from '../controllers/auth.controller.js';

const router = express();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile)

// check for authentication
router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user));


export default router;
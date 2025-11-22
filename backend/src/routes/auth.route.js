import express from 'express';

import { protectRoute } from '../middlewares/auth.middleware.js';
import { login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express();

// this middleware first runs on every request
// if passes only runs next function on it
router.use(arcjetProtection);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile)

// check for authentication
router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user));


export default router;
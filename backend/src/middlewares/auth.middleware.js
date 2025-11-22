import { ENV } from "../lib/env";
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = res.cookie.jwtToken;
        if (!token) res.status(401).json({ message: 'Unauthorized - No token provided'});

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) res.status(401).json({ message: 'Unauthorized - Invalid token' });

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) res.status(404).json({ message: 'User not found'});

        // this is currently authenticated user which can be accessed 
        // after the next method on req
        req.user = user;
        next();

    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
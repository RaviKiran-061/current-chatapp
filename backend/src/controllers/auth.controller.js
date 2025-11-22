import Joi from 'joi';
import User from '../models/User.model.js';
import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../utils/helperFunctions.js';


// Joi validation for register user
const registerSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// login validation using Joi
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const signup = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) res.status(400).json({ message: error.details[0].message });

  const  { fullName , email , password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const newUser = await User({
        fullName,
        email,
        password
    });

    if (newUser) {

        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);


        res.status(200).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            role: newUser.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.error('Error in signup controller', error);
    res.status(500).json({ message: 'Internal server error'});
  }
};

export const login = async (req, res) => {

    const { error } = loginSchema.validate(req.body);
    if (error) res.status(400).json({ message: error.details[0].message });

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // generate token helper function
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role
        });
    } catch (error) {
        console.error('Error in login Controller', error.message);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};

export const logout = async (_, res) => {
   try {
        res.clearCookie('jwtToken', '', { maxAge: 0 });
        res.status(200).json({ message: 'logout successfully' });
   } catch (error) {
        console.error('Error while logging out:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
   }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) res.status(400).json({ message: 'Profile pic is required' });

        const userId = req.user._id;

        const uploaderResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploaderResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error in update profile', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
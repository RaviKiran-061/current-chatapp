import User from '../models/User.model.js';
import { generateToken } from '../utils/helperFunctions.js';

export const signup = async (req, res) => {
  const  { fullName , email , password } = req.body;

  try {
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be atleast 6  characters long' });
    }

    // checking emails using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const newUser = await User({
        fullName,
        email,
        password
    });

    if (newUser) {
        generateToken(newUser._id, res);

        await newUser.save();

        res.status(200).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
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
    res.send('login endpoint');
};

export const logout = async (req, res) => {
    res.send('logout endpoint');
};
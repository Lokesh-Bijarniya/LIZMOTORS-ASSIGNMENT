import jwt from 'jsonwebtoken';
import User from '../models/UserSchema.js';
// import { initializeUserProgress } from './userProgressController.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



export const authUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("this is authenticated", email, password);

  try {
    // Fetch user from the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize user progress if not already initialized
    // try {
    //   await initializeUserProgress(user._id);
    // } catch (error) {
    //   console.error('Error initializing user progress:', error);
    //   // Optionally handle error if initialization fails
    // }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

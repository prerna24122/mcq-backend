import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback', { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'All fields required' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = await User.create({ name, email, password, role });
    
    // Extract all values immediately after creation
    const userId = String(newUser._id);
    const userName = newUser.name;
    const userEmail = newUser.email;
    const userRole = newUser.role;
    
    const token = generateToken(userId, userRole);

    res.status(201).json({
      message: 'User registered',
      token,
      user: { 
        id: userId, 
        name: userName, 
        email: userEmail, 
        role: userRole 
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const foundUser = await User.findOne({ email }).select('+password');
    if (!foundUser) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordCorrect = await foundUser.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Extract all values immediately
    const userId = String(foundUser._id);
    const userName = foundUser.name;
    const userEmail = foundUser.email;
    const userRole = foundUser.role;
    
    const token = generateToken(userId, userRole);
    
    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: userId, 
        name: userName, 
        email: userEmail, 
        role: userRole 
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Extract all values from req.user
    const userId = String(req.user._id);
    const userName = req.user.name;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    res.json({
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
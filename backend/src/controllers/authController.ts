import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { LoginCredentials, AuthResponse, CreateUserRequest, AuthUser } from '../types';

/**
 * Login user and return JWT token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginCredentials = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
      return;
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
      return;
    }

    // Generate JWT token
    const token = user.generateJWT();

    // Return user data (without password) and token
    const userData: AuthUser = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role
    };

    const response: AuthResponse = {
      token,
      user: userData
    };

    res.json({
      success: true,
      message: 'Login successful.',
      data: response
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

/**
 * Create a new user (admin only)
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'user' }: CreateUserRequest = req.body;

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and name are required.'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
      return;
    }

    // Create new user
    const user = new UserModel({
      email,
      password,
      name,
      role
    });

    await user.save();

    // Return user data (without password)
    const userData: AuthUser = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: userData
    });

  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error during user creation.'
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: req.user
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile.'
    });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });
    
    const userData: AuthUser[] = users.map(user => ({
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }));

    res.json({
      success: true,
      message: 'Users retrieved successfully.',
      data: userData
    });

  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving users.'
    });
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user?.id === id) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account.'
      });
      return;
    }

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user.'
    });
  }
};

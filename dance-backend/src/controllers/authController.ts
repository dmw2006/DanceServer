import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/jwt';

const fallbackAdminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@dance-academy.com').toLowerCase();
const fallbackAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

const isFallbackAdminLogin = (email: string, password: string) => {
    if (!fallbackAdminPassword) return false;
    return email?.toLowerCase() === fallbackAdminEmail && password === fallbackAdminPassword;
};

// Login function
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (isFallbackAdminLogin(email, password)) {
            const token = jwt.sign({ userId: 'fallback-admin', role: 'admin' }, getJwtSecret(), { expiresIn: '24h' });
            return res.json({
                token,
                user: { id: 'fallback-admin', email: fallbackAdminEmail, username: 'admin', role: 'admin' }
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, getJwtSecret(), { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
    } catch (error) {
        const normalizedEmail = email?.toLowerCase() || '';
        if (isFallbackAdminLogin(normalizedEmail, password)) {
            const token = jwt.sign({ userId: 'fallback-admin', role: 'admin' }, getJwtSecret(), { expiresIn: '24h' });
            return res.json({
                token,
                user: { id: 'fallback-admin', email: fallbackAdminEmail, username: 'admin', role: 'admin' }
            });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = (req.user as any)?.userId || (req.user as any)?._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create user (admin only)
export const createUser = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, email: newUser.email, username: newUser.username, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user (admin only)
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: { id: user._id, email: user.email, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
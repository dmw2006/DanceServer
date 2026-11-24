import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        } else {
            return res.status(401).json({ message: 'Authentication failed. Please log in again.' });
        }
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req.user as any)?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
};

export default authenticate;
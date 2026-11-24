import { Router } from 'express';
import { login, changePassword, getAllUsers, createUser, updateUser, deleteUser } from '../controllers/authController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.post('/change-password', authenticate, changePassword);
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.post('/users', authenticate, requireAdmin, createUser);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default router;
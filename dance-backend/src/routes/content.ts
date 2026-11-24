import { Router } from 'express';
import { getContent, createContent, updateContent, deleteContent } from '../controllers/contentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route to get content
router.get('/', getContent);

// Protected routes for managing news posts
router.post('/', authenticate, createContent);
router.put('/:id', authenticate, updateContent);
router.delete('/:id', authenticate, deleteContent);

export default router;
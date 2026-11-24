import express from 'express';
import { getAnnouncements, getUserInfo } from '../controllers/studioProController';

const router = express.Router();

// Route to fetch announcements from Studio Pro
router.get('/announcements', getAnnouncements);

// Route to fetch user information from Studio Pro
router.get('/user-info', getUserInfo);

export default router;
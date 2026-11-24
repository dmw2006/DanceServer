import express from 'express';
import {
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getSchedule,
    createScheduleDay,
    updateScheduleDay,
    deleteScheduleDay,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getHighlights,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    getStaffMembers,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
} from '../controllers/publicContentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/programs', getPrograms);
router.get('/schedule', getSchedule);
router.get('/testimonials', getTestimonials);
router.get('/highlights', getHighlights);
router.get('/staff', getStaffMembers);

// Protected admin routes
router.post('/programs', authenticate, createProgram);
router.put('/programs/:id', authenticate, updateProgram);
router.delete('/programs/:id', authenticate, deleteProgram);

router.post('/schedule', authenticate, createScheduleDay);
router.put('/schedule/:id', authenticate, updateScheduleDay);
router.delete('/schedule/:id', authenticate, deleteScheduleDay);

router.post('/testimonials', authenticate, createTestimonial);
router.put('/testimonials/:id', authenticate, updateTestimonial);
router.delete('/testimonials/:id', authenticate, deleteTestimonial);

router.post('/highlights', authenticate, createHighlight);
router.put('/highlights/:id', authenticate, updateHighlight);
router.delete('/highlights/:id', authenticate, deleteHighlight);

router.post('/staff', authenticate, createStaffMember);
router.put('/staff/:id', authenticate, updateStaffMember);
router.delete('/staff/:id', authenticate, deleteStaffMember);

export default router;

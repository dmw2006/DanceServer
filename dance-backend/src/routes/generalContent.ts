import express from 'express';
import {
    getHighlights,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getStaffMembers,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    getGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
} from '../controllers/generalContentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/highlights', getHighlights);
router.get('/programs', getPrograms);
router.get('/schedule', getSchedule);
router.get('/testimonials', getTestimonials);
router.get('/staff', getStaffMembers);
router.get('/gallery', getGallery);
router.get('/hero-slides', getHeroSlides);

// Protected routes (admin only)
router.post('/highlights', authenticate, createHighlight);
router.put('/highlights/:id', authenticate, updateHighlight);
router.delete('/highlights/:id', authenticate, deleteHighlight);

router.post('/programs', authenticate, createProgram);
router.put('/programs/:id', authenticate, updateProgram);
router.delete('/programs/:id', authenticate, deleteProgram);

router.post('/schedule', authenticate, createSchedule);
router.put('/schedule/:id', authenticate, updateSchedule);
router.delete('/schedule/:id', authenticate, deleteSchedule);

router.post('/testimonials', authenticate, createTestimonial);
router.put('/testimonials/:id', authenticate, updateTestimonial);
router.delete('/testimonials/:id', authenticate, deleteTestimonial);

router.post('/staff', authenticate, createStaffMember);
router.put('/staff/:id', authenticate, updateStaffMember);
router.delete('/staff/:id', authenticate, deleteStaffMember);

router.post('/gallery', authenticate, createGalleryItem);
router.put('/gallery/:id', authenticate, updateGalleryItem);
router.delete('/gallery/:id', authenticate, deleteGalleryItem);

router.post('/hero-slides', authenticate, createHeroSlide);
router.put('/hero-slides/:id', authenticate, updateHeroSlide);
router.delete('/hero-slides/:id', authenticate, deleteHeroSlide);

export default router;

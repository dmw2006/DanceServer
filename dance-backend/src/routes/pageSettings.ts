import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth';
import { PageSettings } from '../models/PageSettings';
import { isPage, validatePageContent } from '../utils/pageSettingsValidation';

const router = express.Router();

router.get('/:page', async (req, res) => {
    if (!isPage(req.params.page)) return res.status(400).json({ message: 'Invalid page' });
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Database unavailable' });

    try {
        const settings = await PageSettings.findById(req.params.page).lean();
        return res.json(settings ? settings.content : null);
    } catch (error) {
        console.error('Error fetching page settings:', error);
        return res.status(500).json({ message: 'Error fetching page settings' });
    }
});

router.put('/:page', authenticate, async (req, res) => {
    const page = req.params.page;
    if (!isPage(page)) return res.status(400).json({ message: 'Invalid page' });
    if (!validatePageContent(page, req.body)) return res.status(400).json({ message: 'Invalid page content' });
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Database unavailable' });

    try {
        const settings = await PageSettings.findOneAndUpdate(
            { _id: page },
            { $set: { content: req.body } },
            { upsert: true, new: true, runValidators: true }
        ).lean();
        return res.json(settings!.content);
    } catch (error) {
        console.error('Error saving page settings:', error);
        return res.status(500).json({ message: 'Error saving page settings' });
    }
});

export default router;
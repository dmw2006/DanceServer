import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Highlight } from '../models/Highlight';
import { Program } from '../models/Program';
import { Schedule } from '../models/Schedule';
import { Testimonial } from '../models/Testimonial';
import { StaffMember } from '../models/StaffMember';
import { Gallery } from '../models/Gallery';
import { HeroSlide } from '../models/HeroSlide';

const databaseAvailable = () => mongoose.connection.readyState === 1;

// Highlights
export const getHighlights = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const highlights = await Highlight.find({ active: { $ne: false } }).sort({ order: 1 });
        res.json(highlights);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching highlights', error });
    }
};

export const createHighlight = async (req: Request, res: Response) => {
    try {
        const highlight = new Highlight(req.body);
        await highlight.save();
        res.status(201).json(highlight);
    } catch (error) {
        res.status(400).json({ message: 'Error creating highlight', error });
    }
};

export const updateHighlight = async (req: Request, res: Response) => {
    try {
        const highlight = await Highlight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(highlight);
    } catch (error) {
        res.status(400).json({ message: 'Error updating highlight', error });
    }
};

export const deleteHighlight = async (req: Request, res: Response) => {
    try {
        await Highlight.findByIdAndDelete(req.params.id);
        res.json({ message: 'Highlight deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting highlight', error });
    }
};

// Programs
export const getPrograms = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const programs = await Program.find({ active: { $ne: false } }).sort({ order: 1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching programs', error });
    }
};

export const createProgram = async (req: Request, res: Response) => {
    try {
        const program = new Program(req.body);
        await program.save();
        res.status(201).json(program);
    } catch (error) {
        res.status(400).json({ message: 'Error creating program', error });
    }
};

export const updateProgram = async (req: Request, res: Response) => {
    try {
        const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(program);
    } catch (error) {
        res.status(400).json({ message: 'Error updating program', error });
    }
};

export const deleteProgram = async (req: Request, res: Response) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.json({ message: 'Program deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting program', error });
    }
};

// Schedule
export const getSchedule = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const schedule = await Schedule.find({ active: { $ne: false } }).sort({ order: 1 });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error });
    }
};

export const createSchedule = async (req: Request, res: Response) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: 'Error creating schedule', error });
    }
};

export const updateSchedule = async (req: Request, res: Response) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ message: 'Error updating schedule', error });
    }
};

export const deleteSchedule = async (req: Request, res: Response) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting schedule', error });
    }
};

// Testimonials
export const getTestimonials = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const testimonials = await Testimonial.find({ active: { $ne: false } }).sort({ order: 1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials', error });
    }
};

export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: 'Error creating testimonial', error });
    }
};

export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(testimonial);
    } catch (error) {
        res.status(400).json({ message: 'Error updating testimonial', error });
    }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting testimonial', error });
    }
};

// Staff Members
export const getStaffMembers = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const staff = await StaffMember.find({ active: { $ne: false } }).sort({ order: 1 });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error });
    }
};

export const createStaffMember = async (req: Request, res: Response) => {
    try {
        const staff = new StaffMember(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ message: 'Error creating staff member', error });
    }
};

export const updateStaffMember = async (req: Request, res: Response) => {
    try {
        const staff = await StaffMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: 'Error updating staff member', error });
    }
};

export const deleteStaffMember = async (req: Request, res: Response) => {
    try {
        await StaffMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting staff member', error });
    }
};

// Gallery
export const getGallery = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const gallery = await Gallery.find({ isActive: { $ne: false } }).sort({ order: 1 });
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery', error });
    }
};

export const createGalleryItem = async (req: Request, res: Response) => {
    try {
        const item = new Gallery(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error creating gallery item', error });
    }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error updating gallery item', error });
    }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery item deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting gallery item', error });
    }
};

// Home page slideshow
export const getHeroSlides = async (req: Request, res: Response) => {
    try {
        if (!databaseAvailable()) {
            res.json([]);
            return;
        }

        const slides = await HeroSlide.find({ active: { $ne: false } }).sort({ order: 1, createdAt: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slides', error });
    }
};

export const createHeroSlide = async (req: Request, res: Response) => {
    try {
        const { image, caption, order } = req.body;
        const slide = new HeroSlide({ image, caption, order });
        await slide.save();
        res.status(201).json(slide);
    } catch (error) {
        res.status(400).json({ message: 'Error creating slide', error });
    }
};

export const updateHeroSlide = async (req: Request, res: Response) => {
    try {
        const { image, caption, order, active } = req.body;
        const update: Record<string, unknown> = {};
        if (image !== undefined) update.image = image;
        if (caption !== undefined) update.caption = caption;
        if (order !== undefined) update.order = order;
        if (active !== undefined) update.active = active;
        const slide = await HeroSlide.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(slide);
    } catch (error) {
        res.status(400).json({ message: 'Error updating slide', error });
    }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
    try {
        await HeroSlide.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slide deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting slide', error });
    }
};


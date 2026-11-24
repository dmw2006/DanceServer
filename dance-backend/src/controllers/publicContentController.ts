import { Request, Response } from 'express';
import { Program } from '../models/Program';
import { Schedule } from '../models/Schedule';
import { Testimonial } from '../models/Testimonial';
import { Highlight } from '../models/Highlight';
import { StaffMember } from '../models/StaffMember';

// Programs
export const getPrograms = async (req: Request, res: Response) => {
    try {
        const programs = await Program.find({ active: true }).sort({ order: 1 });
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
        res.status(500).json({ message: 'Error creating program', error });
    }
};

export const updateProgram = async (req: Request, res: Response) => {
    try {
        const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(program);
    } catch (error) {
        res.status(500).json({ message: 'Error updating program', error });
    }
};

export const deleteProgram = async (req: Request, res: Response) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.json({ message: 'Program deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting program', error });
    }
};

// Schedule
export const getSchedule = async (req: Request, res: Response) => {
    try {
        const schedule = await Schedule.find({ active: true }).sort({ order: 1 });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error });
    }
};

export const createScheduleDay = async (req: Request, res: Response) => {
    try {
        const scheduleDay = new Schedule(req.body);
        await scheduleDay.save();
        res.status(201).json(scheduleDay);
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule day', error });
    }
};

export const updateScheduleDay = async (req: Request, res: Response) => {
    try {
        const scheduleDay = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(scheduleDay);
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule day', error });
    }
};

export const deleteScheduleDay = async (req: Request, res: Response) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule day deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule day', error });
    }
};

// Testimonials
export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find({ active: true }).sort({ order: 1 });
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
        res.status(500).json({ message: 'Error creating testimonial', error });
    }
};

export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial', error });
    }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial', error });
    }
};

// Highlights
export const getHighlights = async (req: Request, res: Response) => {
    try {
        const highlights = await Highlight.find({ active: true }).sort({ order: 1 });
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
        res.status(500).json({ message: 'Error creating highlight', error });
    }
};

export const updateHighlight = async (req: Request, res: Response) => {
    try {
        const highlight = await Highlight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(highlight);
    } catch (error) {
        res.status(500).json({ message: 'Error updating highlight', error });
    }
};

export const deleteHighlight = async (req: Request, res: Response) => {
    try {
        await Highlight.findByIdAndDelete(req.params.id);
        res.json({ message: 'Highlight deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting highlight', error });
    }
};

// Staff Members
export const getStaffMembers = async (req: Request, res: Response) => {
    try {
        const staffMembers = await StaffMember.find({ active: true }).sort({ order: 1 });
        res.json(staffMembers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff members', error });
    }
};

export const createStaffMember = async (req: Request, res: Response) => {
    try {
        const staffMember = new StaffMember(req.body);
        await staffMember.save();
        res.status(201).json(staffMember);
    } catch (error) {
        res.status(500).json({ message: 'Error creating staff member', error });
    }
};

export const updateStaffMember = async (req: Request, res: Response) => {
    try {
        const staffMember = await StaffMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(staffMember);
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff member', error });
    }
};

export const deleteStaffMember = async (req: Request, res: Response) => {
    try {
        await StaffMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff member', error });
    }
};

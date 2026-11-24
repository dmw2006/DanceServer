import { Request, Response } from 'express';
import Content from '../models/Content';

// Get all content
export const getContent = async (req: Request, res: Response) => {
    try {
        const content = await Content.find().sort({ date: -1, updatedAt: -1 });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content', error });
    }
};

// Only these fields may be written from the admin dashboard
// Attachments must point at an uploaded file or a normal web link - never javascript: or data: URLs
const safeAttachmentUrl = /^(\/images\/[\w.\-]+|https?:\/\/\S+)$/;

const pickContentFields = (body: any) => {
    const data: Record<string, unknown> = {};
    for (const key of ['title', 'description', 'imageUrl', 'date']) {
        if (body && body[key] !== undefined) data[key] = body[key];
    }
    if (body && Array.isArray(body.attachments)) {
        data.attachments = body.attachments
            .filter((a: any) => a && typeof a.url === 'string' && safeAttachmentUrl.test(a.url))
            .slice(0, 20)
            .map((a: any) => ({ url: a.url, name: String(a.name || '').slice(0, 200), type: String(a.type || '').slice(0, 100) }));
    }
    return data;
};

// Create content (news post)
export const createContent = async (req: Request, res: Response) => {
    try {
        const content = new Content(pickContentFields(req.body));
        await content.save();
        res.status(201).json(content);
    } catch (error) {
        res.status(400).json({ message: 'Error creating content', error });
    }
};

// Update content
export const updateContent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const updatedContent = await Content.findByIdAndUpdate(
            id,
            { ...pickContentFields(req.body), updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!updatedContent) {
            res.status(404).json({ message: 'Content not found' });
            return;
        }
        res.status(200).json(updatedContent);
    } catch (error) {
        res.status(400).json({ message: 'Error updating content', error });
    }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Content deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting content', error });
    }
};
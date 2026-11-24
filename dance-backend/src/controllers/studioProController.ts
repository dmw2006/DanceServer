import { Request, Response } from 'express';
import axios from 'axios';

const STUDIO_PRO_API_URL = process.env.STUDIO_PRO_API_URL;

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${STUDIO_PRO_API_URL}/announcements`);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const response = await axios.get(`${STUDIO_PRO_API_URL}/users/${userId}`);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching user information', error: error.message });
    }
};
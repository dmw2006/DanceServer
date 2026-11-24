export interface User {
    id: string;
    username: string;
    password: string;
    role: 'staff' | 'admin';
}

export interface Content {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export interface Announcement {
    id: string;
    title: string;
    message: string;
    date: Date;
}

export interface StudioProUser {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface StudioProAnnouncement {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
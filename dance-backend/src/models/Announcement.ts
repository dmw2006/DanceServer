import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    date: Date;
}

const AnnouncementSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default Announcement;
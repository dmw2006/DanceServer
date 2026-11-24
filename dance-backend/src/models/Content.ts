import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IContent extends Document {
    title: string;
    description: string;
    imageUrl: string;
    date?: Date;
    updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Content = getSectionModel<IContent>('Content', ContentSchema, 'CONTENT');

export default Content;
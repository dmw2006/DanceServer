import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IAttachment {
    url: string;
    name: string;
    type: string;
}

export interface IContent extends Document {
    title: string;
    description: string;
    imageUrl: string;
    attachments: IAttachment[];
    date?: Date;
    updatedAt: Date;
}

const AttachmentSchema: Schema = new Schema({
    url: { type: String, required: true },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
}, { _id: false });

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
    attachments: {
        type: [AttachmentSchema],
        default: [],
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
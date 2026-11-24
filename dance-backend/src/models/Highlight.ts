import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IHighlight extends Document {
    title: string;
    text: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HighlightSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export const Highlight = getSectionModel<IHighlight>('Highlight', HighlightSchema, 'HIGHLIGHTS');

import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IProgram extends Document {
    name: string;
    age: string;
    bucket: string;
    style: string;
    schedule: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProgramSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    bucket: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        required: true,
    },
    schedule: {
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

export const Program = getSectionModel<IProgram>('Program', ProgramSchema, 'PROGRAMS');

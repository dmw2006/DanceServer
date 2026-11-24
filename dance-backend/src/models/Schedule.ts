import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IScheduleItem {
    title: string;
    time: string;
    studio: string;
    age: string;
}

export interface ISchedule extends Document {
    day: string;
    order: number;
    items: IScheduleItem[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ScheduleItemSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    studio: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
}, { _id: false });

const ScheduleSchema: Schema = new Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    order: {
        type: Number,
        required: true,
    },
    items: [ScheduleItemSchema],
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export const Schedule = getSectionModel<ISchedule>('Schedule', ScheduleSchema, 'SCHEDULE');

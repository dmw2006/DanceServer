import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface ITestimonial extends Document {
    quote: string;
    name: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
    quote: {
        type: String,
        required: true,
    },
    name: {
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

export const Testimonial = getSectionModel<ITestimonial>('Testimonial', TestimonialSchema, 'TESTIMONIALS');

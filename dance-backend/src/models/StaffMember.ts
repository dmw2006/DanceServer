import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IStaffMember extends Document {
    name: string;
    title: string;
    img: string;
    styles: string[];
    bio: string[];
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StaffMemberSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: '',
    },
    styles: [{
        type: String,
    }],
    bio: [{
        type: String,
    }],
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

export const StaffMember = getSectionModel<IStaffMember>('StaffMember', StaffMemberSchema, 'STAFF');

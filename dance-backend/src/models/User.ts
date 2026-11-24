import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    role: 'staff' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['staff', 'admin'], default: 'staff' },
}, {
    timestamps: true,
});

const User = getSectionModel<IUser>('User', UserSchema, 'USERS');

export default User;
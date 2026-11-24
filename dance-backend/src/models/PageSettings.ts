import mongoose, { Schema } from 'mongoose';

// The page name is the primary key, so concurrent upserts cannot create duplicates.
const pageSettingsSchema = new Schema({
    _id: { type: String, enum: ['handbook', 'contact', 'studio-pro'], required: true },
    content: { type: Schema.Types.Mixed, required: true },
}, { collection: 'pagesettings', versionKey: false });

export const PageSettings = mongoose.model('PageSettings', pageSettingsSchema);
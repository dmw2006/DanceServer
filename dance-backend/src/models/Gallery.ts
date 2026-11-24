import mongoose, { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IGallery extends Document {
  title: string;
  thumbnail: string;
  images: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = getSectionModel<IGallery>('Gallery', GallerySchema, 'GALLERY');

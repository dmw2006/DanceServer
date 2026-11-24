import { Document, Schema } from 'mongoose';
import { getSectionModel } from '../config/sectionDatabase';

export interface IHeroSlide extends Document {
    image: string;
    caption: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema({
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: '',
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

export const HeroSlide = getSectionModel<IHeroSlide>('HeroSlide', HeroSlideSchema, 'HERO');

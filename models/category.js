import mongoose, { mongo } from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    }
}, {timestamps: true});

export default mongoose.model('Category' , categorySchema);
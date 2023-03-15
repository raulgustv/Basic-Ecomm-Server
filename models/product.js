import mongoose from 'mongoose';

const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 160
    },
    slug:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    category: {
        type: ObjectId,
        ref: 'Category', //model name
        required: true
    },
    quantity:{
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean
    }
}, {timestamps: true});

export default mongoose.model('Product', productSchema);

 
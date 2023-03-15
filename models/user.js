import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        minLength: 3,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 64
    },
    address: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);

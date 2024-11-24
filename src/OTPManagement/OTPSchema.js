
import mongoose from "mongoose";

export const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '8m',
        default: Date.now
    },
    verified:{
        type:Boolean,
        default:false
    }
});
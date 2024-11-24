

import mongoose from "mongoose";

export const LikesSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    refId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    refType:{
        type:String,
        enum:['Post','Comment'],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
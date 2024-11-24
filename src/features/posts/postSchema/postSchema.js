
import mongoose from "mongoose";
import { LikesSchema } from "../../likes/likes-Schema/likesSchema.js";


export const PostSchema = new mongoose.Schema({
    caption :{
        type:String
    },
    imageUrl:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
});
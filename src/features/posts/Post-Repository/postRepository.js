import mongoose from "mongoose";

import { PostSchema } from "../postSchema/postSchema.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";
 
export const PostModel = new mongoose.model('Post',PostSchema);

export default class PostRepository{

    async createPost(post){
        try{
            const newPost = new PostModel(post);
            await newPost.save();
            await newPost.populate({
                path:'createdBy',
                select:'name email'
            });
            newPost.imageUrl =  `http://localhost:${process.env.PORT}/${post.imageUrl}`;
            return newPost;
        }catch(err){
             if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async getallPost(){
        try{
            const posts = await PostModel.find().sort({createdAt:-1})
            .populate({
                path: 'createdBy',  // Populate the 'createdBy' field
                select: 'name email'  // Select only the 'name' and 'email' fields from the User model
            });

            const postFeed = posts.map(post =>({
                id:post._id,
                caption:post.caption,
                imageUrl : `http://localhost:${process.env.PORT}/${post.imageUrl}`,
                createdAt:post.createdAt,
                createdBy: {
                    id: post.createdBy._id,
                    name: post.createdBy.name,
                    email: post.createdBy.email
                }
        
            }));
            return postFeed;
        }catch(err){
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async getPost(userId){
        try{
            const posts = await PostModel.find({ createdBy: userId}).sort({createdAt:-1})
            .populate({
                path: 'createdBy',  // Populate the 'createdBy' field
                select: 'name email'  // Select only the 'name' and 'email' fields from the User model
            });

            const postFeed = posts.map(post =>({
                id:post._id,
                caption:post.caption,
                imageUrl : `http://localhost:${process.env.PORT}/${post.imageUrl}`,
                createdAt:post.createdAt,
                createdBy: {
                    id: post.createdBy._id,
                    name: post.createdBy.name,
                    email: post.createdBy.email
                }
            }));
            return postFeed;
        }catch(err){
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async getSpecificPost(postId){
        try{
            const post = await PostModel.findById(postId)
            .populate({
                path: 'createdBy',  // Populate the 'createdBy' field
                select: 'name email'  // Select only the 'name' and 'email' fields from the User model
            });

            post.imageUrl = `http://localhost:${process.env.PORT}/${post.imageUrl}`;
            return post;
        }catch(err){
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async updatePost(postId,caption,imageUrl,userId){
        try{
            const post = await PostModel.findOne({_id:postId});
 
            if(post.createdBy.equals(userId)){
               if(caption){
                post.caption = caption;
               }
                if(imageUrl){
                    post.imageUrl = imageUrl
                }

                await post.save();
                await post.populate({
                    path: 'createdBy',  // Populate the 'createdBy' field
                    select: 'name email'  // Select only the 'name' and 'email' fields from the User model
                })
                return post;
            }else{
                throw new ApplicationError("Action Not Allowed",403);
            }
        }catch(err){
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async deletePost(postId,userId){
        try{
            const deletePost = await PostModel.findOneAndDelete({_id:postId,createdBy:userId});

            if(deletePost){
                return deletePost;
            }else{
                throw new ApplicationError("Action Not Allowed",403);
            }
        }catch(err){
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }
}
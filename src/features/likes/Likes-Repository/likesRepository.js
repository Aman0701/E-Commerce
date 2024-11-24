import mongoose from "mongoose";

import { PostModel } from "../../posts/Post-Repository/postRepository.js";
import { LikesSchema } from "../likes-Schema/likesSchema.js";
import { CommentModel } from "../../comments/Comment-Repository/commentRepository.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";


const likesModel = mongoose.model('Like', LikesSchema)

export default class LikesRepository {


    async toggleLikes(like) {

        try {
            const likes = await likesModel.findOneAndDelete({ refId: like.refId, userId: like.userId });
            if (likes) {
                if (likes.refType == 'Post') {
                    await PostModel.findByIdAndUpdate(like.refId, {
                        $pull: { likes: likes._id }  // Removing a user from likes
                    });
                } else {
                    await CommentModel.findOneAndUpdate(like.refId, {
                        $pull: { likes: likes._id }
                    })
                }
                return likes;
            } else {
                const likes = new likesModel(like);

                await likes.save();
                await likes.populate({
                    path: 'userId',
                    select: 'name email'
                });
                if (likes.refType == 'Post') {    
                             
                    await PostModel.findByIdAndUpdate(likes.refId, {
                        $push: { likes: likes._id }  // Removing a user from likes
                    });
                } else {
                    await CommentModel.findOneAndUpdate(likes.refId, {
                        $push: { likes: likes._id }
                    })
                }
                return likes;
            }
        } catch (err) {
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async getLikes(id) {
        try {
            const post = await PostModel.findById(id)
                .populate({
                    path: 'likes.userId',
                    select: 'name email'
                })
            if (post) {
                return post.likes;
            }
            const comment = await CommentModel.findById(id)
                .populate({
                    path: 'likes.userId',
                    select: 'name email'
                })
            if (comment) {
                return comment.likes;
            }
            throw new ApplicationError("No post or comment found with this ID", 404);
        } catch (err) {
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
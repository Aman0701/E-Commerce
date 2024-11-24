import mongoose from "mongoose";
import { commentSchema } from "../Comment-Schema/commentSchema.js";
import { PostModel } from "../../posts/Post-Repository/postRepository.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";

export const CommentModel = new mongoose.model('Comments', commentSchema);

export default class CommentRepository {

    async createComment(comment) {
        try {

            const newComment = new CommentModel(comment);
            await newComment.save();
            const post = await PostModel.findByIdAndUpdate(comment.postId, { $push: { comments: newComment._id } }, { new: true })
            await newComment.populate({
                path: 'createdBy',
                select: 'name email'
            })
            return newComment;
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

    async updateComment(commentId, userId, content) {
        try {

            const comment = await CommentModel.findOneAndUpdate(
                { _id: commentId, createdBy: userId },  // Query: Match both commentId and createdBy
                { $set: { content: content } },  // Update: Set the new content
                { new: true }  // Options: Return the updated document
            )
                .populate({
                    path: 'createdBy',  // Populate the 'createdBy' field
                    select: 'name email'
                })
            if (comment) {
                return comment;
            }
            throw new ApplicationError('Action Not Allowed',403);
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

    async deleteComment(commentId, userId) {
        try {

            const deletedcomment = await CommentModel.findOneAndDelete(
                { _id: commentId, createdBy: userId } // Options: Return the updated document
            )

            if (deletedcomment) {
                 await PostModel.findByIdAndUpdate(deletedcomment.postId,{
                    $pull:{comments:deletedcomment._id}
                });

                return deletedcomment;
            }
            const comment = await CommentModel.findById(commentId);
            const post = await PostModel.findById(comment.postId);
            if (post.createdBy.equals(userId)) {
                const deleteComment = await CommentModel.findOneAndDelete(
                    { _id: commentId } // Options: Return the updated document
                );

                await PostModel.findByIdAndUpdate(deletedcomment.postId,{
                    $pull:{comments:deleteComment._id}
                });
                if (deleteComment) {
                    return deleteComment;
                }
            }

            throw new ApplicationError("Action Not Allowed",403);


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

    async getComments(postId){
        try {
            const comments = await CommentModel.find({postId:postId})
            .populate({
                path: 'createdBy',
                select: 'name email'
            })
            return comments;
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
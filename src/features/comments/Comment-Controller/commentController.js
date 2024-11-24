
import CommentRepository from "../Comment-Repository/commentRepository.js";
import CommentModel from "../Comment-Models/commentModel.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";


export default class CommentController {

    constructor() {
        this.CommentRepository = new CommentRepository();
    }

    async createComment(req, res, next) {
        try {
            const userId = req.userID;
            const postId = req.params.postId;
            console.log(postId);
            
            const { content } = req.body;
            const comment = new CommentModel(content, userId, postId);

            const newComment = await this.CommentRepository.createComment(comment);

            return res.status(200).send(newComment);
        } catch (err) {
            next(err);
        }
    }

    async updateComment(req, res, next) {
        try {
            const commentId = req.params.commentId;
            const userId = req.userID;
            const { content } = req.body;

            const updateComment = await this.CommentRepository.updateComment(commentId, userId, content);

            if (updateComment) {
                return res.status(200).send(updateComment);
            } else {
                throw new ApplicationError('Action Not Allowed', 403);
            }
        } catch (err) {
            next(err);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const commentId = req.params.commentId;
            const userId = req.userID;

            const deleteComment = await this.CommentRepository.deleteComment(commentId, userId);

            if (deleteComment) {
                return res.status(204).send(deleteComment);
            } else {
                throw new ApplicationError('Action Not Allowed', 403);
            }
        } catch (err) {
            next(err);
        }
    }

    async getComments(req, res, next) {
        try {
            const postId = req.params.postId;
            const comments = await this.CommentRepository.getComments(postId);

            return res.status(200).send(comments);
        } catch (err) {
            next(err);
        }
    }
}
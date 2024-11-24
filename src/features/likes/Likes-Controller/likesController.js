import { ApplicationError } from "../../../error-handler/applicationError.js";
import { CommentModel } from "../../comments/Comment-Repository/commentRepository.js";
import { PostModel } from "../../posts/Post-Repository/postRepository.js";
import LikesRepository from "../Likes-Repository/likesRepository.js";

import LikesModel from "../Likes-model/likesModel.js";

export default class LikesController {

    constructor() {
        this.LikesRepository = new LikesRepository();
    }

    async toggleLikes(req, res, next) {
        try {
            const userId = req.userID;
            const id = req.params.id;
             
            const post = await PostModel.findById(id);
            
            if (post) {
                const like = new LikesModel(id, userId, 'Post');
                const newLikes = await this.LikesRepository.toggleLikes(like);
                return res.status(200).send(newLikes);
            }
            const comment = await CommentModel.findById(id);
            if (comment) {
                const like = new LikesModel(id, userId, 'Comment');
                const newLikes = await this.LikesRepository.toggleLikes(like);
                return res.status(200).send(newLikes);
            }
            throw new ApplicationError('No post or comment found with this ID', 404);
        } catch (err) {
            next(err);
        }
    }

    async getLikes(req, res, next) {
        try {
            const id = req.params.id;

            const likes = await this.LikesRepository.getLikes(id);
            return res.status(200).send(likes);
        } catch (err) {
            next(err);
        }
    }
}
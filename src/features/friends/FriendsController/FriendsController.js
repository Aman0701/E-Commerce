import UserRepository from "../../../User/User-Repository/userRepository.js";

export default class FriendsController {
    constructor() {
        this.UserRepository = new UserRepository();
    }
    async toggleFriendRequest(req, res) {
        const userId = req.userID;
        const friendId = req.params.friendId;

        const user = await this.UserRepository.toggleFriendRequest(userId, friendId);

        return res.status(200).send('Successfull')
    }

    async acceptRequest(req, res, next) {
        try {
            const userId = req.userID;
            const friendId = req.params.friendId;

            const user = await this.UserRepository.acceptRequest(userId, friendId);
            return res.status(200).send('Accepted')
        } catch (err) {
            next(err);
        }
    }
    async rejectRequest(req, res, next) {
        try {
            const userId = req.userID;
            const friendId = req.params.friendId;

            const user = await this.UserRepository.rejectRequest(userId, friendId);
            return res.status(200).send('Rejected')
        } catch (err) {
            next(err);
        }
    }
    async getFriends(req, res, next) {
        try {
            const userId = req.params.userId;

            const user = await this.UserRepository.getFriends(userId);
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }
    async getSentRequest(req, res, next) {
        try {
            const userId = req.userID;

            const user = await this.UserRepository.getSentRequest(userId);
            return res.status(200).send(user);
        } catch (err) {
            next(err)
        }
    }
    async getReceivedRequest(req, res, next) {
        try {
            const userId = req.userID;

            const user = await this.UserRepository.getReceivedRequest(userId);
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }
}
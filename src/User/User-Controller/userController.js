import jwt from "jsonwebtoken";
import UserRepository from "../User-Repository/userRepository.js";
import bcrypt from 'bcrypt';
import UserModel from "../User-Model/UserModel.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class UserController {
    constructor() {
        this.UserRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        try {
            const { name, email, password, gender } = req.body;

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new UserModel(name, email, hashedPassword, gender);

            const newUser = await this.UserRepository.signUp(user);
            if (newUser) {
                res.status(200).send(user);
            } else {
                throw new ApplicationError("Email Already Exist", 409)
            }
        } catch (err) {
            next(err);
        }


    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await this.UserRepository.signIn(email, password);

            if (user) {
                const token = jwt.sign({
                    userId: user._id,
                    userEmail: user.email
                },
                    process.env.JWT_TOKEN,

                );
                res.cookie('Token', token, {
                    httpOnly: true,
                    secure: false
                })

                user.login.push(token);
                await user.save();
                return res.status(200).send(token);
            } else {
                throw new ApplicationError("Invalid Credentials", 401);
            }
        } catch (err) {
            next(err);
        }
    }

    async getAllUser(req, res, next) {
        try {
            const user = await this.UserRepository.getAllUser();
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const userEmail = req.email;
            const token = req.cookies.Token;
            res.clearCookie('Token', { path: '/' });
            const user = await this.UserRepository.logout(userEmail, token);
            return res.status(200).send('Logout Successfully');
        } catch (err) {
            next(err);
        }
    }

    async logoutAll(req, res, next) {
        try {
            const userEmail = req.email;
            res.clearCookie('Token', { path: '/' });
            const user = await this.UserRepository.logoutAll(userEmail);
            return res.status(200).send('Logout Successfull from every place');
        } catch (err) {
            next(err);
        }
    }

    async addAvatar(req, res, next) {
        try {
            const userId = req.userID;
            let imageUrl = req.file.path;

            const user = await this.UserRepository.addAvatar(userId, imageUrl);

            user.avatar = `http://localhost:${process.env.PORT}/${imageUrl}`;
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.userID;
            const updateUserId = req.params.userId;
            if (userId != updateUserId) {
                throw new ApplicationError("Action not Allowed", 403);
            }
            let imageUrl;
            if (req.file) {
                imageUrl = req.file.path;
            }
            console.log(imageUrl);
            
            const { name, gender } = req.body;
            const updateUser = await this.UserRepository.updateProfile(userId, imageUrl, name, gender);
            if (updateUser.avatar) {
                updateUser.avatar = `http://localhost:${process.env.PORT}/${imageUrl}`;
            }
            return res.status(200).send(updateUser);
        } catch (err) {
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const user = await this.UserRepository.getSpecificUser(userId);

            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }
}
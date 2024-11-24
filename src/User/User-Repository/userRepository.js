import mongoose from "mongoose";
import { UserSchema } from "../User-Schema/UserSchema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import bcrypt from 'bcrypt';



const UserModel = mongoose.model('User', UserSchema);


export default class UserRepository {


    async signUp(user) {
        try {
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser
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

    async signIn(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApplicationError("No user found", 404);
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;
            } else {
                throw new ApplicationError("Invalid Credentials", 401);
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

    async getAllUser() {
        try {
            const users = await UserModel.find().select('-password -login -requestReceived -requestSent');
            if (users) {
                return users
            } else {
                throw new ApplicationError("No user found", 404);
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

    static async getUser(email) {
        try {
            const user = await UserModel.findOne({ email: email });
            return user;
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

    async getSpecificUser(userId) {
        try {
            const user = await UserModel.findOne({ _id: userId }).select('-password -login -requestReceived -requestSent');
            if(!user){
                throw new ApplicationError('No user found',404);
            }
            return user;
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

    async logout(email, token) {
        try {
            const user = await UserModel.findOne({ email: email }).select('-password -requestReceived -requestSent');
            for (let i = 0; i < user.login.length; i++) {
                if (user.login[i] == token) {
                    user.login.splice(i, 1);
                    break;
                }
            }
            await user.save();
            return user;
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
    async logoutAll(email) {
        try {
            const user = await UserModel.findOne({ email: email }).select('-password -login -requestReceived -requestSent');
            user.login = [];
            await user.save();
            return user;
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

    async toggleFriendRequest(userId, friendId) {
        try {
            const user = await UserModel.findById(userId).select('-password -login');
            const friend = await UserModel.findById(friendId).select('-password -login');
            if (!user || !friend) {
                throw new ApplicationError('user Not Found', 404);
            }
            if(user.friends.includes(friendId)){
                throw new ApplicationError("Already Friends",409)
            }
            const friendRequestExist = friend.requestReceived.includes(userId);

            if (friendRequestExist) {
                await UserModel.findByIdAndUpdate(userId, {
                    $pull: { requestSent: friendId }
                });
                await UserModel.findByIdAndUpdate(friendId, {
                    $pull: { requestReceived: userId }
                })
                return user;
            } else {
                await UserModel.findByIdAndUpdate(userId, {
                    $addToSet: { requestSent: friendId }
                });
                await UserModel.findByIdAndUpdate(friendId, {
                    $addToSet: { requestReceived: userId }
                })
                return user;
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

    async acceptRequest(userId, friendId) {
        // const session = await mongoose.startSession();
        try {
            // session.startTransaction();
            const user = await UserModel.findById(userId).select('-password -login');
            const friend = await UserModel.findById(friendId).select('-password -login');
            if (!user || !friend) {
                throw new ApplicationError('user Not Found', 404);
            }
            const friendRequestExist = user.requestReceived.includes(friendId);
            if (friendRequestExist) {
                await UserModel.findByIdAndUpdate(userId, {
                    $addToSet: { friends: friendId }
                });
                await UserModel.findByIdAndUpdate(friendId, {
                    $addToSet: { friends: userId }
                });
                await UserModel.findByIdAndUpdate(userId, {
                    $pull: { requestReceived: friendId }
                });
                await UserModel.findByIdAndUpdate(friendId, {
                    $pull: { requestSent: userId }
                })
            }
            // await session.commitTransaction();
            return user;
        } catch (err) {
            // await session.abortTransaction();
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
        // }finally{
        //     session.endSession();
        // }
    }
    async rejectRequest(userId, friendId) {
        // const session = await mongoose.startSession();
        try {
            // session.startTransaction();
            const user = await UserModel.findById(userId).select('-password -login');
            const friend = await UserModel.findById(friendId).select('-password -login');
            if (!user || !friend) {
                throw new ApplicationError('user Not Found', 404);
            }
            const friendRequestExist = user.requestReceived.includes(friendId);
            if (friendRequestExist) {
                await UserModel.findByIdAndUpdate(userId, {
                    $pull: { requestReceived: friendId }
                });
                await UserModel.findByIdAndUpdate(friendId, {
                    $pull: { requestSent: userId }
                })
            }
            // await session.commitTransaction();
            return user;
        } catch (err) {
            // await session.abortTransaction();
            if (err instanceof ApplicationError) {
                // Let custom errors propagate as they are
                throw new ApplicationError(err.message, err.code);
            } else {
                // Catch actual database errors or any unexpected errors
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
        // }finally{
        //     session.endSession();
        // }
    }
    async getFriends(userId) {
        try {
            const user = await UserModel.findById(userId).select('-password -login -requestReceived -requestSent')
                .populate({
                    path: 'friends',  // Populate the 'createdBy' field
                    select: 'name email'
                })
                if(user){
                    return user.friends;
                }
            throw new ApplicationError('user Not Found', 404);
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
    async getSentRequest(userId) {
        try {
            const user = await UserModel.findById(userId).select('-password -login')
                .populate({
                    path: 'requestSent',  // Populate the 'createdBy' field
                    select: 'name email'
                });
                if(user){
                    return user.requestSent;
                }
                throw new ApplicationError('user Not Found', 404);
            
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
    async getReceivedRequest(userId) {
        try {
            const user = await UserModel.findById(userId).select('-password -login')
                .populate({
                    path: 'requestReceived',  // Populate the 'createdBy' field
                    select: 'name email'
                })
                if(user){
                    return user.requestReceived;
                }
                throw new ApplicationError('user Not Found', 404);
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
    async addAvatar(userId, imageUrl) {
        try {
            const user = await UserModel.findById(userId).select('-password -login -requestReceived -requestSent');

            if (user) {
                user.avatar = imageUrl;
                await user.save();
                return user;
            } else {
                throw new ApplicationError("No user found", 404);
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
    async updateProfile(userId, imageUrl, name, gender) {
        try {
            const user = await UserModel.findById(userId).select('-password -login -requestReceived -requestSent');

            if (user) {
                if (imageUrl) {
                    user.avatar = imageUrl;
                }
                if (name) {
                    user.name = name;
                }
                if (gender) {
                    user.gender = gender;
                }
                await user.save();
                return user;
            } else {
                throw new ApplicationError("No user found", 404);
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
}
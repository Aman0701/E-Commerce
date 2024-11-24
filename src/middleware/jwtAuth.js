

import jwt from 'jsonwebtoken';
import UserRepository from '../User/User-Repository/userRepository.js';
import { UserSchema } from '../User/User-Schema/UserSchema.js';
import { ApplicationError } from '../error-handler/applicationError.js';

const jwtAuth = async (req, res, next) => {

    //Read the token.

    const token = req.cookies.Token;

    // If no token return the error.
    if (!token) {
        return res.status(401).send('Unaothorized');
    }

    // Check if token is valid.
    try {


        const payload = jwt.verify(token, process.env.JWT_TOKEN);
        //check if user email is present in data
        const email = payload.userEmail;

        const user = await UserRepository.getUser(email);
        if (user) {
            let validToken = false;

            for (let i = 0; i < user.login.length; i++) {
                if (user.login[i] == token) {
                    validToken = true;
                }
            }
            if (validToken) {
                // inserting userid and email to request 
                req.userID = user._id;
                req.email = user.email;
            } else {
                return res.status(401).send('Unauthorized');
            }


        } else {
            return res.status(404).send('No user found');

        }
    } catch (err) {
        return res.status(401).send('Unauthorized');
    }
    //call the next middleware.
    next();

}

export default jwtAuth;
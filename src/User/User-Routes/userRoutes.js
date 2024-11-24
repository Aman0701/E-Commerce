import express from 'express';

import UserController from '../User-Controller/userController.js';
import jwtAuth from '../../middleware/jwtAuth.js';
import { upload } from '../../middleware/fileUploadMiddleware.js';


const userRouter = express.Router();

const userController = new UserController;

userRouter.post('/signup',(req,res,next)=>{
    userController.signUp(req,res,next);
});

userRouter.post('/signin',(req,res,next) =>{
    userController.signIn(req,res,next);
})

userRouter.get('/get-all-details',jwtAuth,(req,res,next) =>{
    userController.getAllUser(req,res,next);
});

userRouter.get('/logout',jwtAuth,(req,res,next) =>{
    userController.logout(req,res,next);
});

userRouter.get('/logout-all-devices',jwtAuth,(req,res,next) =>{
    userController.logoutAll(req,res,next); 
});

userRouter.post('/addavatar',jwtAuth,upload.single('imageUrl'),(req,res,next) =>{
    userController.addAvatar(req,res,next);
});

userRouter.put('/update-details/:userId',jwtAuth,upload.single('imageUrl'),(req,res,next) =>{
    userController.updateProfile(req,res,next);
});

userRouter.get('/get-details/:userId',jwtAuth,(req,res,next) =>{
    userController.getUser(req,res,next);
})

export default userRouter
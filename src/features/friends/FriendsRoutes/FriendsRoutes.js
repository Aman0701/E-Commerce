import express from 'express';

import FriendsController from '../FriendsController/FriendsController.js';

const friendsRouter = express.Router();

const friendsController = new FriendsController;

friendsRouter.get('/toggle-friendship/:friendId',(req,res,next) =>{
    friendsController.toggleFriendRequest(req,res,next);
});

friendsRouter.get('/accept-request/:friendId',(req,res,next)=>{
    friendsController.acceptRequest(req,res,next);
});
friendsRouter.get('/reject-request/:friendId',(req,res,next)=>{
    friendsController.rejectRequest(req,res,next);
});
friendsRouter.get('/get-friends/:userId',(req,res,next)=>{
    friendsController.getFriends(req,res,next);
});
friendsRouter.get('/getsent-request',(req,res,next)=>{
    friendsController.getSentRequest(req,res,next);
});
friendsRouter.get('/getreceived-request',(req,res,next)=>{
    friendsController.getReceivedRequest(req,res,next);
});

export default friendsRouter;
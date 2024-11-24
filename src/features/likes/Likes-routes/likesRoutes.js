import express from 'express';

import LikesController from '../Likes-Controller/likesController.js';

const likesRouter = express.Router();

const likesController = new LikesController;

likesRouter.get('/toggle/:id',(req,res,next)=>{
    likesController.toggleLikes(req,res,next);
});

likesRouter.get('/:id',(req,res,next) =>{
    likesController.getLikes(req,res,next);
})




export default likesRouter;
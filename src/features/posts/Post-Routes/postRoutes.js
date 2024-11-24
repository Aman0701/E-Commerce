import express from 'express';

import PostController from '../Post-Controller/postController.js';
import { upload } from '../../../middleware/fileUploadMiddleware.js';

const postRouter = express.Router();

const postController = new PostController;

postRouter.get('/',(req,res,next) =>{
    postController.getPost(req,res,next);
});

postRouter.post('/',upload.single('imageUrl'),(req,res,next) =>{
    postController.createPost(req,res,next);
});

postRouter.get('/all',(req,res,next) =>{
    postController.getAllPost(req,res,next);
});



postRouter.get('/:postId',(req,res,next) =>{
    postController.getSpecificPost(req,res,next);
})

postRouter.put('/:postId',upload.single('imageUrl'),(req,res,next) => {
    postController.updatePost(req,res,next);
});

postRouter.delete('/:postId',(req,res,next) => {
    postController.deletePost(req,res,next);
})



export default postRouter;
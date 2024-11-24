
import PostRepository from "../Post-Repository/postRepository.js";
import PostModel from "../Post-Model/postModel.js";


export default class PostController{
    constructor(){
        this.PostRepository = new PostRepository();
    }

    async createPost(req,res,next){    
       try{
        const {caption} = req.body;
        const imageUrl = req.file.path;
        const userId = req.userID;
        const post = new PostModel(caption,imageUrl,userId,Date.now());
        const newPost = await this.PostRepository.createPost(post);

        return res.status(200).send(newPost);
       }catch(err){
        next(err);
       }
    }

    async getAllPost(req,res,next){
        try{
            const posts = await this.PostRepository.getallPost();
        return res.status(200).send(posts);
        }catch(err){
            next(err);
        }
    }

    async getPost(req,res,next){
       try{
        const userId = req.userID;
        const posts = await this.PostRepository.getPost(userId);

        return res.status(200).send(posts);
       }catch(err){
        next(err);
       }
    }

    async getSpecificPost(req,res,next){
        try{
            const postId = req.params.postId;
        const post = await this.PostRepository.getSpecificPost(postId);
        console.log(post);
        
        return res.status(200).send(post);
        }catch(err){
            next(err);
        }
    }

    async updatePost(req,res,next){
        try{
            const postId = req.params.postId;
        const {caption} = req.body;
        let imageUrl;
        if(req.file){
           imageUrl = req.file.path;
        }
        const userId = req.userID;
        const updatePost = await this.PostRepository.updatePost(postId,caption,imageUrl,userId);

        return res.status(200).send(updatePost);
        }catch(err){
            next(err);
        }
    }

    async deletePost(req,res,next){
        try{
            const postId = req.params.postId;
        const userId = req.userID;
        const deletePost = await this.PostRepository.deletePost(postId,userId);

        return res.status(204).send("Post Deleted Successfully");
        }catch(err){
            next(err);
        }
    }
}
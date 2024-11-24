

export default class CommentModel{
    constructor(content,createdBy,postid){
        this.content = content;
        this.createdBy = createdBy;
        this.postId = postid;
        this.createdAt = Date.now();
    }
}
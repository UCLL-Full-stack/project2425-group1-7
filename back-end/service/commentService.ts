import { Comment } from "../model/comment";
import commentDb from "../repository/comment.db";
import { CommentInput } from "../types";

const createComment = async (c: CommentInput): Promise<void> =>{
    try{
        const comment = new Comment({
            body: c.body, 
            reviewId: c.reviewId
        });
        commentDb.createComment(comment, c.authorId);
    }catch(e){
        throw e
    }
}

export default{
    createComment
}

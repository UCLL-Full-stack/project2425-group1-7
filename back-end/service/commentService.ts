import commentDb from "../repository/comment.db";
import { Comment } from "../model/comment";
import { CommentInput, Role } from "../types";

const createComment = async (c: CommentInput): Promise<Comment> =>{
    try{
        const comment = new Comment({
            body: c.body, 
            reviewId: c.reviewId
        });
        return commentDb.createComment(comment, c.authorId);
    }catch(e){
        throw e
    }
}

const deleteComment = async (id: number, role: Role, username: string):Promise<void>=>{
    try{
        const comment = await commentDb.getById(id);
        if(
            role !== 'admin' && 
            role !== 'moderator' && 
            comment.getAuthor()?.username !== username
        ) throw new Error("You are not authorized to access this resource");

        await commentDb.deleteById(id);
    }catch(e){
        throw e;
    }
};

export default{
    createComment,
    deleteComment
}

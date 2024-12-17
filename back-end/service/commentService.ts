import commentDb from "../repository/comment.db";
import { CommentInput } from "../types";

const createComment = async (comment: CommentInput)=>{
    try{
        commentDb.createComment(comment);
    }catch(e){
        throw e
    }
}

export default{
    createComment
}

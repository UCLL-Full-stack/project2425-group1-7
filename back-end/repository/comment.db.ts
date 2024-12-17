import { Comment } from "../model/comment";
import { CommentInput } from "../types";
import database from "../util/database";

const createComment = async (comment:CommentInput): Promise<Comment>=>{
    try{
        const commentPrisma = await database.comment.create({
            data:{
                body: comment.body,
                author: {
                    connect: {id: comment.authorId}
                },
                review: {
                    connect: {id: comment.reviewId}
                }
            },
            include:{
                author: true,
                review: true
            }
        })
        return Comment.from(commentPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    }
}

export default {
    createComment
}

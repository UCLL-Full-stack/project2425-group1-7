import { Comment } from "../model/comment";
import database from "../util/database";

const createComment = async (comment: Comment, authorId: number): Promise<Comment>=>{
    try{
        const commentPrisma = await database.comment.create({
            data:{
                body: comment.getBody(),
                author: {
                    connect: {id: authorId}
                },
                review: {
                    connect: {id: comment.getReview()}
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

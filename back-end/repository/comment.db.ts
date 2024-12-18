import { Comment } from "../model/comment";
import database from "../util/database";

const getById = async (id:number): Promise<Comment> => {
    try{
        const commentPrisma = await database.comment.findUnique({
            where: {id},
            include: {
                author: true
            }
        }); 
        if (!commentPrisma)throw new Error("Comment doesn't exist");
        return Comment.from(commentPrisma);
    }catch(e){
        throw new Error("DB ERROR")
    }
}

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

const deleteById = async (id: number)=>{
    try{
        await database.comment.delete({
            where: {id}
        })
    }catch(e){
        throw new Error("DB ERROR")
    }
}

export default {
    getById,
    createComment,
    deleteById
}

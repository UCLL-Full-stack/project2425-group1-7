import { Review } from "../model/review";
import database from "../util/database"

const findAllReviews = async(): Promise<Review[]> => {
    try{
        const reviewsPrisma = await database.review.findMany({
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        }); 
        if(!reviewsPrisma) return [];
        return reviewsPrisma.map(review=>Review.from(review));
    }catch(e){
        throw new Error("DB error");
    }
}

const findById = async(id: number): Promise<Review | null> => {
    try{
        const reviewPrisma = await database.review.findUnique({
            where: {id},
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        })
        if (!reviewPrisma) return null;
        return Review.from(reviewPrisma);
    }catch(e){
        throw new Error("DB Error");
    }
}

const findByAlbumId = async(id: string): Promise<Review[] | null> => {
    try{
        const reviewsPrisma = await database.review.findMany({
            where: {albumID: id},
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        })
        if (!reviewsPrisma) return null;
        return reviewsPrisma.map(r=>Review.from(r));
    }catch(e){
        throw new Error("DB Error");
    }
}

const findUserReviews = async(id: number): Promise<Review[]>=>{
    try{
        const reviewsPrisma = await database.review.findMany({
            where: {authorId: id},
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        });
        if(!reviewsPrisma) return [];
        return reviewsPrisma.map(review=>Review.from(review));
    }catch(e){
        throw new Error("DB ERROR (review)");
    }
}

const createReview = async (review: Review, authorId: number): Promise<Review>=>{
    try{
        const reviewPrisma = await database.review.create({
            data:{
                title: review.getTitle(),
                body: review.getBody(),
                albumID: review.getAlbum(),
                starRating: review.getStarRating(),
                author: {
                    connect: {id: authorId}
                },
            },
            include:{
                author: true
            }
        });
        return Review.from(reviewPrisma);
    }catch(e){
        throw new Error("DB ERROR (review)");
    }
}

const editReview = async (review: Review, id: number): Promise<Review> => {
    try{
        const reviewPrisma = await database.review.update({
            data:{
                title: review.getTitle(),
                body: review.getBody(),
                albumID: review.getAlbum(),
                starRating: review.getStarRating(),
            },
            where: {id},
            include: {
                author: true,
                likes: true
            }
        })
        return Review.from(reviewPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const unlikeReview = async (id:number, username: string): Promise<Review> => {
    try{
        const reviewPrisma = await database.review.update({
            where: {id},
            data:{
                likes: { disconnect: {username}}
            },
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        })
        return Review.from(reviewPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const likeReview = async (id:number, username: string): Promise<Review> => {
    try{
        const reviewPrisma = await database.review.update({
            where: {id},
            data:{
                likes: { connect: {username}}
            },
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        })
        return Review.from(reviewPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const deleteReview = async (id: number)=>{
    try{
        await database.comment.deleteMany({
            where: {reviewId: id}
        });

        await database.review.delete({
            where: {id: id}
        });
        return id;
    }catch(e){
        throw new Error("DB ERROR (review)");
    }
}

export default{
    findAllReviews,
    findByAlbumId,
    findById,
    findUserReviews,
    createReview,
    editReview,
    deleteReview,
    likeReview,
    unlikeReview,
}

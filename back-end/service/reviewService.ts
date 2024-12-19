import { Review } from "../model/review";
import reviewDb from "../repository/review.db"
import { ReviewInput } from "../types";

const getAllReviews = async(): Promise<Review[]> => {
    try{
        return await reviewDb.findAllReviews();  
    }catch(e){
        throw e;
    }
};

const getReviewById = async(id: number): Promise<Review> => {
    try{
        const review = await reviewDb.findById(id);  
        if (!review) throw new Error("review not found");
        return review;
    }catch(e){
        throw e;
    }
};

const getAlbumReviews = async(id: string): Promise<Review[]> => {
    try{
        const reviews = await reviewDb.findByAlbumId(id);  
        if (!reviews) throw new Error("no Reviews found for "+ id.split('_')[0]);
        return reviews;
    }catch(e){
        throw e;
    }
};

const createReview = async (newReview: ReviewInput): Promise<Review> => {
    try{
        const review = new Review({
            title: newReview.title,
            body: newReview.body, 
            starRating: newReview.starRating,
            albumId: newReview.albumId
        });
        return await reviewDb.createReview(review, newReview.authorId);
    }catch(e){
        throw e;
    }
};

const unlikeReview = async (id: number, username: string): Promise<Review> => {
    const review = await reviewDb.findById(id);
    if(!review){
        throw new Error("Review Does not Exist");
    }

    try{
        return await reviewDb.unlikeReview(id, username);
    }catch(e){
        throw e;
    }
};

const likeReview = async (id: number, username: string): Promise<Review> => {
    const review = await reviewDb.findById(id);
    if(!review){
        throw new Error("Review Does not Exist");
    }

    try{
        return await reviewDb.likeReview(id, username);
    }catch(e){
        throw e;
    }
};

const deleteReview = async (id: number) =>{
    try{
        return await reviewDb.deleteReview(id);
    }catch(e){
        throw e;
    }
};

export default{
    getAllReviews,
    getAlbumReviews,
    getReviewById,
    createReview,
    deleteReview,
    likeReview,
    unlikeReview
}

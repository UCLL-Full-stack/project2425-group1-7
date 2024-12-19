import express, { NextFunction, Request, Response } from 'express';
import reviewService from '../service/reviewService';
import { ReviewInput } from '../types';

export const reviewRouter = express.Router();

reviewRouter.get("/", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    }catch(e){
        next(e);
    }
});

reviewRouter.get("/:id", async(req: Request, res: Response, next: NextFunction)=>{
    const id = Number(req.params["id"])
    try{
        const review = await reviewService.getReviewById(id);
        res.status(200).json(review);
    }catch(e){
        next(e);
    }
});

reviewRouter.get("/album/:id", async(req: Request, res: Response, next: NextFunction)=>{
    const id = String(req.params["id"])
    try{
        const reviews = await reviewService.getAlbumReviews(id);
        res.status(200).json(reviews);
    }catch(e){
        next(e);
    }
});

reviewRouter.post("/", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const reviewInput: ReviewInput = req.body;
        const review = await reviewService.createReview(reviewInput);
        res.status(200).json(review);
    }catch(e){
        next(e);
    }
});

reviewRouter.put('/:id', async (req: Request, res: Response, next: NextFunction)=>{

    try{
        const request = req as Request & {auth: {username: string}}
        const {username}= request.auth;
        const id = Number(req.params['id']);
        const review = <ReviewInput> req.body;
        await reviewService.editReview(review, id, username);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});


reviewRouter.delete("/:id", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const id = Number(req.params["id"])
        await reviewService.deleteReview(id);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});

reviewRouter.put("/like/:id", async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const request = req as Request & {auth: {username: string}}
        const {username}= request.auth;
        const id = Number(req.params['id']);
        await reviewService.likeReview(id, username);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});

reviewRouter.put("/unlike/:id", async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const request = req as Request & {auth: {username: string}}
        const {username}= request.auth;
        const id = Number(req.params['id']);
        await reviewService.unlikeReview(id, username);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});

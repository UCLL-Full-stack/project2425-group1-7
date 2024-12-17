import express, { NextFunction, Request, Response } from 'express';
import commentService from '../service/commentService';

export const commentRouter = express.Router();

commentRouter.post('/', async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const comment = commentService.createComment(req.body);
        res.status(200).json(comment);
    }catch(e){
        throw e;
    }
});

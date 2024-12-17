import express, { NextFunction, Request, Response } from 'express';
import commentService from '../service/commentService';
import { Role } from '../types';

export const commentRouter = express.Router();

commentRouter.post('/', async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const comment = await commentService.createComment(req.body);
        res.status(200).json(comment);
    }catch(e){
        next(e);
    }
});

commentRouter.delete('/:id', async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const request = req as Request & {auth: {username: string, role: Role}}
        const {username: username, role}= request.auth;
        const id = Number(req.params['id']);
        await commentService.deleteComment(id, role, username);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});

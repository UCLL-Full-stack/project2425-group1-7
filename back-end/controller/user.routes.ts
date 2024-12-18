import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/userService';
import { Role } from '../types';

export const userRouter = express.Router();

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction)=>{
    const id = Number(req.params["id"]);

    try{
        const user = await userService.getById(id);
        res.status(200).json(user);
    }catch(e){
        next(e); 
    }
});

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction)=>{
    const user = req.body;
    try{
        const newUser = await userService.registerUser(user);
        res.status(200).json(newUser);
    }catch(e){
        next(e);
    }    
});

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await userService.loginUser(req.body);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

userRouter.put('/promote/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const request = req as Request & {auth: {role: Role}}
        const {role}= request.auth;
        const id = Number(req.params['id']);
        const user = await userService.promoteUser(id, role);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

userRouter.put('/follow/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const request = req as Request & {auth: {username: string}}
        const {username}= request.auth;
        const id = Number(req.params['id']);
        const user = await userService.followUser(id, username);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

userRouter.put('/unfollow/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const request = req as Request & {auth: {username: string}}
        const {username} = request.auth;
        const id = Number(req.params['id']);
        const user = await userService.unfollowUser(id, username);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

userRouter.put('/block/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const request = req as Request & {auth: {role: Role}}
        const {role}= request.auth;
        const id = Number(req.params['id']);
        const user = await userService.blockUser(id, role);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

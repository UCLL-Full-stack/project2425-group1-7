/**
 *  @swagger
 *      components:
 *          securitySchemes:
 *              bearerAuth:
 *                  type: http
 *                  scheme: bearer
 *                  bearerFormat: JWT
 *          schemas:
 *              UserInput:
 *                  type: object
 *                  required:
 *                      - username
 *                      - email
 *                      - password
 *                  properties:
 *                      username:
 *                          type: string
 *                          description: Unique username
 *                      email:
 *                          type: string
 *                          format: email
 *                          description: Valid email address
 *                      password:
 *                          type: string
 *                          format: password
 *                          description: User password
 *              LoginInput:
 *                  type: object
 *                  required:
 *                      - email
 *                      - password
 *                  properties:
 *                      email:
 *                          type: string
 *                          format: email
 *                      password:
 *                          type: string
 *                          format: password
 *              User:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                          format: int64
 *                      username:
 *                          type: string
 *                      email:
 *                          type: string
 *                      role:
 *                          type: string
 *                          enum: [user, moderator, admin]
 *                      blocked:
 *                          type: boolean
 *                      followers:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *                      following:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *              AuthResponse:
 *                  type: object
 *                  properties:
 *                      user:
 *                          $ref: '#/components/schemas/User'
 *                      token:
 *                          type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/userService';
import { Role } from '../types';

export const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (requires admin/moderator role)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient privileges
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const request = req as Request & {auth: {role: Role}}
        const {role}= request.auth;
        const users = await userService.getAllUsers(role);
        res.status(200).json(users);
    }catch(e){
        next(e)
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction)=>{
    const id = Number(req.params["id"]);
    try{
        const user = await userService.getById(id);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input or email already exists
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction)=>{
    const user = req.body;
    try{
        const newUser = await userService.registerUser(user);
        res.status(200).json(newUser);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await userService.loginUser(req.body);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /users/promote/{id}:
 *   put:
 *     summary: Promote user to moderator (requires admin role)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to promote
 *     responses:
 *       200:
 *         description: User promoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Insufficient privileges
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /users/follow/{id}:
 *   put:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to follow
 *     responses:
 *       200:
 *         description: Successfully followed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Cannot follow self or already following
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /users/unfollow/{id}:
 *   put:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Not following user
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /users/block/{id}:
 *   put:
 *     summary: Block a user (requires admin/moderator role)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to block
 *     responses:
 *       200:
 *         description: User blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Insufficient privileges
 *       404:
 *         description: User not found
 */
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
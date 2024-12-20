/**
 *  @swagger
 *      components:
 *          securitySchemes:
 *              bearerAuth:
 *                  type: http
 *                  scheme: bearer
 *                  bearerFormat: JWT
 *          schemas:
 *              CommentInput:
 *                  type: object
 *                  required:
 *                      - body
 *                      - reviewId
 *                  properties:
 *                      body:
 *                          type: string
 *                          description: The content of the comment
 *                      reviewId:
 *                          type: number
 *                          description: ID of the review being commented on
 *              Comment:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                          format: int64
 *                      body:
 *                          type: string
 *                      createdAt:
 *                          type: string
 *                          format: date-time
 *                      author:
 *                          $ref: '#/components/schemas/User'
 *                      review:
 *                          $ref: '#/components/schemas/Review'
 *              Error:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                      status:
 *                          type: number
 */

import express, { NextFunction, Request, Response } from 'express';
import commentService from '../service/commentService';
import { Role } from '../types';

export const commentRouter = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
commentRouter.post('/', async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const comment = await commentService.createComment(req.body);
        res.status(200).json(comment);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The deleted comment ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
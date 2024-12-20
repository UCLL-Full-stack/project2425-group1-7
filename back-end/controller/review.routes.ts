/**
 *  @swagger
 *      components:
 *          securitySchemes:
 *              bearerAuth:
 *                  type: http
 *                  scheme: bearer
 *                  bearerFormat: JWT
 *          schemas:
 *              ReviewInput:
 *                  type: object
 *                  required:
 *                      - title
 *                      - body
 *                      - albumID
 *                      - starRating
 *                  properties:
 *                      title:
 *                          type: string
 *                          description: Title of the review
 *                      body:
 *                          type: string
 *                          description: Content of the review
 *                      albumID:
 *                          type: string
 *                          description: ID of the album being reviewed
 *                      starRating:
 *                          type: number
 *                          minimum: 1
 *                          maximum: 5
 *                          description: Rating from 1 to 5 stars
 *              Review:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                          format: int64
 *                      title:
 *                          type: string
 *                      body:
 *                          type: string
 *                      albumID:
 *                          type: string
 *                      starRating:
 *                          type: number
 *                      createdAt:
 *                          type: string
 *                          format: date-time
 *                      author:
 *                          $ref: '#/components/schemas/User'
 *                      comments:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Comment'
 */

import express, { NextFunction, Request, Response } from 'express';
import reviewService from '../service/reviewService';
import { ReviewInput, Role } from '../types';

export const reviewRouter = express.Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
reviewRouter.get("/", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: The review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
reviewRouter.get("/:id", async(req: Request, res: Response, next: NextFunction)=>{
    const id = Number(req.params["id"])
    try{
        const review = await reviewService.getReviewById(id);
        res.status(200).json(review);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /reviews/album/{id}:
 *   get:
 *     summary: Get all reviews for a specific album
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The album ID
 *     responses:
 *       200:
 *         description: List of reviews for the album
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Album not found
 *       500:
 *         description: Server error
 */
reviewRouter.get("/album/:id", async(req: Request, res: Response, next: NextFunction)=>{
    const id = String(req.params["id"])
    try{
        const reviews = await reviewService.getAlbumReviews(id);
        res.status(200).json(reviews);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: The created review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
reviewRouter.post("/", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const reviewInput: ReviewInput = req.body;
        const review = await reviewService.createReview(reviewInput);
        res.status(200).json(review);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: The updated review ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized to edit this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
reviewRouter.put('/:id', async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const request = req as Request & {auth: {username: string, role: Role}}
        const {username, role}= request.auth;
        const id = Number(req.params['id']);
        const review = <ReviewInput> req.body;
        await reviewService.editReview(review, id, username, role);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: The deleted review ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized to delete this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
reviewRouter.delete("/:id", async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const id = Number(req.params["id"])
        await reviewService.deleteReview(id);
        res.status(200).json(id);
    }catch(e){
        next(e);
    }
});
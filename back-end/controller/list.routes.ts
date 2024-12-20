/**
 *  @swagger
 *      components:
 *          securitySchemes:
 *              bearerAuth:
 *                  type: http
 *                  scheme: bearer
 *                  bearerFormat: JWT
 *          schemas:
 *              ListInput:
 *                  type: object
 *                  required:
 *                      - title
 *                      - description
 *                      - albums
 *                  properties:
 *                      title:
 *                          type: string
 *                          description: The title of the list
 *                      description:
 *                          type: string
 *                          description: Description of the list
 *                      albums:
 *                          type: array
 *                          items:
 *                              type: number
 *                          description: Array of album IDs
 *              List:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                          format: int64
 *                      createdAt:
 *                          type: string
 *                          format: date-time
 *                      title:
 *                          type: string
 *                      description:
 *                          type: string
 *                      albums:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Album'
 *              Error:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                      status:
 *                          type: number
 */

import express, { NextFunction, Request, Response } from 'express';
import listService from '../service/listService';
import { ListInput, Role } from '../types';

const listRouter = express.Router();

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Get all lists
 *     tags: [Lists]
 *     responses:
 *       200:
 *         description: List of all lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
listRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lists = await listService.getLists();
        res.status(200).json(lists);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListInput'
 *     responses:
 *       200:
 *         description: The created list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
listRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const list = <ListInput>req.body;
    try {
        const newList = await listService.createList(list);
        res.status(200).json(newList);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists/{id}:
 *   get:
 *     summary: Get a list by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The list ID
 *     responses:
 *       200:
 *         description: The list details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       404:
 *         description: List not found
 *       500:
 *         description: Server error
 */
listRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params["id"]);

    try {
        const list = await listService.getListById(id);
        res.status(200).json(list);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists/{id}:
 *   put:
 *     summary: Update a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The list ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListInput'
 *     responses:
 *       200:
 *         description: The updated list ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized to edit this list
 *       404:
 *         description: List not found
 *       500:
 *         description: Server error
 */
listRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string, role: Role } }
        const { username, role } = request.auth;
        const id = Number(req.params['id']);
        const list = <ListInput>req.body;
        await listService.editList(list, id, username, role);
        res.status(200).json(id);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists/like/{id}:
 *   put:
 *     summary: Like a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The list ID
 *     responses:
 *       200:
 *         description: The liked list ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: List not found
 *       500:
 *         description: Server error
 */
listRouter.put('/like/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string } }
        const { username } = request.auth;
        const id = Number(req.params['id']);
        await listService.likeList(id, username);
        res.status(200).json(id);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists/unlike/{id}:
 *   put:
 *     summary: Unlike a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The list ID
 *     responses:
 *       200:
 *         description: The unliked list ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: List not found
 *       500:
 *         description: Server error
 */
listRouter.put('/unlike/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string } }
        const { username } = request.auth;
        const id = Number(req.params['id']);
        await listService.unlikeList(id, username);
        res.status(200).json(id);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The list ID
 *     responses:
 *       200:
 *         description: The deleted list ID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized to delete this list
 *       404:
 *         description: List not found
 *       500:
 *         description: Server error
 */
listRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params["id"]);

    try {
        await listService.deleteList(id);
        res.status(200).json(id);
    } catch (e) {
        next(e);
    }
});

export { listRouter }
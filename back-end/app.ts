import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from "helmet";
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { listRouter } from './controller/list.routes';
import { userRouter } from './controller/user.routes';
import { expressjwt } from 'express-jwt';
import { reviewRouter } from './controller/review.routes';
import { commentRouter } from './controller/comment.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req: Request, res: Response) => {
    res.json({ message: 'Back-end is running...' });
});

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET??'default_secret',
        algorithms: ['HS256']
    }).unless({
        path: [
            {url: '/users/login', methods: ['POST']},
            {url: '/users/signup', methods: ['POST']},
            {url: '/lists', methods: ['GET']},
            {url: /^\/lists\/[^\/]+$/, methods: ['GET']},
            {url: /^\/reviews\/[^\/]+$/, methods: ['GET']},
            {url: '/reviews', methods: ['GET']},
        ]
    })
);

app.use('/users', userRouter);
app.use('/lists', listRouter);
app.use('/reviews', reviewRouter);
app.use('/comments', commentRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    console.log(err.message);
    res.status(400).json({status: 'application error', message: err.message});
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Yadig API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});

import { 
    Comment as CommentPrisma,
    User as UserPrisma,
} from '@prisma/client'
import { Role, UserInfo } from '../types';

export class Comment{
    private readonly id?: number;
    private readonly createdAt?: Date;
    private readonly author?: UserInfo;
    private body: string;
    private reviewId: number;

    constructor(comment: {
        id?: number
        author?: UserInfo
        body: string
        reviewId: number 
        createdAt?: Date
    }){
        this.validate(comment);
        this.id = comment.id;
        this.author = comment.author;
        this.reviewId = comment.reviewId;
        this.body = comment.body;
        this.createdAt = comment.createdAt;
    }

    static from({  
        id,
        createdAt,
        body,
        author,
        reviewId,
    }:CommentPrisma & {
        author: UserPrisma
    }){
        return new Comment({
            id: id, 
            createdAt: createdAt,
            body: body,
            author: {
                id: author.id,
                role: author.role as Role,
                username: author.username,
                createdAt: author.createdAt,
                isBlocked: author.isBlocked
            },
            reviewId: reviewId
        });
    }

    validate(comment:{
        body: string
        reviewId: number 
    }){
        if(!comment.body) throw new Error('comment cannot be empty');
        if(!comment.reviewId) throw new Error('comment must belong to a review');
    }

    getId(): number | undefined {
        return this.id;
    }

    getBody(): string{
        return this.body;
    }

    getReview(): number{
        return this.reviewId;
    }

    getCreatedAt(): Date | undefined{
        return this.createdAt;
    }

    getAuthor(): UserInfo | undefined{
        return this.author;
    }
}

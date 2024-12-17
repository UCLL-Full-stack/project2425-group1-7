import {
    Review as ReviewPrisma,
    Comment as CommentPrisma,
    User as UserPrisma
} from '@prisma/client';
import { UserInfo } from '../types';
import { Comment } from './comment';

export class Review{
    private readonly id?: number;
    private readonly createdAt?: Date;
    private readonly author?: UserInfo;
    private title: string;
    private body: string;
    private starRating: number;
    private albumId: string;
    private comments?: Comment[];
    private likes?: number[];

    constructor(review: {
        id?: number,
        author?: UserInfo,
        title: string,
        body: string,
        starRating: number,
        albumId: string,
        createdAt?: Date,
        comments?: Comment[],
        likes?: number[]
    }){
        this.validate(review);
        this.id = review.id;
        this.author = review.author;
        this.title = review.title;
        this.body= review.body;
        this.albumId = review.albumId;
        this.starRating = review.starRating;
        this.createdAt = review.createdAt;
        this.comments = review.comments??[];
        this.likes = review.likes??[];
    }

    static from({
                    id,
                    author,
                    createdAt,
                    title,
                    body,
                    starRating,
                    albumID,
                    comments,
                    likes
                }: ReviewPrisma & {
        comments?: (CommentPrisma & {author: UserPrisma})[];
        likes?: UserPrisma[];
        author: UserPrisma;
    }){
        return new Review({
            id: id,
            author: {
                id: author.id, 
                email: author.email,
                username: author.username
            },
            title: title,
            body: body,
            albumId: albumID,
            starRating: starRating,
            createdAt: createdAt,
            comments: comments?.map(comment=>Comment.from(comment))??[],
            likes: likes?.map(like=>like.id)
        });
    }

    validate(review: {
        title: string,
        body: string,
        starRating: number,
        albumId: string
    }){
        if(!review.title || !review.body)
            throw new Error('title and body cannot be empty');

        if(!review.albumId)
            throw new Error('review need an albumId');

        if(review.starRating < 0 || review.starRating > 5)
            throw new Error('starRating should be between 0 and 5 inclusively');
    }

    getId(): number | undefined{
        return this.id;
    }

    getUser(): UserInfo | undefined{
        return this.author;
    }

    getTitle(): string{
        return this.title;
    }

    getDescription(): string{
        return this.body;
    }

    getStarRating(): number{
        return this.starRating
    }

    getComments(): Comment[] | undefined{
        return this.comments;
    }

    getLikes(): number[] | undefined{
        return this.likes;
    }

    setStarRating(starRating: number) {
        if(starRating < 0 || starRating > 5)
            throw new Error('starRating should be between 0 and 5 inclusively');
        this.starRating = starRating;
    }

    getAlbum(): string{
        return this.albumId;
    }

    getCreatedAt(): Date | undefined{
        return this.createdAt;
    }

    equals(review: Review){
        return (
            this.title === review.title &&
            this.body === review.body &&
            this.starRating === review.starRating &&
            this.albumId === review.albumId &&
            this.likes === review.likes &&
            this.comments === review.comments
        )
    }
};

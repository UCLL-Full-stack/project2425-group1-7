import { List } from "../model/list"
import { Review } from "../model/review"

export type Role = 'admin' | 'moderator' | 'user'

export type UserInfo = {
    id: number,
    createdAt: Date,
    username: string,
    role: Role,
    isBlocked?: boolean,
    reviews?: Review[],
    lists?: List[],
}

export type ListInput = {
    title: string,
    description: string,
    albums: string[],
    authorId: number
}

export type ReviewInput = {
    title: string,
    body: string,
    albumId: string,
    starRating: number,
    authorId: number
}

export type CommentInput = {
    body: string,
    authorId: number,
    reviewId: number
}

export type UserInput = {
    username: string,
    email: string,
    password: string
}

export type AuthResponse = {
    token: string,
    role: Role,
    id: number,
    username: string,
    isBlocked: boolean,
}

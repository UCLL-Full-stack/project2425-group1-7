export type UserInfo = {
    id: number,
    email: string,
    username: string,
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
    email: string,
    id: number,
    username: string
}

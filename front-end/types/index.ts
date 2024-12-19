export type Role = 'user' | 'admin' | 'moderator'

export type Album = {
    id: string,
    name: string,
    artist: string,
    playcount: number,
    image: {"#text": string, size: string}[],
    wiki?: {
        content: string,
        summary: string,
    }
}

export type AlbumResponse = {
    results: {
        albummatches:{
            album: Album[];
        }
    }
}

export type UserInput = {
    username?: string,
    email: string,
    password: string
}

export type ListInput = {
    authorId: number,
    title: string,
    description: string,
    albums: string[]
}

export type ReviewInput = {
    authorId: number,
    title: string,
    body: string,
    albumId: string,
    starRating: number
}

export type CommentInput = {
    authorId: number,
    body: string,
    reviewId: number,
}

export type User = {
    id: number,
    username: string,
    createdAt?: Date,
    role: Role,
    isBlocked: boolean,
    lists?: List[],
    reviews?: Review[],
    followedBy?: number[],
    following?: number[],
}

export type List = {
    id: number,
    author: User,
    createdAt: number,
    title: string,
    description: string,
    likes: number[],
    albumIds: string[]
}

export type Review = {
    id: number,
    author: User,
    createdAt: number,
    title: string,
    body: string,
    albumId: string,
    starRating: number,
    comments: Comment[],
    likes: number[]
}

export type Comment = {
    id: number,
    author: User, 
    createdAt: number,
    body: string,
    reviewId: number
}

export type JWTobject = {
    token: string,
    email: string,
    id: string
}

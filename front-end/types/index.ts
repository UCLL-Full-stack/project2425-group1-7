export type Role = 'user' | 'admin' | 'moderator'

export type Album = {
    id: string,
    name: string,
    artist: string,
    image: {"#text": string, size: string}[],
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

export type UserInfo = {
    id: number,
    username: string,
    createdAt: Date,
    role: Role,
    lists?: List[],
    reviews?: Review[],
}

export type List = {
    id: number,
    author: UserInfo,
    createdAt: number,
    title: string,
    description: string,
    likes: number[],
    albumIds: string[]
}

export type Review = {
    id: number,
    author: UserInfo,
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
    author: UserInfo, 
    createdAt: number,
    body: string,
    reviewId: number
}

export type JWTobject = {
    token: string,
    email: string,
    id: string
}

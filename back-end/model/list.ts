import { 
    List as ListPrisma,
    User as UserPrisma
} from '@prisma/client'
import { Role, UserInfo } from '../types';

export class List{
    private readonly id?: number;
    private readonly createdAt?: Date;
    private readonly author?: UserInfo;
    private title: string;
    private description: string;
    private likes: number[];
    private albumIds: string[];

    constructor(list: {
        id?: number,
        author?: UserInfo,
        title: string, 
        description: string,
        albumIds: string[],
        likes?: number[],
        createdAt?: Date
    }){
        this.validate(list);
        this.id = list.id;
        this.author = list.author;
        this.title = list.title;
        this.description = list.description;
        this.albumIds = list.albumIds;
        this.likes = list.likes??[];
        this.createdAt = list.createdAt;
    }

    static from({
        id,
        author,
        title,
        description,
        albumIds,
        likes,
        createdAt
    }: ListPrisma & {
        author: UserPrisma;
        likes?: UserPrisma[];
    }){
        return new List({
            id: id,
            author: {
                id: author.id,
                username: author.username,
                role: author.role as Role,
                isBlocked: author.isBlocked,
                createdAt: author.createdAt
            },
            title: title,
            description: description,
            albumIds: albumIds,
            likes: likes?.map(like=>like.id),
            createdAt: createdAt
        });
    }

    validate(list: {
        title: string,
        description: string,
        albumIds: string[]
    }){
        if(!list.title || !list.description){
            throw new Error('title and description cannot be empty');
        }

        if(!list.albumIds || list.albumIds.length === 0){
            throw new Error('list albumIds cannot be empty');
        }
    }

    getId(): number | undefined{
        return this.id;
    }

    getAuthor(): UserInfo | undefined{
        return this.author;
    }

    getTitle(): string{
        return this.title;
    }

    getDescription(): string{
        return this.description;
    }

    getLikes(): number[]{
        return this.likes;
    }
    
    getAlbums(): string[]{
        return this.albumIds;
    }

    getCreatedAt(): Date | undefined{
        return this.createdAt;
    }

    equals(list: List){
        return (
            this.title === list.title &&
            this.description === list.description &&
            this.likes === list.likes &&
            this.albumIds.toString() === list.albumIds.toString()
        )
    }
};

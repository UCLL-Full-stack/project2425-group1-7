import { 
    List as ListPrisma, 
    Review as ReviewPrisma, 
    User as UserPrisma,
    Comment as CommentPrisma,
} from '@prisma/client';
import { Role } from '../types';
import { List } from './list';
import { Review } from './review';

export class User{

    private readonly id?: number;
    private readonly createdAt?: Date;
    private email: string;
    private username: string;
    private password: string;
    private role: Role;
    private isBlocked: boolean;
    private lists?: List[];
    private reviews?: Review[];
    private followedBy?: number[];
    private following?: number[];

    constructor(user: {
        id?: number;
        createdAt?: Date;
        email: string, 
        username: string, 
        password: string,
        role: Role,
        isBlocked?: boolean,
        lists?: List[],
        reviews?: Review[],
        followedBy?: number[]
        following?: number[]
    }){
        this.validate(user);
        this.id = user.id;
        this.email = user.email;   
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
        this.isBlocked = user.isBlocked??false;
        this.createdAt = user.createdAt;
        this.lists = user.lists??[];
        this.reviews = user.reviews??[];
        this.followedBy = user.followedBy??[]
        this.following = user.following??[]
    }
    
    static from({
        id,
        createdAt,
        email,
        username,
        password,
        role,
        isBlocked,
        lists,
        reviews,
        followedBy,
        following,
    }: UserPrisma & {
        lists?: (ListPrisma & {
            author: UserPrisma
        })[],
        reviews?: (ReviewPrisma & {
            comments: (CommentPrisma & {
                author: UserPrisma
            })[],
            author: UserPrisma
        })[],
        followedBy?: UserPrisma[],
        following?: UserPrisma[],
    }): User{
        return new User({
            id: id,
            createdAt: createdAt,
            email: email,
            username: username,
            password: password,
            role: role as Role,
            isBlocked: isBlocked,
            lists: lists?.map(list=>List.from(list))??[],
            reviews: reviews?.map(review=>Review.from(review))??[],
            followedBy: followedBy?.map(follower=>follower.id),
            following: following?.map(following=>following.id)
        });
    }

    getId(): number {
        if(!this.id) throw new Error("User Doesn't have ID");
        return this.id;
    }

    getEmail(): string{
        return this.email;
    }

    getUsername(): string{
        return this.username;
    }

    getPassword(): string{
        return this.password;
    }

    getLists(): List[]{
        return this.lists??[];
    }

    getReviews(): Review[]{
        return this.reviews??[];
    }
    
    getFollowers(): number[]{
        return this.followedBy??[];
    }

    getFollowing(): number[]{
        return this.following??[];
    }

    getCreatedAt(): Date{
        if(!this.createdAt) throw new Error("User Doesn't have Creation Date");
        return this.createdAt;
    }

    getRole(): Role{
        return this.role;
    }

    getIsBlocked(): boolean{
        return this.isBlocked;
    }

    setEmail(email: string){
        this.checkEmail(email);
        this.email = email;
    }

    setUsername(userName: string) {
        this.username = userName;
    }

    setPassword(password: string){
        this.checkPassword(password);
        this.password = password;
    }

    private checkEmail(email: string){
        const re = /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
        if(!email.toLowerCase().match(re))
            throw new Error('email is not valid');
    }

    private checkPassword(password: string){
        if(password.length < 10)
            throw new Error('password is too short');
    }

    validate(user: {
        email: string, 
        username: string, 
        password: string
    }) {
        this.checkEmail(user.email);
        this.checkPassword(user.password);
    }
    
    equals(user: User): boolean{
        return (
            this.id === user.getId() &&
            this.createdAt === user.getCreatedAt() &&
            this.email === user.email && 
            this.username === user.username &&
            this.password === user.password
        )
    }
};

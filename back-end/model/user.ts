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
    private lists?: List[];
    private reviews?: Review[];

    constructor(user: {
        id?: number;
        createdAt?: Date;
        email: string, 
        username: string, 
        password: string,
        role: Role,
        lists?: List[],
        reviews?: Review[]
    }){
        this.validate(user);
        this.id = user.id;
        this.email = user.email;   
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.lists = user.lists??[];
        this.reviews = user.reviews??[];
    }
    
    static from({
        id,
        createdAt,
        email,
        username,
        password,
        role,
        lists,
        reviews
    }: UserPrisma & {
        lists?: (ListPrisma & {
            author: UserPrisma
        })[],
        reviews?: (ReviewPrisma & {
            comments: (CommentPrisma & {
                author: UserPrisma
            })[],
            author: UserPrisma
        })[]
    }): User{
        return new User({
            id: id,
            createdAt: createdAt,
            email: email,
            username: username,
            password: password,
            role: role as Role,
            lists: lists?.map((list)=>List.from(list))??[],
            reviews: reviews?.map((review)=>Review.from(review))??[]
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

    getCreatedAt(): Date{
        if(!this.createdAt) throw new Error("User Doesn't have Creation Date");
        return this.createdAt;
    }

    getRole(): Role{
        return this.role;
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

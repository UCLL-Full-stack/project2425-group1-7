import { User } from "../model/user"
import { Role, UserInfo } from "../types";
import database from "../util/database";

const registerUser = async (user: User): Promise<User> => {
    try{
        const userPrisma = await database.user.create({
            data:{
                username: user.getUsername(),
                password: user.getPassword(),
                email: user.getEmail(),
            }          
        });
        return User.from(userPrisma);
    } catch(e){
        throw new Error("DB Error: "+ e);
    }
}

const findById = async (id: number): Promise<User> => {
    try{
        const userPrisma = await database.user.findFirst({
            where: {id},
            include:{
                lists: {
                    include: {
                        author: true,
                        likes: true
                    }
                },
                reviews: {
                    include: {
                        author: true,
                        comments: {
                            include: {
                                author: true
                            }
                        },
                        likes: true
                    }
                },
                following: true,
                followedBy: true,
            }
        });
        if(!userPrisma) throw new Error('user does not exist');
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB Error");
    }
}

const findByEmail = async (email: string): Promise<User> => {
    try{
        const userPrisma = await database.user.findUnique({
            where: {email},
        });
        if(!userPrisma) throw new Error(`${email} is not associated to any account`);
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB Error");
    }
}

const followUser = async (id: number, username: string): Promise<User>=>{
    try{
        const userPrisma = await database.user.update({
            where: {id: id},
            data:{
                followedBy: {connect: {username}}
            }
        })
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    }
}

const unfollowUser = async (id: number, username: string): Promise<User>=>{
    try{
        const userPrisma = await database.user.update({
            where: {id},
            data:{
                followedBy: {disconnect: {username}}
            }
        })
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    }
}

const promoteById = async (id: number, role: Role): Promise<User> =>{
    try{
        const userPrisma = await database.user.update({
            where: {id},
            data:{
                role: role
            }
        })
        if(!userPrisma) throw new Error('user does not exist');
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB Error");
    }
}

const blockById = async (id: number, isBlocked: boolean): Promise<User> =>{
    try{
        const userPrisma = await database.user.update({
            where: {id},
            data:{
                isBlocked: !isBlocked,
                role: 'user'
            }
        })
        if(!userPrisma) throw new Error('user does not exist');
        return User.from(userPrisma);
    }catch(e){
        throw new Error("DB Error");
    }
}

export default {
    registerUser,
    findByEmail,
    findById,
    followUser,
    unfollowUser,
    promoteById,
    blockById
}

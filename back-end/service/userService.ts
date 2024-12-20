import { AuthResponse, UserInfo, UserInput, Role } from "../types";
import userDB from "../repository/user.db"
import { compare, hash } from "bcrypt";
import { generateJWT } from "../util/jwt";
import { User } from "../model/user";

const getAllUsers = async (role: Role): Promise<UserInfo[]> => {
    try{
        //admin can fetch blocked users
        const users = (role==='admin')
            ? await userDB.findAll():
            await userDB.findAllFunctional();
            
        return users.map(u=>({
            id: u.getId(), 
            username: u.getUsername(), 
            role: u.getRole(),
            isBlocked: u.getIsBlocked(),
            createdAt: u.getCreatedAt(),
            reviews: u.getReviews(), 
            lists: u.getLists(), 
            followedBy: u.getFollowers(),
            following: u.getFollowing(),
        }));
    }catch(e){
        throw e;
    }
}

const registerUser = async (u: UserInput): Promise<UserInfo> => {
    try{
        const userExists =  await userDB.findByEmail(u.email);
        if(userExists)throw new Error(`user with Email ${u.email} already exists`);
    }catch(e){ 
        throw e;
    }

    const user = new User({ 
        username: u.username, role: 'user' as Role,
        email: u.email, password: u.password
    });
    user.setPassword(await hash(u.password,12));

    try{
        const userCreated = await userDB.registerUser(user);
        return {
            id: userCreated.getId(),
            username: userCreated.getUsername(),
            role: userCreated.getRole(),
            createdAt: userCreated.getCreatedAt()
        }
    }catch(e){
        throw e;
    }
};

const loginUser = async ({email, password}: UserInput): Promise<AuthResponse> => {
    try{
        const u = await userDB.findByEmail(email);
        if(!u) throw new Error(`no account is associated with ${email}`);
        if (! await compare(password, u.getPassword())) {
            throw new Error("Invalid Credentials");
        }

        const token = generateJWT(u.getRole(), u.getUsername());
        return {
            token: token,
            id: u.getId(),
            username: u.getUsername(),
            role: u.getRole(),
            isBlocked: u.getIsBlocked(),
        };
    }catch(e){
        throw e;
    }
}

const getById = async (id: number): Promise<UserInfo> => {
    try{
        const user = await userDB.findById(id);
        if (!user) throw new Error('user does not exist');
        return {
            id: user.getId(),
            username: user.getUsername(),
            role: user.getRole(),
            isBlocked: user.getIsBlocked(),
            createdAt: user.getCreatedAt(),
            reviews: user.getReviews(),
            lists: user.getLists(),
            followedBy: user.getFollowers(),
            following: user.getFollowing(),
        };
    }catch(e){
        throw e;
    }
}
const followUser = async(id: number, username: string): Promise<number> =>{
    try{
        const user = await userDB.followUser(id, username);
        return user.getId();
    }catch(e){
        throw e;
    }
}

const unfollowUser = async(id: number, username: string): Promise<number> =>{
    try{
        const user = await userDB.unfollowUser(id, username);
        return user.getId();
    }catch(e){
        throw e;
    }
}

const promoteUser = async (id: number, role: Role): Promise<UserInfo> => {
    try{
        const u = await userDB.findById(id);
        if(!u) throw new Error("user doesn't exits");

        if( role !== 'admin') 
            throw new Error("You are not authorized to access this resource");

        const newRole = u.getRole() == 'user'? 'moderator':'user';
        const user = await userDB.promoteById(id, newRole);
        return {
            id: user.getId(),
            username: user.getUsername(),
            role: user.getRole(),
            isBlocked: user.getIsBlocked(),
            createdAt: user.getCreatedAt(),
            reviews: user.getReviews(),
            lists: user.getLists(),
        };
    }catch(e){
        throw e;
    }
}

const blockUser = async (id: number, role: Role): Promise<UserInfo> => {
    try{
        const u = await userDB.findById(id);
        if(!u) throw(new Error("user doesn't exits"));
        if( role !== 'admin') 
            throw new Error("You are not authorized to access this resource");

        const user = await userDB.blockById(id, u.getIsBlocked());
        return {
            id: user.getId(),
            username: user.getUsername(),
            role: user.getRole(),
            isBlocked: user.getIsBlocked(),
            createdAt: user.getCreatedAt(),
            reviews: user.getReviews(),
            lists: user.getLists(),
        };
    }catch(e){
        throw e;
    }
}

export default {
    registerUser,
    getAllUsers,
    loginUser,
    getById,
    followUser,
    unfollowUser,
    promoteUser,
    blockUser
}

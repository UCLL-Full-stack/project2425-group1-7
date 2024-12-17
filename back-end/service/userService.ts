import { AuthResponse, UserInfo, UserInput, Role } from "../types";
import userDB from "../repository/user.db"
import { compare, hash } from "bcrypt";
import { generateJWT } from "../util/jwt";
import { User } from "../model/user";

const registerUser = async (u: UserInput): Promise<UserInfo> => {
    try{
        await userDB.findByEmail(u.email);
        throw new Error(`user with Email ${u.email} already exists`);
    }catch(e){ 
        //this is to make sure the findByEmail 
        //method throws, which means the email 
        //isn't used
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
        const userExists = await userDB.findByEmail(email);
        if (! await compare(password, userExists.getPassword())) {
            throw new Error("Invalid Credentials");
        }

        const token = generateJWT(userExists.getEmail(), userExists.getUsername());
        return {
            token: token,
            id: userExists.getId(),
            username: userExists.getUsername(),
            role: userExists.getRole()
        };
    }catch(e){
        throw e;
    }
}

const getById= async (id: number): Promise<UserInfo> => {
    try{
        const user = await userDB.findById(id);
        return {
            id: user.getId(),
            username: user.getUsername(),
            role: user.getRole(),
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
    loginUser,
    getById,
}

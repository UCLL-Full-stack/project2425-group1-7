import { AuthResponse, UserInput } from "../types";
import userDB from "../repository/user.db"
import { compare, hash } from "bcrypt";
import { generateJWT } from "../util/jwt";

const registerUser = async (newUser: UserInput) => {
    try{
        await userDB.findByEmail(newUser.email);
        throw new Error(`user with Email ${newUser.email} already exists`);
    }catch (e){}

    if(newUser.email == "" || newUser.username == "" || newUser.password == ""){
        throw new Error("user fields can't be null");
    }

    const hashedPassword = await hash(newUser.password,12);

    try{
        return await userDB.registerUser({
            email: newUser.email,
            username: newUser.username,
            password: hashedPassword
        });
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
        return {
            token: generateJWT(userExists.getEmail(), userExists.getId(), userExists.getUsername()),
            email: userExists.getEmail(),
            id: userExists.getId(),
            username: userExists.getUsername()
        };
    }catch(e){
        throw e;
    }
}

const getByEmail = async (email:string) => {
    try{
        return await userDB.findByEmail(email);
    }catch(e){
        throw e;
    }
}

const getById= async (id: number) => {
    try{
        const user = await userDB.findById(id);
        return user;
    }catch(e){
        throw e;
    }
}

export default {
    registerUser,
    loginUser,
    getByEmail,
    getById,
}

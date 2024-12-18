import { UserInput } from "@/types/index"
import { jwtDecode } from "jwt-decode";

const registerUser = async (user: UserInput): Promise<Response> => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

const logIn = async({email, password}: UserInput): Promise<Response> => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });        
}

const findById = async(id: number): Promise<Response>=>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
    });        
}

const promoteUser = async(id: number): Promise<Response> =>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/promote/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
    });        
}

const blockAccount = async(id: number): Promise<Response> =>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/block/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
    });        
}

const isJwtExpired = (token: string): boolean => {
    if(!token) return true;
    try{
        const decodedToken = jwtDecode(token);
        const now  = Date.now()/1000;
        if(!decodedToken.exp) return false;
        return decodedToken.exp < now;
    }catch(e){
        return true;
    }
}

export default {
    registerUser,
    logIn,
    findById,
    promoteUser,
    blockAccount,
    isJwtExpired
}

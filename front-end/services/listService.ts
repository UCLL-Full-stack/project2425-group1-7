import { ListInput } from "@/types/index"

const getAllLists= async (): Promise<Response> => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const getListById= async (id: number): Promise<Response> => {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/lists/${id}`);
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const createList = async (list: ListInput): Promise<Response> => {
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(list)
    }); 
}

const likeList = async (id: number): Promise<Response> => {
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/like/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}` 
        },
    }); 
}

const unlikeList = async (id: number): Promise<Response> => {
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/unlike/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}` 
        },
    }); 
}

const deleteList = async (id: number): Promise<Response> =>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/${id}`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });
}

export default {
    getAllLists,
    getListById,
    createList,
    likeList,
    unlikeList,
    deleteList
}

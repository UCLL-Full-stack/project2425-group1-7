import { CommentInput } from "@/types/index";

const createComment = async (comment: CommentInput): Promise<Response> =>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(comment)
    });
};

const deleteComment = async (id: number): Promise<Response>=>{
    const loggedInUser = sessionStorage.getItem("LoggedInUser");
    const user = JSON.parse(loggedInUser??"");
    if (!user) return Response.error();

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });
};

export default{
    createComment,
    deleteComment
}

import { List } from "@/types/index";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IconDelete from "../ui/delete";
import IconEdit from "../ui/edit";
import IconLike from "../ui/like";
import React from "react";

type Props = {
    list: List;
    onDelete?: (id: number)=>void;
    onEdit?: ()=>void;
    userId?: number
}

const ListCard: React.FC<Props> = ({list, onEdit, onDelete, userId}: Props) => {
    const { title, description, createdAt, albumIds } = list;
    const formattedDate = new Date(createdAt).toLocaleDateString();

    const router = useRouter();
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(()=>{
        if(!list) return;
        const userLiked = list.likes.find(like=> like === userId);
        if(userLiked) setIsLiked(true);
    },[userId]);

    const handleRedirect = (e)=>{
        if(!userId){ 
            router.push("/login");
            return;
        }
        e.stopPropagation(); 
        router.push(`/listDetails/${list.id}`)   
    }

    const handleEdit = (e)=>{
        if(!onEdit) return;
        
        e.stopPropagation(); 
        onEdit();
    }

    const handleDelete = (e)=>{
        if(!onDelete) return;
        
        e.stopPropagation(); 
        onDelete(list.id);
    }

    return (
        <div onClick={handleRedirect} 
            className="bg-text1 max-h-[20vh] min-w-[20vw] max-w-[25vw] p-4 sm:p-5 rounded-lg shadow-lg shadow-text1 transform transition-all duration-100 hover:scale-105">
            <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl main-font mb-2 text-text2 truncate">{title}</h2>
                {onDelete &&
                    <IconDelete 
                    className="text-bg2 hover:text-red-500 duration-100"
                    width={30} height={30}
                    onClick={handleDelete}
                    />
                }
            </div>
            <p className="text-sm sm:text-md text-bg2 mb-3 sm:mb-4 main-font truncate">{description}</p>
            <p className="text-xs sm:text-sm text-bg2 mb-3 sm:mb-4 main-font truncate">{list.author.username} {formattedDate}</p>

            <span className="text-xs sm:text-sm text-text2 main-font">Albums: {albumIds.length}</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                    <p> {list.likes.length} </p>
                    <IconLike 
                        width={25} height={25} 
                        className={isLiked?"text-green-500":"text-text2"}
                    /> 
                </span>
                <div className="flex gap-2">
                {onEdit &&
                    <button
                        onClick={handleEdit}
                        className="rounded-lg z-20 px-2 sm:px-3 py-1 w-full flex justify-center sm:py-1 main-thin text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-text2 transition-colors duration-100">
                        <IconEdit width={25} height={25}/>
                    </button>
                }
                </div>
            </div>
        </div>    
    );
};

export default ListCard;

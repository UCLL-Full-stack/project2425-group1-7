import { Review } from "@/types/index";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IconComment from "../ui/comment";
import IconDelete from "../ui/delete";
import IconEdit from "../ui/edit";
import IconLike from "../ui/like";

type Props = {
    review: Review;
    onDelete?: (id:number)=>void;
    userId?: number;
}

const ReviewCard: React.FC<Props> = ({review, onDelete, userId}: Props) => {

    const router = useRouter();
    const formattedDate = new Date(review.createdAt).toLocaleDateString();
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(()=>{
        const userLiked = review.likes.find(like=> like === userId);
        if(userLiked) setIsLiked(true);
    },[userId]);

    const handleRedirect = (e)=>{
        if(!userId){ 
            router.push("/login");
            return;
        }
        e.stopPropagation(); 
        router.push(`/reviewDetails/${review.id}`)   
    }

    const handleDelete = (e)=>{
        if(!onDelete) return;
        
        e.stopPropagation(); 
        onDelete(review.id);
    }


    return (
        <div onClick={handleRedirect} 
            className="bg-text1 max-h-[25vh] lg:max-w-[25vw] md:max-w-full sm:max-w-[25vw] p-4 sm:p-5 rounded-lg shadow-lg shadow-text1 max-w-full transform transition-all duration-100 hover:scale-105">
            <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl main-font mb-2 text-text2 truncate">{review.title}</h2>
                {onDelete &&
                    <IconDelete 
                    className="text-bg2 hover:text-red-500 duration-100"
                    width={30} height={30}
                    onClick={handleDelete}
                    />
                }
            </div>
            <p className="text-sm sm:text-md text-left text-bg2 mb-3 sm:mb-4 main-font truncate">{review.body}</p>
            <p className="text-sm sm:text-md mb-2 sm:mb-4 text-text2 main-font flex truncate">
                {review.albumId.split('_')[1]} - {review.albumId.split('_')[0]}
            </p>
            <Rating value={review.starRating} readOnly size="medium" />
            <div className="text-left text-xs sm:text-sm text-text2 my-2 main-thin">
                <span> {review.author.username} </span>
                <span> {formattedDate} </span>
                
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                        <p> {review.likes.length} </p>
                        <IconLike 
                            width={25} height={25} 
                            className={isLiked?"text-green-500":"text-text2"}
                        /> 
                    </span>
                    <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                        <p>{review.comments.length}</p>
                        <IconComment width={25} height={25} className="text-text2"/>
                    </span>
                </div>
                <div className="flex gap-2">
                {onDelete &&
                    <button
                        className="rounded-lg px-2 sm:px-3 py-1 w-full flex justify-center sm:py-1 main-thin text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-text2 transition-colors duration-100">
                        <IconEdit width={25} height={25}/>
                    </button>
                }
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;

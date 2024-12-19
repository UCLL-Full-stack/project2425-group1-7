import { useEffect, useState } from "react";
import useSWR from "swr";
import AlbumCard from "@/components/album/albumCard";
import IconComment from "@/components/ui/comment";
import IconLike from "@/components/ui/like";
import IconDisc from "@/components/ui/loading";
import albumService from "@/services/albumService";
import reviewService from "@/services/reviewService";
import { User, Review } from "@/types/index";
import { Rating } from "@mui/material";
import Link from "next/link";
import IconDelete from "../ui/delete";
import IconEdit from "../ui/edit";

type Props = {
    user: User,
    review: Review,
    handleClickComment: (id: number) => void,
    onDelete?: ()=>void ;
    onEdit?: ()=>void ;
}

const albumFetcher = async (albumId: string) => {
    const details = albumId.split("_");
    const album = await albumService.fetchAlbum(details[0], details[1]);
    return album;
};

const ReviewDetails = ({ user, review, handleClickComment, onEdit, onDelete }: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [clicked, setClicked] = useState<boolean>(false);

    const { data: album, error } = useSWR(
        review ? review.albumId : null,
        albumFetcher,
        {
            revalidateOnFocus: false
        }
    );

    useEffect(() => {
        if (!review) return;
        const userLiked = review.likes.find((like) => like === user.id);
        setIsLiked(!!userLiked);
        setLikeCount(review.likes.length);
    }, [review, user]);

    useEffect(() => {
        if (!review || !user?.id || !clicked) return;

        const updateLikes = async () => {
            try {
                const response = isLiked
                    ? await reviewService.likeReview(review.id)
                    : await reviewService.unlikeReview(review.id);
                if (!response.ok) {
                    throw new Error("Error updating likes");
                }
            } catch (err) {
                setIsLiked(!isLiked);
                setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
                console.error("Error updating likes:", err);
            }
        };

        updateLikes();

        if (isLiked) {
            review.likes.push(user.id);
        } else {
            review.likes = review.likes.filter((like) => like !== user.id);
        }
        setLikeCount(review.likes.length);
    }, [isLiked]);

    const handleLike = () => {
        setClicked(true);
        setIsLiked(!isLiked);
    };

    if (!album && !error) {
        return (
            <div className="flex justify-center items-center">
                <IconDisc height={100} width={100} />
            </div>
        );
    }

    if (error) {
        return <span className="text-red-800 main-font">Error fetching album</span>;
    }

    if (!user || !album || !review) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto bg-text1 py-4 px-6 rounded-lg shadow-md">
            <div className="grid grid-cols-4">
                <div className="flex justify-center flex-wrap">
                    <AlbumCard album={album} />
                    <Rating 
                        className="text-center p-2 bg-bg3 rounded-md m-2" 
                        size="large" 
                        readOnly 
                        value={review.starRating} 
                    />
                </div>
                <div className="col-span-3 p-4">
                    <div className="flex justify-between items-baseline">
                        <h1 
                            onClick={() => handleClickComment(review.id)} 
                            className="hover:scale-105 text-4xl font-bold mb-4 text-text2 duration-100 truncate"
                        >
                            {review.title}
                        </h1>
                        <div className="mb-4 flex gap-2">
                            <h2 className="text-xl main-thin text-text2">By</h2>
                            <Link
                                href={`/profile/${review.author.id}`}
                                className={`${
                                    review.author.id === user.id && "text-green-500"
                                } text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100`}
                            >
                                {review.author.username ?? "Unknown"}
                            </Link>
                        </div>
                    </div>
                    <div className="m-5">
                        <p className="main-thin text-md text-bg2">{review.body}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mb-5 gap-2">
            {onEdit && 
                <span className="flex justify-center">
                    <button
                        onClick={onEdit}
                        className="rounded-lg z-20 px-2 sm:px-3 py-1 w-full flex justify-center sm:py-1 main-thin text-xs sm:text-sm bg-text1 text-text2 hover:text-bg2 transition-colors duration-100">
                        <IconEdit width={25} height={25}/>
                    </button>
                </span>
            }
            {onDelete && 
                <span className="flex justify-center">
                    <IconDelete
                        onClick={onDelete}
                        className="text-bg2 hover:text-red-500 duration-100"
                        width={30} height={30}
                    />
                </span>
            }
            </div>
            <div className="flex items-start justify-end gap-2 text-xs sm:text-sm text-text2 main-font">
                <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                    <p>{likeCount}</p>
                    <IconLike
                        width={25}
                        height={25}
                        className={`duration-100 hover:scale-105 ${
                            isLiked
                                ? "text-green-500 hover:text-red-500"
                                : "text-text2 hover:text-green-500"
                        }`}
                        onClick={handleLike}
                    />
                </span>
                <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                    <p>{review.comments.length}</p>
                    <IconComment
                        onClick={() => handleClickComment(review.id)}
                        className="hover:scale-110 duration-100 text-text2 hover:text-bg1"
                        width={25}
                        height={25}
                    />
                </span>
            </div>
        </div>
    );
};

export default ReviewDetails;

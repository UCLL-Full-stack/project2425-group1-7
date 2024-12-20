import { Album, List, User } from "@/types/index";
import Link from "next/link";
import AlbumCard from "@/components/album/albumCard";
import IconDelete from "@/components/ui/delete";
import IconEdit from "@/components/ui/edit";
import IconLike from "@/components/ui/like";
import listService from "@/services/listService";
import { useEffect, useState } from "react";

interface Props {
    list: List;
    albums: Album[];
    user: User;
    onDelete?: ()=>void ;
    onEdit?: ()=>void ;
}

const ListDetails = ({ list, albums, user, onDelete, onEdit }: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [clicked, setClicked] = useState<boolean>(false);

    useEffect(() => {
        if (!list) return;
        const userLiked = list.likes.find((like) => like === user.id);
        setIsLiked(!!userLiked);
        setLikeCount(list.likes.length);
    }, [list, user]);

    useEffect(() => {
        if (!list || !user?.id || !clicked) return;

        const updateLikes = async () => {
            try {
                const response = isLiked
                    ? await listService.likeList(list.id)
                    : await listService.unlikeList(list.id);
                
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
            list.likes.push(user.id);
        } else {
            list.likes = list.likes.filter((like) => like !== user.id);
        }
        setLikeCount(list.likes.length);
    }, [isLiked]);

    const handleLike = () => {
        setClicked(true);
        setIsLiked(!isLiked);
    };

    return (
        <div className="max-w-2xl mx-auto bg-text1 p-6 rounded-lg shadow-md">
            <div className="flex justify-between pr-6">
                <h1 className="text-4xl font-bold mb-4 text-text2">{list.title}</h1>
                <div className="mb-4 flex gap-2">
                    <h2 className="text-xl main-thin text-text2">By</h2>
                    <Link
                        href={`/profile/${list.author.id}`}
                        className="text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100">
                        {list.author.username ?? 'Unknown'}
                    </Link>
                </div>
            </div>
            <div className="m-5">
                <p className="main-thin text-md text-bg2">{list.description}</p>
            </div>
            <span className="flex gap-1 main-font text-text2 items-center">
                <p>{likeCount}</p>
                <IconLike
                    onClick={handleLike}
                    width={25} height={25} 
                    className={isLiked
                        ? "text-green-500 hover:scale-105 hover:text-red-500 duration-100"
                        : "hover:text-green-500 hover:scale-105 text-text2 duration-100"
                    }
                /> 
            </span>
            <div className="flex justify-end gap-2">
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
            <span className="flex items-center px-4 gap-2 text-xs sm:text-sm text-text2 main-font">
            </span>
            <h2 className="text-xl main-font text-center mb-2 text-text2">Albums</h2>
            {albums && albums.length > 0 && (
                <div className={`w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
                    {albums.map(album => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListDetails;

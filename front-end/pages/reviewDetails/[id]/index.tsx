import AlbumCard from "@/components/album/albumCard";
import Header from "@/components/header";
import IconComment from "@/components/ui/comment";
import IconLike from "@/components/ui/like";
import albumService from "@/services/albumService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { Album, Review, UserSession } from "@/types/index";
import { Rating } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const ListDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<UserSession>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [clicked, setClicked] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { data: review, error: listError} = useSWR<Review>(
        id ? `review/${id}` : null, 
        () => fetchReview(id as string)
    );

    const { data : album }= useSWR<Album>(
        review ? `albums/${review.id}` : null, 
        () => fetchAlbums(review)
    );

    useEffect(()=>{
        const getUser = () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            const u = JSON.parse(userString ?? "");
            if (!userString || userService.isJwtExpired(u.token)) {
                setIsLoggedIn(false); 
                router.push("/login");
                return;
            }
            setIsLoggedIn(true);
            setUser({
                id: Number(u.id),
                email: u.email,
                username: u.username
            });
        };

        getUser();
    },[])

    useEffect(()=>{
        if(!review || !user) return;
        const userLiked = review.likes.find(like=> like === user.id);
        if(userLiked) setIsLiked(true);
        setLikeCount(review.likes.length);
    },[review]);

    useEffect(()=>{
        if(!review) return;
        if(!user?.id || !clicked)return;

        if(isLiked)
            review.likes.push(user.id); 
        else
            review.likes = review.likes.filter(like => like !== user.id);

        updateLikes();
        setLikeCount(review.likes.length);
    },[isLiked]);
    
    const updateLikes = async () => {
        if(!review || !user) return;
        console.log(review);
        const response = await reviewService.likeReview(review);
        if(!response.ok){
            setError(await response.json());
        }
    }

    const handleLike = ()=>{
        setClicked(true);
        if(!user || !user.id) {
            router.push("/login");
            return;
        }

        setIsLiked(!isLiked);
    };

    return (
        <>
            <Head>
                <title>{review ? (review.title + "- Yadig") : "Review Details"}</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user}/>
                {error && (
                    <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                        <span className="text-red-800 main-font">{error}</span>
                    </div>
                )
                }
                {review && album &&(
                    <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                        <div className="max-w-4xl mx-auto bg-text1 p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-4">
                                <div className="flex justify-center flex-wrap">
                                    <AlbumCard album={album}/>
                                    <Rating className="text-center p-2" size="large" readOnly value={review.starRating}/>
                                </div>
                                <div className="col-span-3 p-4">
                                    <div className="flex justify-between items-baseline ">
                                        <h1 className="text-4xl font-bold mb-4 text-text2 truncate">{review.title}</h1>
                                        <div className="mb-4 flex gap-2">
                                        <h2 className="text-xl main-thin text-text2">By</h2>
                                        <Link
                                            href={`/profile/${review.author.id}`}
                                            className="text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100">
                                            {review.author.username ?? 'Unknown'}
                                        </Link>
                                        </div>
                                    </div>
                                    <div className="m-5">
                                        <p className="main-thin text-md text-bg2">{review.body}</p> 
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start justify-end gap-2 text-xs sm:text-sm text-text2 main-font">
                                <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                                    <p> {likeCount} </p>
                                    <IconLike 
                                        width={25} height={25} 
                                        className={`duration-100 hover:scale-105 ${isLiked?"text-green-500 hover:text-red-500 ":"text-text2 hover:text-green-500 "}`}
                                        onClick={handleLike}
                                    /> 
                                </span>
                                <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                                    <p>{commentCount}</p>
                                    <IconComment 
                                        className="hover:scale-110 duration-100 text-text2 hover:text-bg1"
                                        width={25} height={25}/>
                                </span>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </>
    );
};

const fetchReview = async (id: string): Promise<Review> => {
    const response = await reviewService.getReviewById(Number(id));

    if (!response.ok) {
        throw new Error("Couldn't find review");
    }

    return response.json();
};

const fetchAlbums = async (review: Review | undefined): Promise<Album> => {
    if(!review){throw new Error("cannot find review")}
    const details:string[] = review.albumId.split("_");
    return await albumService.fetchAlbum(details[0], details[1]);
};

export default ListDetails;

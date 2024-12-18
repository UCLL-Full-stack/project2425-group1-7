import AlbumCard from "@/components/album/albumCard";
import CommentCard from "@/components/comments/commentCard";
import CommentInput from "@/components/comments/commentInput";
import Header from "@/components/header";
import IconComment from "@/components/ui/comment";
import ConfirmModal from "@/components/ui/DeleteModal";
import IconLike from "@/components/ui/like";
import IconDisc from "@/components/ui/loading";
import albumService from "@/services/albumService";
import commentService from "@/services/commentService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { Album, Review, User, Comment } from "@/types/index";
import { Rating } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const reviewDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<User>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [clicked, setClicked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState<number>(-1);
    const [displayComments, setDisplayComments] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { data: review} = useSWR<Review>(
        id ? `review/${id}` : null, 
        () => fetchReview(Number(id))
    );

    const { data : album }= useSWR<Album>(
        review ? `albums/${review.id}` : null, 
        () => fetchAlbums(review)
    );

    useEffect(()=>{
        const getUser = () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            if (userString && !userService.isJwtExpired(JSON.parse(userString).token)) {
                const u = JSON.parse(userString);
                setUser({
                    id: u.id,
                    username: u.username,
                    isBlocked: u.isBlocked,
                    role: u.role
                });
                return;
            }

            router.push("/login");
        };

        getUser();
    },[])

    if (user && user.isBlocked){
        router.push('/blocked');
    }

    useEffect(() => {
        if (!review || !user || !album) {
            setIsLoading(true);
            return;
        }

        if (review.author.isBlocked){
            setError("Review No Longer Exists");
            setIsLoading(false);
            return;
        }

        const userLiked = review.likes.find(like => like === user.id);
        setIsLiked(!!userLiked);
        setLikeCount(review.likes.length);
        setComments(review.comments);
        setIsLoading(false);
    }, [review, user, album]);

    useEffect(()=>{
        if(!review) return;
        if(!user?.id || !clicked)return;

        updateLikes();
        if(isLiked)
            review.likes.push(user.id); 
        else
            review.likes = review.likes.filter(like => like !== user.id);

        setLikeCount(review.likes.length);
    },[isLiked]);
    
    const updateLikes = async () => {
        if(!review || !user) return;
        const response = isLiked? await reviewService.likeReview(review.id): await reviewService.unlikeReview(review.id);
        if(!response.ok){
            setError(await response.json());
        }
    }

    const handleLike = ()=>{
        setClicked(true);
        setIsLiked(!isLiked);
    };

    const handleComment = async (comment: string) => {
        if(!review || !user) return;
        const response = await commentService.createComment({
            body: comment,
            reviewId: review.id,
            authorId: user.id
        });
        if(!response.ok){
            setError(await response.json());
        }
        setComments([
            ...comments,
            await response.json()
        ]);
    }

    const handleDeleteComment = async () => {
        setDeleteModal(false);
        if(!review)return;
        const response = await commentService.deleteComment(selectedComment);
        if(!response.ok){
            setError("Error deleting comment");
        }

        setComments(comments.filter(c=> c.id !== selectedComment));
        setSelectedComment(-1);
    }

    const toggleDisplayComments = ()=> setDisplayComments(!displayComments);
    const toggleDeleteComment = (id: number)=>{
        setSelectedComment(id);
        setDeleteModal(true);
    }

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
                )}
                <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                {isLoading?(
                    <div className="flex justify-center items-center">
                        <IconDisc height={100} width={100}/>
                    </div>
                ):(!error && user && album && review &&
                    <div className="max-w-4xl mx-auto bg-text1 py-4 px-6 rounded-lg shadow-md">
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
                                            className={`${review.author.id === user.id && 'text-green-500'} text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100`}>
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
                                <p>{comments.length}</p>
                                <IconComment 
                                    onClick={toggleDisplayComments}
                                    className="hover:scale-110 duration-100 text-text2 hover:text-bg1"
                                    width={25} height={25}/>
                            </span>
                        </div>
                        {displayComments &&
                            <>
                                <CommentInput onSubmit={handleComment}/>
                                <div className="grid">
                                {comments.map(comment=>(
                                    <CommentCard 
                                    key={comment.id} 
                                    reviewAuthorId={review.author.id}
                                    userId={user.id}
                                    comment={comment}
                                    onDelete={(
                                        user.role === 'admin' || 
                                            user.role === 'moderator'||
                                            user.id === comment.author.id)
                                                ?toggleDeleteComment:undefined} 
                                                />
                                ))}
                                </div>
                            </>
                        }
                        {deleteModal &&
                            <ConfirmModal 
                                id={selectedComment} 
                                handler={handleDeleteComment} 
                                onClose={toggleDeleteComment}
                                message={`Delete Comment?`}
                            />
                        }
                    </div>
                    )}
                </main>
            </div>
        </>
    );
};

const fetchReview = async (id: number): Promise<Review> => {
    const response = await reviewService.getReviewById(Number(id));

    if (!response.ok) {
        throw new Error("Couldn't find review");
    }

    const review: Review = await response.json();
    review.comments = review.comments.filter(c=>!c.author.isBlocked);
    return review;
};

const fetchAlbums = async (review: Review | undefined): Promise<Album> => {
    if(!review){throw new Error("cannot find review")}
    const details:string[] = review.albumId.split("_");
    return await albumService.fetchAlbum(details[0], details[1]);
};

export default reviewDetails;

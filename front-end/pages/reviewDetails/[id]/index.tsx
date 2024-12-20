import CommentCard from "@/components/comments/commentCard";
import CommentInput from "@/components/comments/commentInput";
import Header from "@/components/header";
import ReviewDetails from "@/components/reviews/reviewDetails";
import ConfirmModal from "@/components/ui/DeleteModal";
import IconDisc from "@/components/ui/loading";
import commentService from "@/services/commentService";
import reviewService from "@/services/reviewService";
import { Review, User, Comment, ReviewInput } from "@/types/index";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";
import ReviewModal from "@/components/reviews/createReviewModal";

const ReviewDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<User>();

    const { data: review, error: reviewError, mutate } = useSWR<Review>(id ? `review/${id}` : null, () => fetchReview(Number(id)));

    const [comments, setComments] = useState<Comment[]>([]);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [displayComments, setDisplayComments] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const getUser = () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            if (userString) {
                const parsedUser = JSON.parse(userString);
                setUser(parsedUser);
            } else {
                router.push("/login");
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        if (review) {
            setComments(review.comments);
        }
    }, [review]);

    useEffect(() => {
        if (reviewError) {
            setError(reviewError.message);
        } else if (review?.author.isBlocked) {
            setError("Review No Longer Exists");
        } else {
            setError("");
        }
    }, [reviewError, review]);

    const handleClickComment = () => {
        setDisplayComments(!displayComments);
    };

    const handleComment = async (comment: string) => {
        if (!review || !user) return;
        const response = await commentService.createComment({
            body: comment,
            reviewId: review.id,
            authorId: user.id,
        });
        if (!response.ok) {
            setError(await response.json());
        }
        setComments([...comments, await response.json()]);
    };

    const handleDeleteComment = async () => {
        toggleDelete();
        if (!review) return;
        const response = await commentService.deleteComment(selectedId);
        if (!response.ok) {
            setError("Error deleting comment");
        }

        setComments(comments.filter((c) => c.id !== selectedId));
        setSelectedId(-1);
    };

    const handleDeleteReview = async ()=>{
        toggleDelete();
        if(!review) return;
        const response = await reviewService.deleteReview(review.id);
        if(!response){
            setError("error deleting Review");
        }
        router.back();
    };

    const handleEdit = async (reviewInput: ReviewInput)=>{
        toggleEdit();
        if(!review) return;
        const response = await reviewService.editReview(reviewInput, review.id);
        if(!response){
            setError("error editing Review");
        }
        mutate();
    };

    const toggleDelete = (id?: number) => {
        if(!review)return;
        setSelectedId(id??review.id);
        setDeleteModal(!deleteModal);
    };

    const toggleEdit = () => {
        setEditModal(!editModal);
    };

    const isUserReview = review?.author.id === user?.id;
    const isLoading = !review && !reviewError;

    if (error){
        return(
            <div className="flex flex-col h-screen">
                <Header current="home" user={user} />
                <main className="flex-1 main-font text-red-500 flex justify-center bg-bg1 p-10 overflow-y-auto">
                    {error}
                </main>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{review ? `${review.title} - Yadig` : "Review Details"}</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user} />
                <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <IconDisc height={100} width={100}/>
                        </div>
                    ) : review && user && (
                        <>
                            <ReviewDetails
                                user={user}
                                review={review}
                                handleClickComment={handleClickComment}
                                onDelete={isUserReview||user.role==='admin'?toggleDelete:undefined}
                                onEdit={isUserReview?toggleEdit:undefined}
                            />
                            {displayComments && (
                                <div className="bg-text1 rounded-lg max-w-4xl mx-auto mt-4 shadow-lg shadow-text1">
                                    <CommentInput onSubmit={handleComment} />
                                    <div className="grid">
                                        {comments.map((comment) => (
                                            <CommentCard
                                                key={comment.id}
                                                reviewAuthorId={review.author.id}
                                                userId={user.id}
                                                comment={comment}
                                                onDelete={
                                                    user.role === "admin" ||
                                                    user.role === "moderator" ||
                                                    user.id === comment.author.id
                                                        ? toggleDelete
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    </div>
                                    </div>
                            )}
                            {deleteModal && (
                                <ConfirmModal
                                    id={selectedId}
                                    handler={selectedId === review.id?handleDeleteReview:handleDeleteComment}
                                    onClose={toggleDelete}
                                    isDeleting={true}
                                    message={`${selectedId === review.id?"Delete Review":"Delete Comment"}`}
                                />
                            )}
                            {editModal && (
                                <ReviewModal
                                    isOpen={editModal} 
                                    onClose={toggleEdit}
                                    onSave={handleEdit}
                                    authorId={user.id}
                                    review={review}
                                />
                            )}
                        </>
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
    review.comments = review.comments.filter((c) => !c.author.isBlocked);
    return review;
};

export default ReviewDetailsPage;

import CommentCard from "@/components/comments/commentCard";
import CommentInput from "@/components/comments/commentInput";
import Header from "@/components/header";
import ReviewDetails from "@/components/reviews/reviewDetails";
import ConfirmModal from "@/components/ui/DeleteModal";
import IconDisc from "@/components/ui/loading";
import commentService from "@/services/commentService";
import reviewService from "@/services/reviewService";
import { Review, User, Comment } from "@/types/index";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";

const ReviewDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<User>();

    const { data: review, error: reviewError } = useSWR<Review>(id ? `review/${id}` : null, () => fetchReview(Number(id)));

    const [comments, setComments] = useState<Comment[]>([]);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState<number>(-1);
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
            setError("List No Longer Exists");
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
        toggleDeleteComment();
        if (!review) return;
        const response = await commentService.deleteComment(selectedComment);
        if (!response.ok) {
            setError("Error deleting comment");
        }

        setComments(comments.filter((c) => c.id !== selectedComment));
        setSelectedComment(-1);
    };

    const toggleDeleteComment = (id?: number) => {
        setSelectedComment(id??-1);
        setDeleteModal(!deleteModal);
    };

    const isLoading = !review && !reviewError;

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
                                                        ? toggleDeleteComment
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    </div>
                                    </div>
                            )}
                            {deleteModal && (
                                <ConfirmModal
                                    id={selectedComment}
                                    handler={handleDeleteComment}
                                    onClose={toggleDeleteComment}
                                    isDeleting={true}
                                    message={`Delete Comment?`}
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

import AlbumOverview from "@/components/album/albumOverview";
import Header from "@/components/header";
import userService from "@/services/userService";
import albumService from "@/services/albumService";
import { Album, Review, ReviewInput, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import reviewService from "@/services/reviewService";
import ReviewDetails from "@/components/reviews/reviewDetails";
import ReviewModal from "@/components/reviews/createReviewModal";

const AlbumOverviewPage = () => {

    const router = useRouter();
    const { id } = router.query;
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

    const { data: album, error: albumError } = useSWR<Album>(`album/${id}`, ()=>fetchAlbum(String(id)));
    const { data: reviews, error: reviewError } = useSWR<Review[]>(`reviews/album/${id}`, ()=> fetchReviews(String(id)))

    useEffect(() => {
        const getUser = () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            if (userString && !userService.isJwtExpired(JSON.parse(userString).token)) {
                const u = JSON.parse(userString);
                setUser({
                    id: u.id,
                    username: u.username,
                    isBlocked: u.isBlocked,
                    role: u.role,
                });
                return;
            }

            router.push("/login");
        };
        getUser();
    }, []);

    if (albumError) {
        setError("Failed to fetch album details.");
    }

    const handleReviewDetails = (id: number)=>{
        router.push(`/reviewDetails/${id}`);
    }

    const handleCreateReview = async (review: ReviewInput) => {
        await reviewService.createReview(review);
        toggleReviewModal();
        mutate(`reviews/album/${id}`);
    }


    const toggleReviewModal = () => setIsReviewModalOpen(!isReviewModalOpen);

    return (
        user && (
                <>
            <Head>
                <title>Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="discover" user={user} />
                {error ? (
                    <div className="flex justify-center items-center h-full text-red-500">
                    {error}
                    </div>
                ) : (
                <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                    <div className="flex flex-col w-1/3 fixed">
                    {album ? <AlbumOverview album={album} onReview={toggleReviewModal}/> : <div>Loading...</div>}
                    </div>
                    <div className="w-full left-0 flex flex-col ml-[40vw] items-center gap-4 ">
                    {reviews && (
                        <>
                        <span className="text-text2 main-font text-2xl">Popular Reviews</span>
                        {reviews.length>0 ? reviews.map(r => <ReviewDetails review={r} user={user} handleClickComment={handleReviewDetails}/>)
                            : <p className="flex items-center">This Album hasn't been reviews yet</p>
                        }
                        </>

                    )}
                    </div>
                </main>
                )}
            </div>
            {isReviewModalOpen && user && (
                <ReviewModal
                    isOpen={isReviewModalOpen} 
                    onClose={toggleReviewModal} 
                    onSave={(newReview: ReviewInput) => handleCreateReview(newReview)} 
                    authorId={user.id}
                    album={album}
                />
            )}
        </>
    )
  );
};


const fetchAlbum = async (id: string) => {
    const details = id.split("_");
    return await albumService.fetchAlbum(details[0], details[1]);
};

const fetchReviews = async (id: string): Promise<Review[]> => {
    const response = await reviewService.getAlbumReviews(id);
    if(!response.ok){
        return []
    }
    const reviews:Review[] = await response.json();
    return reviews.slice(0,15).sort((a,b)=>a.likes.length - b.likes.length).reverse();
}

export default AlbumOverviewPage;

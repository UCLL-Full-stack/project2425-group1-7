import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewDetails from "@/components/reviews/reviewDetails";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import { List, Review, User } from "@/types/index";
import userService from "@/services/userService";
import IconDisc from "@/components/ui/loading";
import reviewService from "@/services/reviewService";
import listService from "@/services/listService";

const reviewFetcher = async () => {
    const response = await reviewService.getAllReviews();
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const fetchedReview: Review[] = await response.json();
    return fetchedReview.filter(r => !r.author.isBlocked)
    .sort((a, b) => 
          (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
    );
};

const listFetcher = async () => {
    const response = await listService.getAllLists();
    if (!response.ok) throw new Error('Failed to fetch lists');

    const fetchedList: List[] = await response.json();
    return fetchedList.filter(l => !l.author.isBlocked)
    .sort((a, b) => b.likes.length - a.likes.length);
};

const Feed = () => {
    const router = useRouter();
    const [user, setUser] = useState<User>();

    const { data: reviews, error: reviewsError } = useSWR<Review[]>(
        'reviews',
        reviewFetcher
    );

    const { data: lists, error: listsError } = useSWR<List[]>(
        'lists',
        listFetcher
    );

    useEffect(()=>{
        const userString = sessionStorage.getItem("LoggedInUser");
        if (!userString || userService.isJwtExpired(JSON.parse(userString).token)) {
            router.push("/login")
            return;
        }
        const u = JSON.parse(userString);

        if(u.isBlocked){
            router.push("/blocked");
            return;
        }

        setUser({
            id: u.id,
            username: u.username,
            isBlocked: u.isBlocked,
            role: u.role
        });
    }, [router]);

    const handleOpenReview = (id: number) => {
        router.push(`/reviewDetails/${id}`);
    };

    if (!user || !reviews || !lists) {
        return (
            <div className="flex bg-bg1 justify-center items-center h-screen">
                <IconDisc className="text-text1 bg-bg1" height={100} width={100}/>
            </div>
        );
    }

    if (reviewsError || listsError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">Error loading data. Please try again later.</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Welcome to Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="feed" user={user} />
                <div className="bg-bg1 p-4 border-b border-bg3 w-screen grid gap-3">
                    <span className="text-center main-font text-text2 text-2xl">
                    Feed
                    </span>
                </div>
                <main className="flex-1 flex justify-evenly gap-4 bg-bg1 p-10 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <span className="text-center main-font text-text2 text-4xl">
                        Reviews
                        </span>
                        {reviews.map(review => (
                            <ReviewDetails 
                            key={review.id}
                            user={user} 
                            review={review} 
                            handleClickComment={handleOpenReview}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-center main-font text-text2 text-4xl">
                        Lists
                        </span>
                        {lists.map(list => (
                            <ListCard 
                            key={list.id}
                            list={list} 
                            userId={user.id}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Feed;

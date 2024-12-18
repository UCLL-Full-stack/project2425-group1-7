import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewCard from "@/components/reviews/reviewCard";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { List, Review, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
    lists: List[],
    reviews: Review[]
}

const Feed = ({ lists, reviews }: Props) => {
    const router = useRouter();
    const [user, setUser] = useState<User>();

    useEffect(() => {
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
    }, []);

    if (user && user.isBlocked){
        router.push('/blocked');
    }

    return (
        <>
            <Head>
                <title>Welcome to Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="feed" user={user} />
                {user && (
                    <>
                        <div className="bg-bg1 sm:p-4 lg:p-8 w-screen grid gap-3">
                            <span className="text-center main-font text-text2 text-4xl">
                                Explore Reviews and Lists
                            </span>
                        </div>
                        <main className="flex-1 flex justify-evenly gap-4 bg-bg1 p-10 overflow-y-auto">
                            <div className="grid justify-center gap-4">
                                {reviews.map(review=><ReviewCard review={review} userId={user.id}/>)}
                            </div>
                            <div className="grid gap-4">
                                {lists.map(list=><ListCard list={list} userId={user.id}/>)}
                            </div>
                        </main>
                    </>
                )}
            </div>
        </>
    );
};

export const getServerSideProps = async () => {
    try{
        let response = await reviewService.getAllReviews();
        if(!response.ok){
            throw new Error("error fetching reviews");
        }
        const reviews: Review[] = await response.json();

        response = await listService.getAllLists();
        if(!response.ok){
            throw new Error("error fetching lists");
        }
        const lists: List[] = await response.json();

        reviews.sort((a, b)=>(
            a.likes.length + a.comments.length) - 
            (b.likes.length + b.comments.length)
        ).reverse();
        lists.sort((a, b)=>a.likes.length - b.likes.length).reverse();

        return {props: {
            lists: lists.filter(l=> !l.author.isBlocked), 
            reviews: reviews.filter(r=> !r.author.isBlocked)
        }};
        
    }catch(e){
        console.log(e);
        return {props: {lists: [], reviews: []}};
    }
} 

export default Feed;


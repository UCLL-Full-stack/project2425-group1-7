import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewCard from "@/components/reviews/reviewCard";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import { List, Review, UserSession } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
    lists: List[],
    reviews: Review[]
}


const Home = ({ lists, reviews }: Props) => {
    const router = useRouter();
    const [user, setUser] = useState<UserSession>();

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if (userString) {
            setUser(JSON.parse(userString))
            return;
        }
        router.push("/login");
    }, []);

    return (
        <>
            <Head>
                <title>Welcome to Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user} />
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

        reviews.sort((a, b)=>a.likes.length - b.likes.length).reverse();
        lists.sort((a, b)=>a.likes.length - b.likes.length).reverse();

        return {props: {lists, reviews}};
    }catch(e){
        console.log(e);
        return {props: {lists: [], reviews: []}};
    }
} 

export default Home;


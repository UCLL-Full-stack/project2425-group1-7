import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewCard from "@/components/reviews/reviewCard";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import { Album, List, Review, User } from "@/types/index";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    lists: List[],
    reviews: Review[],
    albums: Album[]
}


const Home = ({ lists, reviews, albums }: Props) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if (userString) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userString))
        }
    }, []);

    return (
        <>
            <Head>
                <title>Welcome to Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" isLoggedIn={isLoggedIn} />
                <div className="bg-bg1 w-screen grid gap-3">
                    {user ? (
                        <>
                            <span className="text-center main-font text-text2 text-4xl">
                                welcome back {user.username}
                            </span>
                            <span className="text-center yadig-italic text-text2 text-xl">
                                what are you digging? 
                            </span>
                        </>
                    ):(
                        <>
                            <span className="text-center main-font text-text2 text-4xl">
                                welcome newcomer !
                            </span>
                            <span className="text-center main-thin text-text2 text-xl">
                            </span>
                        </>
                    )}
                </div>
                <main className="flex-1 grid grid-cols-2 gap-4 bg-bg1 p-10 overflow-y-auto">
                    <section className="text-center">
                        {/* Popular Lists Section */}
                        <div className="pb-5 grid gap-6 border-b-[1px] border-bg2">
                            <h2 className="text-2xl main-font text-text2">Popular Lists</h2>
                            <div className="slider-container">
                                <div className="slider">
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} />
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} />
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} />
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Link
                                    className="mt-4 px-4 py-2 bg-text1 text-white rounded-lg hover:bg-text2 hover:text-text1"
                                    href="/feed"
                                >
                                    View More
                                </Link>
                            </div>
                        </div>

                        {/* Popular Reviews Section */}
                        <div className="pt-5 grid gap-6">
                            <h2 className="text-2xl main-font text-text2">Popular Reviews</h2>
                            <div className="slider-container">
                                <div className="slider">
                                    {reviews &&
                                        reviews.slice(0, Math.min(reviews.length,15)).map((review) => (
                                            <ReviewCard key={review.id} review={review} userId={user?.id}/>
                                    ))}
                                    {reviews &&
                                        reviews.slice(0, Math.min(reviews.length,15)).map((review) => (
                                            <ReviewCard key={review.id} review={review} userId={user?.id}/>
                                    ))}
                                    {reviews &&
                                        reviews.slice(0, Math.min(reviews.length,15)).map((review) => (
                                            <ReviewCard key={review.id} review={review} userId={user?.id}/>
                                    ))}
                                    {reviews &&
                                        reviews.slice(0, Math.min(reviews.length,15)).map((review) => (
                                            <ReviewCard key={review.id} review={review} userId={user?.id}/>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Link
                                    className="mt-4 px-4 py-2 bg-text1 text-white rounded-lg hover:bg-text2 hover:text-text1 "
                                    href="/feed"
                                >
                                    View More
                                </Link>
                            </div>
                        </div>
                    </section>
                    {/* Most Reviewed Albums Section */}
                    <section className="text-center border-l border-bg2">
                        <h2 className="text-2xl main-font text-text2 mb-4">Most Reviewed Albums</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/*albums &&
                                albums.map((album) => (
                                    <AlbumCard key={album.id} album={album} />
                                ))*/}
                        </div>
                        <div>
                            <Link
                                className="mt-4 px-4 py-2 bg-text1 text-white rounded-lg hover:bg-text2 hover:text-text1 "
                                href="/discover"
                            >
                                View More
                            </Link>
                        </div>
                    </section>
                </main>
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

        return {props: {lists, reviews}};
    }catch(e){
        console.log(e);
        return {props: {lists: [], reviews: []}};
    }
} 

export default Home;

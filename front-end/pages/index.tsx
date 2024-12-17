import AlbumCard from "@/components/album/albumCard";
import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewCard from "@/components/reviews/reviewCard";
import HoverTitle from "@/components/ui/hoverTitle";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import { Album, List, Review, UserInfo } from "@/types/index";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    lists: List[],
    reviews: Review[],
    albums: Album[]
}


const Home = ({ lists, reviews, albums }: Props) => {
    const [user, setUser] = useState<UserInfo>();

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if (userString) {
            setUser(JSON.parse(userString))
        }
    }, []);

    return (
        <>
            <Head>
                <title>Yadig?</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user} />
                <div className="bg-bg1 xs:p-4 lg:p-8 w-screen grid gap-3">
                    <span className="text-center main-font text-text2 sm:text-xl md:text-4xl">
                        {user ? `welcome back ${user.username}` :( "welcome newcomer")} 
                    </span>
                    <span className="text-center yadig-italic text-text2 text-xl">
                        {user ? "what are you digging today?":("Log in and start Digging 🎧")}
                    </span>
                </div>
                <main className="flex-1 grid sm:grid-cols-1 md:grid-cols-2 gap-4 bg-bg1 xs:px-2 p-10 overflow-y-auto">
                    <section className="p-4 xs:p-2 text-center bg-text1 shadow-lg shadow-text1 rounded-xl">

                        {/* Popular Lists Section */}
                        <div className="pb-5 xs:pb-1 grid gap-6">
                            <Link href="/feed" className="pb-5 ">
                                <HoverTitle  text1="Popular Lists" text2="View More"/>
                           </Link>

                            <div className="slider-container border border-bg1 xs:p-2">
                                <div className="slider">
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists &&
                                        lists.slice(0, Math.min(lists.length, 15)).map((list) => (
                                            <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Popular Reviews Section */}
                        <div className="pt-5 grid gap-6">
                            <Link href="/feed" className="pb-5">
                                <HoverTitle text1="Popular Reviews" text2="View More"/>
                           </Link>
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
                        </div>
                    </section>

                    {/* Most Reviewed Albums Section */}
                    <section className="text-center">
                        <h2 className="text-2xl main-font text-text2 mb-4">Most Reviewed Albums</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {albums &&
                                albums.map((album) => (
                                    <AlbumCard key={album.id} album={album} />
                                ))
                            }
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

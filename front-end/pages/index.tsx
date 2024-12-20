import AlbumCard from "@/components/album/albumCard";
import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ReviewCard from "@/components/reviews/reviewCard";
import HoverTitle from "@/components/ui/hoverTitle";
import IconDisc from "@/components/ui/loading";
import TestUsersModal from "@/components/users/testUsersModal";
import albumService from "@/services/albumService";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { List, Review, User } from "@/types/index";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from 'swr';

type Props = {
    lists: List[],
    reviews: Review[],
    initialAlbumIds: string[]
}

const fetcher = async (albumDetails: string[]) => {
    const [title, artist] = albumDetails;
    return albumService.fetchAlbum(title, artist);
};

const Home = ({ lists, reviews, initialAlbumIds }: Props) => {
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [userModal, setUserModal] = useState<boolean>(false);

    const sortedAlbumIds = albumService.getAlbumsByFrequency(initialAlbumIds);
    const albumDetails = sortedAlbumIds.slice(0, 8).map(id => id.split('_'));
    
    const { data: albums, error, isLoading } = useSWR(
        albumDetails,
        () => Promise.all(albumDetails.map(details => fetcher(details))),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

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
            }
        };

        getUser();
    }, []);

    const toggleUserModal=()=>{setUserModal(!userModal)};

    if (user && user.isBlocked){
        router.push('/blocked');
    }

    return (
        <>
            <Head>
                <title>Yadig?</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user} />
                <div className="bg-bg1 xs:p-4 lg:p-8 w-screen grid justify-center gap-3">
                    <span className="text-center main-font text-text2 sm:text-xl md:text-4xl">
                        {user ? `welcome back ${user.username}` : "welcome newcomer"} 
                    </span>
                    <span className="text-center yadig-italic text-text2 text-xl">
                        {user ? "what are you digging today?" : "Log in and start Digging 🎧"}
                    </span>
                </div>
                <div className="flex bg-bg1 justify-center text-center main-font text-text2">
                    <button onClick={toggleUserModal} className="bg-text1 p-2 rounded-lg max-w-[10vw] hover:scale-105 duration-100">
                        SEE LIST OF USERS FOR TESTING
                    </button>
                </div>
                <main className="flex-1 grid sm:grid-cols-1 md:grid-cols-2 gap-4 bg-bg1 xs:px-2 p-10 overflow-y-auto">
                    <section className="px-4 xs:p-2 grid items-center text-center bg-text1 shadow-lg shadow-text1 rounded-xl">
                        {/* Popular Lists Section */}
                        <div className="pb-5 xs:pb-1 grid gap-6">
                            <Link href="/feed" className="pb-5">
                                <HoverTitle text1="Popular Lists" text2="View More"/>
                            </Link>

                            <div className="slider-container">
                            {lists.length > 0 ? (
                                <div className="slider">
                                    {lists.slice(0, 15).map((list) => (
                                        <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists.slice(0, 15).map((list) => (
                                        <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists.slice(0, 15).map((list) => (
                                        <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                    {lists.slice(0, 15).map((list) => (
                                        <ListCard key={list.id} list={list} userId={user?.id}/>
                                    ))}
                                </div>
                            ) : (
                                <span>No Lists to Show</span>
                            )}
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
                    <section className="px-4 xs:p-2 flex flex-col text-center bg-text1 shadow-lg shadow-text1 rounded-xl">
                        <Link href="/discover" className="mb-10">
                            <HoverTitle text1="Most Reviewed Albums" text2="View More"/>
                        </Link>
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
                            {isLoading ? (
                                Array(8).fill(0).map((_, index) => (
                                    <div key={index} className="flex items-center justify-center h-48">
                                        <IconDisc className="animate-spin text-text2" width={48} height={48} />
                                    </div>
                                ))
                            ) : error ? (
                                <span className="col-span-full text-red-500">Error loading albums</span>
                            ) : albums ? (
                                albums.map((album) => (
                                    <AlbumCard key={`${album.id}`} album={album} />
                                ))
                            ) : null}
                        </div>
                    </section>
                </main>
            </div>
            {userModal &&
                <TestUsersModal onClose={toggleUserModal}/>
            }
        </>
    );
};

export const getServerSideProps = async () => {
    try {
        let response = await reviewService.getAllReviews();
        if(!response.ok){
            throw new Error("error fetching reviews");
        }
        const fetchedReviews: Review[] = await response.json();
        const reviews = fetchedReviews.filter(r => !r.author.isBlocked).slice(0,15);

        response = await listService.getAllLists();
        if(!response.ok){
            throw new Error("error fetching lists");
        }
        const fetchedLists: List[] = await response.json();
        const lists = fetchedLists.filter(l => !l.author.isBlocked).slice(0,15);

        const albumIds: string[] = [];
        fetchedReviews.map(r => albumIds.push(r.albumId));

        return {
            props: {
                lists,
                reviews,
                initialAlbumIds: albumIds
            }
        };
    } catch(e) {
        console.log(e);
        return {
            props: {
                lists: [],
                reviews: [],
                initialAlbumIds: []
            }
        };
    }
};

export default Home;

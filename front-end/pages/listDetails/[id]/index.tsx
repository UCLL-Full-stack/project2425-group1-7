import AlbumCard from "@/components/album/albumCard";
import Header from "@/components/header";
import IconLike from "@/components/ui/like";
import IconDisc from "@/components/ui/loading";
import albumService from "@/services/albumService";
import listService from "@/services/listService";
import userService from "@/services/userService";
import { Album, List, User } from "@/types/index";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import useSWR from "swr";

const ListDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: user, error: userError } = useSWR<User>(
        'user',
        () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            if (userString && !userService.isJwtExpired(JSON.parse(userString).token)) {
                const u = JSON.parse(userString);
                return {
                    id: u.id,
                    username: u.username,
                    isBlocked: u.isBlocked,
                    role: u.role
                };
            }
            throw new Error('User not authenticated');
        }
    );

    const { data: listData, error: listError, mutate: mutateList } = useSWR<{list: List, albums: Album[]}>(
        id ? `listWithAlbums/${id}` : null,
        () => fetchListWithAlbums(Number(id))
    );

    // Handle authentication and blocking
    useEffect(() => {
        if (userError) {
            router.push("/login");
        }
    }, [userError, router]);

    useEffect(() => {
        if (user?.isBlocked) {
            router.push('/blocked');
        }
    }, [user, router]);

    const handleLike = useCallback(async () => {
        if (!listData?.list || !user) return;

        const isCurrentlyLiked = listData.list.likes.includes(user.id);
        const newLikes = isCurrentlyLiked
            ? listData.list.likes.filter(like => like !== user.id)
            : [...listData.list.likes, user.id];

        mutateList(
            {
                ...listData,
                list: { ...listData.list, likes: newLikes }
            },
            false
        );

        // Make API call
        const response = isCurrentlyLiked
            ? await listService.unlikeList(listData.list.id)
            : await listService.likeList(listData.list.id);

        if (!response.ok) {
            // Revert on error
            mutateList();
        }
    }, [listData, user, mutateList]);

    const isLoading = !listData && !listError;
    const isLiked = listData?.list.likes.includes(user?.id ?? -1);
    const likeCount = listData?.list.likes.length ?? 0;
    const error = listError?.message || (listData?.list.author.isBlocked ? "List No Longer Exists" : "");

    return (
        <>
            <Head>
                <title>{listData?.list ? (listData.list.title + " - Yadig") : "List Details"}</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user}/>
                {error && (
                    <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                        <span className="text-red-800 main-font">{error}</span>
                    </div>
                )}
                <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <IconDisc height={100} width={100}/>
                    </div>
                ):(!error && listData && user && 
                        <div className="max-w-4xl mx-auto bg-text1 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between pr-6">
                                <h1 className="text-4xl font-bold mb-4 text-text2">{listData.list?.title}</h1>
                                <div className="mb-4 flex gap-2">
                                    <h2 className="text-xl main-thin text-text2">By</h2>
                                    <Link
                                        href={`/profile/${listData.list.author.id}`}
                                        className="text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100">
                                        {listData.list.author.username ?? 'Unknown'}
                                    </Link>
                                </div>
                            </div>
                            <div className="m-5">
                                <p className="main-thin text-md text-bg2">{listData.list?.description}</p>
                            </div>
                            <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                                <p>{likeCount}</p>
                                <IconLike
                                    onClick={handleLike}
                                    width={25} height={25} 
                                    className={isLiked
                                        ? "text-green-500 hover:scale-105 hover:text-red-500 duration-100"
                                        : "hover:text-green-500 hover:scale-105 text-text2 duration-100"
                                    }
                                /> 
                            </span>
                            <h2 className="text-xl main-font text-center mb-2 text-text2">Albums</h2>
                            {listData.albums && listData.albums.length > 0 && (
                                <div className={`w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
                                    {listData.albums.map(album => (
                                       <AlbumCard key={album.id} album={album}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

const fetchListWithAlbums = async (id: number): Promise<{list: List, albums: Album[]}> => {
    const response = await listService.getListById(id);
    if (!response.ok){
        throw new Error("couldn't find list"); 
    }
    const list: List = await response.json();
    
    const albumDetails = list.albumIds.map(id => id.split('_'));
    const albums = await Promise.all(
        albumDetails.map(([title, artist]) => 
            albumService.fetchAlbum(title, artist)
        )
    );

    return { list, albums };
};

export default ListDetails;

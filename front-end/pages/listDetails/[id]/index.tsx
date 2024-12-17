import AlbumCard from "@/components/album/albumCard";
import Header from "@/components/header";
import IconLike from "@/components/ui/like";
import IconDisc from "@/components/ui/loading";
import albumService from "@/services/albumService";
import listService from "@/services/listService";
import userService from "@/services/userService";
import { Album, List, UserInfo } from "@/types/index";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const ListDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [clicked, setClicked] = useState<boolean>(false);
    const [user, setUser] = useState<UserInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { data: list, error: listError} = useSWR<List>(
        id ? `list/${id}` : null, 
        () => fetchList(id as string)
    );

    const { data : albums }= useSWR<Album[]>(
        list ? `albums/${list.id}` : null, 
        () => fetchAlbums(list)
    );

    useEffect(()=>{
        const getUser = () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            const u = JSON.parse(userString ?? "");
            if (!userString || userService.isJwtExpired(u.token)) {
                router.push("/login");
                return;
            }

            setUser({
                id: Number(u.id),
                email: u.email,
                username: u.username
            });
        };

        getUser();
    },[])

    useEffect(()=>{
        if(!user || !albums){
            setIsLoading(true);
            return
        }
        setIsLoading(false);
    }, [user, albums])

    useEffect(()=>{
        if(!list || !user) {
            return;
        }
        const userLiked = list.likes.find(like=> like === user.id);
        if(userLiked) setIsLiked(true);
        setLikeCount(list.likes.length);
    },[list]);

    useEffect(()=>{
        if(!list) return;
        if(!user?.id || !clicked)return;

        if(isLiked)
            list.likes.push(user?.id); 
        else
            list.likes = list.likes.filter(like => like !== user.id);

        updateLikes();
        setLikeCount(list.likes.length);
    },[isLiked]);
    
    const updateLikes = async () => {
        if(!list || !user) return;
        console.log(list);
        const response = await listService.likeList(list);
        if(!response.ok){
            setError(await response.json());
        }
    }

    const handleLike = ()=>{
        setClicked(true);
        if(!user || !user.id) {
            router.push("/login");
            return;
        }

        setIsLiked(!isLiked);
    };

    return (
        <>
            <Head>
                <title>{list ? (list.title + "- Yadig") : "List Details"}</title>
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
                ):(list && 
                        <div className="max-w-4xl mx-auto bg-text1 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between pr-6">
                                <h1 className="text-4xl font-bold mb-4 text-text2">{list?.title}</h1>
                                <div className="mb-4 flex gap-2">
                                    <h2 className="text-xl main-thin text-text2">By</h2>
                                    <Link
                                        href={`/profile/${list.author.id}`}
                                        className="text-xl main-font text-bg2 hover:text-text2 hover:scale-105 duration-100">
                                        {list.author.username ?? 'Unknown'}
                                    </Link>
                                </div>
                            </div>
                            <div className="m-5">
                                <p className="main-thin text-md text-bg2">{list?.description}</p>
                            </div>
                            <span className="flex items-center gap-2 text-xs sm:text-sm text-text2 main-font">
                                <p> {likeCount} </p>
                                <IconLike
                                    onClick={handleLike}
                                    width={25} height={25} 
                                    className={isLiked?"text-green-500 hover:scale-105 hover:text-red-500 duration-100":"hover:text-green-500 hover:scale-105 text-text2 duration-100"}
                                /> 
                            </span>
                            <h2 className="text-xl main-font text-center mb-2 text-text2">Albums</h2>
                            {albums && albums.length > 0 && (
                                <div className={`w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
                                    {albums.map(album=>(
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

const fetchList = async (id: string): Promise<List> => {
    const response = await listService.getListById(Number(id));

    if (!response.ok) {
        throw new Error("Couldn't find List");
    }

    return response.json();
};

const fetchAlbums = async (list: List | undefined): Promise<Album[]> => {
    if(!list){throw new Error("cannot find list")}
    const listAlbums: Album[] = await Promise.all(
        list.albumIds.map(async (id: string) => {
            const details = id.split('_')
            return await albumService.fetchAlbum(details[0], details[1]);
        })
    );
    return listAlbums;
};

export default ListDetails;

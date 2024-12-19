import AlbumCard from "@/components/album/albumCard";
import AlbumSearch from "@/components/album/albumSearch";
import Header from "@/components/header";
import UserCard from "@/components/users/userCard";
import albumService from "@/services/albumService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { Album, Review, User } from "@/types/index";
import { Input } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from 'swr';

type Props = {
    reviewedAlbums: Album[];
    users: User[];
}

const Discover = ({reviewedAlbums }: Props) => {

    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [userList, setUserList] = useState<User[]>();
    const [userQuery, setUserQuery] = useState<string>("");
    const [albumQuery, setAlbumQuery] = useState<string>("");
    const [albums, setAlbums] = useState<Album[]>(reviewedAlbums);

    const {data: users} = useSWR<User[]>(
        '/users', 
        fetchUsers
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
                return;
            }

            router.push("/login");
        };
        getUser();
        setAlbums(reviewedAlbums);
        if(users){
            setUserList(users.slice(0,10));
        }
    }, []);

    useEffect(()=>{
        if(albumQuery == ''){
            setAlbums(reviewedAlbums);
            return;
        }

        const getAlbums = async ()=>{
            setAlbums(await searchAlbums(albumQuery));
        }
        getAlbums();
    }, [albumQuery]);

    useEffect(()=>{
        if(!users) return;
        setUserQuery(userQuery.split(' ')[0]);
        if(!userQuery){
            setUserList(users.slice(0,10));
            return;
        }
        const filteredUsers = users.filter(u=>u.username.includes(userQuery))
        if(userQuery && filteredUsers.length != users.length){
            setUserList(filteredUsers);
            return;
        }
    },[userQuery, users])

    if (user && user.isBlocked){
        router.push('/blocked');
    }

    return (user && albums && users &&
        <>
            <Head>
                <title>Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="discover" user={user}/>
                {error?(
                    <>
                    </>
                ):(
                <main className="flex-1 bg-bg1 p-10 overflow-hidden flex gap-6">
                    <section className="w-3/4 overflow-y-auto">
                        <div className="flex flex-col justify-center items-center gap-4 mb-6">
                            <p className="text-text2 main-font text-xl">Search Albums</p>
                            <AlbumSearch 
                                label=""
                                albums={albums}
                                setQuery={setAlbumQuery}
                                query={albumQuery}
                                discover={true}
                            />
                        </div>
                        <div className="grid grid-cols-6 xs:grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-6 p-2">
                            {albums.length > 0 && albums.map(album=>(
                                <AlbumCard key={album.id} album={album}/>
                            ))}
                        </div>
                    </section>

                    <section className="w-1/4 overflow-y-auto p-10">
                        <label className="flex flex-col gap-2 mb-4 text-sm text-text2 main-font">
                            <p className="main-font text-xl">Search Users</p>
                            <Input 
                                className="w-full p-1 text-text2 rounded-md"
                                sx={{ input: { color: 'white' } }}  
                                onChange={(e) => setUserQuery(e.target.value)} 
                                type="search" 
                                value={userQuery} 
                                placeholder="Search"
                            />
                        </label>
                        {userList &&
                            <div className="flex flex-col gap-4">
                                {userList.map(u=><UserCard user={u}/>)}
                            </div>
                        }
                    </section>
                </main>
                )}
            </div>
        </>
    );
}

const searchAlbums = async (query: string): Promise<Album[]>=>{
    return await albumService.searchAlbums(query);
}

const fetchUsers = async (): Promise<User[]>=>{
    const response = await userService.fetchUsers();
    if(!response.ok){
        throw new Error('error fetching users');
    }
    const users: User[] = await response.json();
    users.sort((a,b)=> b.followedBy?.length - a.followedBy?.length );
    users.sort((a,b)=> Number(a.isBlocked) - Number(b.isBlocked));
    return users;
}

export const getServerSideProps = async () => {
    try{
        let response = await reviewService.getAllReviews();
        if(!response.ok){
            throw new Error("error fetching reviews");
        }
        const fetchedReviews: Review[] = await response.json();
        const reviews = fetchedReviews.filter(r=> !r.author.isBlocked).slice(0,15)

        const albumIds: string[] = [];
        reviews.map(r=>albumIds.push(r.albumId));
        const sortedAlbumIds = albumService.getAlbumsByFrequency(albumIds);

        const albumDetails = sortedAlbumIds.map(id => id.split('_'));
        const albums = await Promise.all(
            albumDetails.map(([title, artist]) => 
                albumService.fetchAlbum(title, artist)
            )
        );


        return {props: {
            reviewedAlbums: albums,
        }}
    }catch(e){
        console.log(e); 
        return {props: {
            albums: []
        }}
    }
}

export default Discover;

import Header from "@/components/header";
import userService from "@/services/userService";
import { Album, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

type Props = {
    albums: Album[];
}

const Discover = ({albums}: Props) => {

    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<User>();

    const fetchUser = async (id: number) => {
        const response = await userService.findById(id);
        if (!response.ok){
            const res = await response.json();
            setError(res.message);
            return;
        }
        setUser(await response.json());
    }

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if(!userString || 
           userService.isJwtExpired(JSON.parse(userString).token)
          ){
            router.push("/login");
            return;
        }

        const id = JSON.parse(userString).id;
        fetchUser(id); 
    }, []);
    
    return (
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
                    <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                    </main>
                )}
            </div>
        </>
    );
}

const getServerSideProps = async () => {
    try{

    }catch(e){
        
    }
}

export default Discover;

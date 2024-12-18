import Header from "@/components/header";
import IconEmail from "@/components/ui/email";
import IconSupport from "@/components/ui/support";
import { User } from "@/types/index";
import  Head  from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Blocked = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [contact, setContact] = useState<'email' | 'phone'>('email');

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if (userString) {
            setUser(JSON.parse(userString))
        }

    }, []);

    if(!user ) return null;

    if(!user.isBlocked) router.push('/');

    return (user.isBlocked &&
        <>
            <Head>
                <title>Yadig?</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user}/>
                <main className="flex-1 flex flex-col justify-center items-center gap-3 bg-bg1 p-10 overflow-y-auto">
                    <span className="text-text2 text-3xl main-font">Your Account Has Been Blocked By an Admin</span>
                    <span className="text-text2 text-xl main-thin"> contact support for more information </span>
                    <div className="flex flex-col items-center ">
                        <div className="flex bg-text1 rounded-lg mt-10 mb-4">
                            <button 
                                onClick={() => setContact('email')}
                                className={`flex items-center justify-center rounded-lg px-5 transition-all duration-100 ${
                                            contact === 'email' 
                                            ? 'bg-text2 text-text1 shadow-lg' 
                                            : 'bg-text1 text-text2 shadow-lg'
                            }`}>
                                <IconEmail width={50} height={50}/>
                            </button>
                    
                            <button 
                                onClick={() => setContact('phone')}
                                className={`flex items-center justify-center rounded-lg px-5 transition-all duration-100 ${
                                            contact === 'phone' 
                                            ? 'bg-text2 text-text1 shadow-lg' 
                                            : 'bg-text1 text-text2 shadow-lg'
                                }`}>
                                <IconSupport width={40} height={40}/>
                            </button>
                        </div>
                  
                        <span className="text-text2 main-font text-3xl tracking-wide">
                            {contact === 'email' ? 'support@yadig.com' : '+32 2 555 12 34'}
                        </span>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Blocked;

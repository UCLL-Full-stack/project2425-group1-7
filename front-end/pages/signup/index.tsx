import userService from "@/services/userService";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Signup = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const router = useRouter();

    const handleSave = async (e:FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await userService.registerUser({
            email: email,
            username: username,
            password: password
        })

        if (!response.ok){
            const error = await response.json();
            if(error.message == `user with Email ${email} already exists`)
                setError(error.message);
            else 
                setError("Error creating account");
            setEmail("");
            setPassword("");
            setUsername("");
            return;
        }
        
        setSuccess(true);
        setTimeout(()=>{
            router.push("/login");
        },1500);
    };

    return (
        <>
            <Head>
                <title>Login to your account</title>
            </Head>
            <div className="fixed text-center top-10 sm:top-14 md:top-18 right-0 left-0">
                <Link 
                    className="hover:text-bg2 duration-100 yadig-italic text-4xl sm:text-5xl md:text-6xl text-text2"
                    href="/">
                        yadig?
                </Link>
            </div>
            <div className="flex flex-col bg-bg1 min-h-screen">
                <main className="flex-1 flex justify-center items-center px-4 sm:px-8">
                    <div> <form 
                            onSubmit={(e) => handleSave(e)} 
                            className="px-8 sm:px-12 md:px-16 py-8 w-full sm:w-2/3 md:w-[30vw] lg:w-[25vw] bg-text1 rounded-t-lg">
                            <h2 className="text-3xl sm:text-4xl text-center text-text2 main-font mb-8 sm:mb-10 md:mb-12">Sign Up</h2>
                            {error && 
                                <span className="block text-center main-font text-red-500 mb-4 sm:mb-6">{error}</span>
                            }
                            <label className="block text-sm sm:text-base text-text2 main-font mb-4 sm:mb-6">
                                Username 
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block bg-bg4 text-white w-full mt-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-bg2"
                                    required
                                />
                            </label>
                            <label className="block text-sm sm:text-base text-text2 main-font mb-4 sm:mb-6">
                                Email
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block bg-bg4 text-white w-full mt-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-bg2"
                                    required
                                />
                            </label>
                            <label className="block text-sm sm:text-base text-text2 main-font mb-6 sm:mb-8">
                                Password 
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block bg-bg4 text-white w-full mt-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-bg2"
                                    minLength={10}
                                    required
                                />
                            </label>
                            <div className="flex justify-center">
                                {success ? (
                                    <span className="main-font text-green-500 text-xl sm:text-2xl text-center">Account Created</span>
                                ):(
                                    <button 
                                        type="submit"
                                        className="rounded-lg w-full sm:w-2/4 px-3 py-2 main-font text-sm sm:text-base text-text2 bg-bg4  hover:bg-bg3 transition-colors duration-100">
                                        Submit
                                    </button>
                                )}
                            </div>
                        </form>
                        <div className="grid justify-center bg-bg3 p-4 gap-3 rounded-b-lg">
                            <span className="text-text1 main-thin">
                                Already have an Account?
                            </span>
                            <Link 
                                href={"/login"}
                                className="w-full text-center main-font text-text2 hover:text-green-500 duration-100"
                            >
                                Log in     
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
};

export default Signup;

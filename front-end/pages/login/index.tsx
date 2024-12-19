import userService from "@/services/userService";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const handleSave = async (e:FormEvent) => {
        e.preventDefault();
        const response = await userService.logIn({
            email,
            password
        });

        if (!response.ok){
            const message = await response.json();
            setPassword("");
            switch (message.message){
                case `user with Email ${email} already exists`:
                    setError(message.message);
                    break;
                case "Invalid Credentials":
                    setError(message.message);
                    break;
                default:
                    setError("Log in error")
                    break;
            }
            setError(message.message); 
            return;
        }

        const jwtResponse = await response.json()
        sessionStorage.setItem(
            "LoggedInUser", 
            JSON.stringify({
                token: jwtResponse.token,
                role: jwtResponse.role,
                username: jwtResponse.username,
                id: jwtResponse.id,
                isBlocked: jwtResponse.isBlocked
            })
        );

        setSuccess(true);
        setTimeout(()=>{
            router.push('/');
        }, 500)
    };

    return (
        <>
            <Head>
                <title>Login to your account</title>
            </Head>
            <div className="fixed text-center top-20 sm:top-24 md:top-28 right-0 left-0">
                <Link 
                    className="hover:text-bg2 duration-100 yadig-italic text-4xl sm:text-5xl md:text-6xl text-text2"
                    href="/">
                        yadig?
                </Link>
            </div>
            <div className="flex flex-col bg-bg1 min-h-screen">
                <main className="flex-1 flex justify-center items-center px-4 sm:px-8">
                    <div>
                        <form 
                            onSubmit={(e) => handleSave(e)} 
                            className="px-8 sm:px-12 md:px-16 py-8 w-full sm:w-2/3 md:w-[30vw] lg:w-[25vw] bg-text1 rounded-t-lg">
                            <h2 className="text-3xl sm:text-4xl text-center text-text2 main-font mb-4 sm:mb-8 md:mb-10">Log In</h2>
                            {error && !success &&
                                <span className="block text-center main-font text-red-500 mb-4 sm:mb-6">{error}</span>
                            }
                            {success &&
                                <>
                                    <p className="block text-center main-font text-green-500 mb-4 sm:mb-6">Ready To Start Digging?</p>
                                </>
                            }
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
                                <button 
                                    type="submit"
                                    className="rounded-lg w-full sm:w-2/4 px-3 py-2 main-font text-sm sm:text-base text-text2 bg-bg4 hover:bg-bg3 transition-colors duration-100">
                                    Submit
                                </button>
                            </div>
                        </form>
                        <div className="grid justify-center bg-bg3 p-4 gap-3 rounded-b-lg">
                            <span className="text-text1 main-thin">
                                Don't have Account yet?
                            </span>
                            <Link 
                                href={"/signup"}
                                className="w-full text-center main-font text-text2 hover:text-green-500 duration-100"
                            >
                                Create One
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
};

export default Login;

import { User } from "@/types/index";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import IconAvatar from "./ui/avatar";
import IconDiscover from "./ui/discover";
import IconLogout from "./ui/logout";

type Props = {
    current: "home" | "profile" | "feed" | "discover" | "login"
    user?: User;
}

const Header: React.FC<Props> = ({current, user}: Props) => { 
    const router = useRouter();
    const linkStyle = `text-text2 hover:text-bg3 duration-100`
    const currentStyle = `text-bg3 hover:text-bg2 duration-100`

    const [logoutMessage, setLogoutMessage] = useState<string>("");

    const handleLogout = () => {
        sessionStorage.removeItem("LoggedInUser");
        user = null;
        setLogoutMessage("Sorry to see you go ☹️");
        setTimeout(()=>{
            router.reload();
        }, 500);
    }

    return (
        <div className="bg-text1 w-full sm:py-3 md:py-8 sm:px-4 md:px-16 lg:px-20 md:flex sm:grid sm:gap-4 xs:justify-center md:justify-between items-center">
            <div className="flex justify-center sm:text-4xl md:text-6xl sm:justify-center md:justify-start items-center yadig-italic mr-4 text-text2 hover:text-bg3 duration-100 ">
                <Link href="/">yadig?</Link>
            </div>
            {logoutMessage ? (
                <p className="main-font sm:text-md md:text-2xl text-text2">{logoutMessage}</p>
            ):(

                <div className="main-font sm:text-md md:text-2xl cursor-pointer flex text-center justify-center items-center gap-4 sm:gap-8 md:gap-10">
                {user? (
                    <>
                        <Link 
                            href="/feed" 
                            className={current=="feed"?currentStyle:linkStyle}
                        >
                            Feed
                        </Link>
                        <Link 
                            href="/discover"
                            className={current=="discover"?currentStyle:linkStyle}
                        >
                            <IconDiscover width={35} height={35}/>
                        </Link>
                        <Link
                            href={`/profile/${user.id}`}
                            className={current=="profile"?currentStyle:linkStyle}
                        >
                            <IconAvatar width={30} height={30}/>
                        </Link>
                        <Link
                            href="/"
                            onClick={()=>handleLogout()}
                            className="text-text2 hover:text-red-500 duration-100"
                        >
                            <IconLogout width={25} height={25}/>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link 
                            href="/login" 
                            className={linkStyle}
                        >
                            Log In
                        </Link>
                        <Link 
                            href="/signup" 
                            className={linkStyle}
                        >
                            Sign up
                        </Link>
                    </>
                )}
                </div>
            )}
        </div>
    )
};

export default Header;

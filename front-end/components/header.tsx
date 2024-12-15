import Link from "next/link";
import { useRouter } from "next/router";
import IconAvatar from "./ui/avatar";
import IconLogout from "./ui/logout";
import IconLougout from "./ui/logout";

type Props = {
    current: "home" | "profile" | "feed" | "discover" | "login"
    isLoggedIn: boolean;
}

const Header: React.FC<Props> = ({current, isLoggedIn}: Props) => { 
    const router = useRouter();
    const linkStyle = `text-text2 hover:text-bg3 duration-100`
    const currentStyle = `text-bg3 hover:text-bg2 duration-100`

    const handleLogout = () => {
        sessionStorage.removeItem("LoggedInUser");
        router.reload();
    }

    return (
        <div className="bg-bg1 py-6 sm:py-8 md:py-10 px-4 sm:px-10 md:px-[10rem] flex justify-between items-center ">
            <div className="flex items-center yadig-italic text-4xl sm:text-5xl mr-4 md:text-6xl text-text2 hover:text-bg3 duration-100 ">
                <Link href="/">yadig?</Link>
            </div>
            <div className="main-font text-base sm:text-lg md:text-2xl cursor-pointer flex items-center gap-4 sm:gap-8 md:gap-10">
            {isLoggedIn ? (
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
                        Discover
                    </Link>
                    <Link 
                        href="/profile" 
                        className={current=="profile"?currentStyle:linkStyle}
                    >
                        <IconAvatar width="45" height="45"/>
                    </Link>
                    <Link
                        href="/"
                        onClick={()=>handleLogout()} 
                        className="text-text2 hover:text-red-500 duration-100"
                    >
                        <IconLogout width={35} height={35}/>
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
        </div>
    )
};

export default Header;

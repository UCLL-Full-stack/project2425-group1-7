import { UserInfo } from "@/types/index";
import Link from "next/link";
import { useRouter } from "next/router";
import IconAvatar from "./ui/avatar";
import IconLogout from "./ui/logout";

type Props = {
    current: "home" | "profile" | "feed" | "discover" | "login"
    user?: UserInfo;
}

const Header: React.FC<Props> = ({current, user}: Props) => { 
    const router = useRouter();
    const linkStyle = `text-text2 hover:text-bg3 duration-100`
    const currentStyle = `text-bg3 hover:text-bg2 duration-100`

    const handleLogout = () => {
        sessionStorage.removeItem("LoggedInUser");
        router.reload();
    }

    return (
        <div className="bg-text1 sm:py-3 md:py-8 sm:px-4 md:px-16 lg:px-20 md:flex sm:grid sm:gap-4 sm:justify-center md:justify-between items-center">
            <div className="flex justify-center sm:text-4xl md:text-6xl sm:justify-center md:justify-start items-center yadig-italic mr-4 text-text2 hover:text-bg3 duration-100 ">
                <Link href="/">yadig?</Link>
            </div>
            <div className="main-font sm:text-md md:text-2xl cursor-pointer flex text-center items-center gap-4 sm:gap-8 md:gap-10">
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
                        Discover
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
        </div>
    )
};

export default Header;

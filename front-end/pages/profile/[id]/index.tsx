import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ListModal from "@/components/lists/createListModal";
import ReviewCard from "@/components/reviews/reviewCard";
import ReviewModal from "@/components/reviews/createReviewModal";
import ConfirmModal from "@/components/ui/DeleteModal";
import IconAdd from "@/components/ui/add";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { ListInput, ReviewInput, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";

const Profile: React.FC = () => {

    const router = useRouter();
    const [isBlockModal, setIsBlockModal] = useState<boolean>(false);
    const [isPromoteModal, setIsPromoteModal] = useState<boolean>(false);
    const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isDeleteListOpen, setIsDeleteListOpen] = useState<boolean>(false);
    const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [user, setUser] = useState<User>();
    const [sessionUser, setSessionUser] = useState<User>();
    const [isUserProfile, setIsUserProfile] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchUser = async (id: number) => {
        const response = await userService.findById(id);
        if (!response.ok){
            const res = await response.json();
            setError(res.message);
            return;
        }

        setUser(await response.json());
    }


    if (sessionUser && sessionUser.isBlocked){
        router.push('/blocked');
    }

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if(!userString || 
           userService.isJwtExpired(JSON.parse(userString).token)
          ){
            router.push("/login");
            return;
        }

        const u = JSON.parse(userString);
        setSessionUser({
            id: u.id,
            username: u.username,
            createdAt: u.createdAt,
            isBlocked: u.isBlocked,
            role: u.role
        });

        const id = Number(router.query.id);
        if(isNaN(id)) return;
        fetchUser(id); 

        setIsUserProfile(false);
        if(u.id === id){
            setIsUserProfile(true);
        }
    }, [isListModalOpen, 
        isReviewModalOpen, 
        isDeleteListOpen, 
        isDeleteReviewOpen, 
        isBlockModal,
        isPromoteModal,
        router,
    ]);

    const handleCreateList = async (list: ListInput) => {
        const newList = await listService.createList(list);
        console.log(newList);
        toggleListModal();
    }

    const handleCreateReview = async (review: ReviewInput) => {
        const newList = await reviewService.createReview(review);
        console.log(newList);
        toggleReviewModal();
    }

    const handlePromoteUser = async () => {
        if(!user)return;
        const response = await userService.promoteUser(user.id);
        if (!response.ok){
            setError("Error Blocking User");
        }
        togglePromoteModal();
    }

    const handleBlockUser = async () => {
        if(!user)return;
        const response = await userService.blockAccount(user.id);
        if (!response.ok){
            setError("Error Blocking User");
        }
        toggleBlockModal();
    }

    const handleDeleteList = async () => {
        toggleDeleteList(selectedId);
        const response = await listService.deleteList(selectedId);
        if (!response.ok) {
            setError("Error Deleting List");
        }
        setUser(await response.json());
    }

    const handleDeleteReview = async () => {
        toggleDeleteReview(selectedId);
        const response = await reviewService.deleteReview(selectedId);
        if (!response.ok) {
            setError("Error Deleting Review");
        }
    }

    const togglePromoteModal = () => setIsPromoteModal(!isPromoteModal);
    const toggleBlockModal = () => setIsBlockModal(!isBlockModal);
    const toggleListModal = () => setIsListModalOpen(!isListModalOpen);
    const toggleReviewModal = () => setIsReviewModalOpen(!isReviewModalOpen);
    const toggleDeleteList = (id?: number) => {
        setSelectedId(id??-1)
        setIsDeleteListOpen(!isDeleteListOpen);
    }
    const toggleDeleteReview = (id?: number) => {
        setSelectedId(id??-1)
        setIsDeleteReviewOpen(!isDeleteReviewOpen);
    }

    return (
            <>
                <Head>
                    <title>Yadig</title>
                </Head>
                <div className="flex flex-col h-screen">
                    <Header current={isUserProfile?"profile":"home"} user={sessionUser} />
                    {error ? (
                        <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                            <span className="text-red-800 main-font">{error}</span>
                        </div>
                    ):(user && sessionUser &&
                        <>
                            <div className="bg-bg1 sm:p-4 lg:pt-8 w-screen border-b border-bg3 grid justify-center gap-3">
                                <span className="text-center main-font text-text2 text-4xl">
                                    {user.username}
                                </span>
                                <span className="text-center yadig-italic text-text2 text-xl">
                                    digging since {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                                </span>
                                <div className="grid grid-cols-2 justify-center gap-4 max-w-[25vw]">
                                {sessionUser.role === "admin" && user.role !== 'admin' && !isUserProfile && (
                                    <>
                                        <button
                                            onClick={toggleBlockModal}
                                            type="button"
                                            className={`${user.isBlocked && 'col-span-2'} rounded-lg px-3 py-2 main-font text-sm text-white hover:bg-text2 hover:text-red-500 bg-red-500 transition-colors duration-100`}
                                        >
                                            {user.isBlocked?'Unblock':'Block'} Account
                                        </button>
                                    {!user.isBlocked &&
                                        <button
                                            onClick={togglePromoteModal}
                                            type="button"
                                            className={`${user.role == 'user'? "text-text2 bg-text1 hover:bg-text2 hover:text-text1": "text-text1 bg-text2 hover:bg-red-500 hover:text-text2"} rounded-lg px-3 py-2 main-font text-sm transition-colors duration-100`}
                                        >
                                            {user.role == 'user'? "Promote to Moderator": "Demote to user"}
                                        </button>
                                    }
                                    </>
                                )}
                                </div>
                            </div>
                            {(user.role === "admin" || user.role === "moderator") && (
                                <span className="text-center bg-bg1 border-b border-bg3  main-thin text-green-500 text-xl">
                                {user.role.toUpperCase()}
                                </span>
                            )}
                            {user.isBlocked ? (
                                <>
                                <span className="text-center bg-text1 border-b border-bg3  main-thin text-red-500 text-xl">
                                    BLOCKED BY ADMIN
                                </span>
                                <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                                </main>
                                </>
                            ):(
                                <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                                    <div className="w-full lg:w-1/2 lg:pr-10 mb-6 lg:mb-0">
                                        <div className="relative flex items-center justify-center">
                                        {isUserProfile ? (
                                            <>
                                                <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Reviews</h1>
                                                <button
                                                    onClick={toggleReviewModal}
                                                    type="button"
                                                    className="absolute right-0 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                                >
                                                    <IconAdd width={20} height={20}/>
                                                </button>
                                            </>
                                        ):(
                                            <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">Album Reviews</h1>
                                        )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 justify-center pt-6 sm:pt-10 gap-4">
                                        {user.reviews && user.reviews.length > 0 ? user.reviews.map((review) => (
                                                <ReviewCard key={review.id} review={review} onDelete={isUserProfile?toggleDeleteReview:undefined} userId={user.id}/>
                                        )) : (
                                                <h2 className="col-span-1 sm:col-span-2 text-center main-font text-white">No Reviews To Show</h2>
                                        )}
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-1/2 lg:pl-10">
                                        <div className="relative flex items-center justify-center">
                                        {isUserProfile ? (
                                            <>
                                                <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Lists</h1>
                                                <button
                                                    onClick={toggleListModal}
                                                    type="button"
                                                    className="absolute right-0 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                                >
                                                    <IconAdd width={20} height={20}/>
                                                </button>
                                            </>
                                        ):(
                                            <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">Album Lists</h1>
                                        )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 pt-6 sm:pt-10 gap-4">
                                            {user.lists && user.lists.length > 0 ? user.lists.map((list) => (
                                                <ListCard key={list.id} list={list}  onDelete={isUserProfile?toggleDeleteList:undefined} userId={user.id}/>
                                            )) : (
                                                <h2 className="col-span-1 sm:col-span-2 text-center main-font text-white">No Lists To Show</h2>
                                            )}
                                        </div>
                                    </div>

                                </main>
                            )}
                            {isListModalOpen && user && (
                                <ListModal 
                                    isOpen={isListModalOpen} 
                                    onClose={toggleListModal} 
                                    onSave={(newList: ListInput) => handleCreateList(newList)} 
                                    user={user}
                                />
                            )}
                            {isReviewModalOpen && user && (
                                <ReviewModal
                                    isOpen={isReviewModalOpen} 
                                    onClose={toggleReviewModal} 
                                    onSave={(newReview: ReviewInput) => handleCreateReview(newReview)} 
                                    authorId={user.id}
                                />
                            )}
                            {isDeleteListOpen && user && (
                                <ConfirmModal 
                                    isDeleting={true}
                                    id={selectedId} 
                                    handler={handleDeleteList} 
                                    onClose={toggleDeleteList}
                                    message={`Delete List ?`}
                                    />
                            )}
                            {isDeleteReviewOpen && user && (
                                <ConfirmModal 
                                    isDeleting={true}
                                    id={selectedId} 
                                    handler={handleDeleteReview} 
                                    onClose={toggleDeleteReview}
                                    message={`Delete Review ?`}
                                    />
                            )}
                            {isBlockModal && user && (
                                <ConfirmModal 
                                    isDeleting={true}
                                    handler={handleBlockUser} 
                                    onClose={toggleBlockModal}
                                    message={`${user.isBlocked?"Unblock":"Block"} ${user.username}?`}
                                    />
                            )}
                            {isPromoteModal && user && (
                                <ConfirmModal 
                                    isDeleting={false}
                                    handler={handlePromoteUser} 
                                    onClose={togglePromoteModal}
                                    message={`${user.role === 'user'?'Promote':'Demote'} ${user.username}?`}
                                    />
                            )}
                        </>
                      )}
                </div>
            </>
    );
}

export default Profile;

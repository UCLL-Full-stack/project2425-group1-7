import Header from "@/components/header";
import ListCard from "@/components/lists/listCard";
import ListModal from "@/components/lists/listModal";
import ReviewCard from "@/components/reviews/reviewCard";
import ReviewModal from "@/components/reviews/reviewModal";
import ConfirmModal from "@/components/ui/DeleteModal";
import IconAdd from "@/components/ui/add";
import listService from "@/services/listService";
import reviewService from "@/services/reviewService";
import userService from "@/services/userService";
import { List, ListInput, ReviewInput, Review, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile: React.FC = () => {

    const router = useRouter();
    const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isDeleteListOpen, setIsDeleteListOpen] = useState<boolean>(false);
    const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [user, setUser] = useState<User>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if(!userString || 
           userService.isJwtExpired(JSON.parse(userString).token)
          ){
            setIsLoggedIn(false); 
            router.push("/login");
            return;
        }
        setIsLoggedIn(true);

        const id = JSON.parse(userString).id;
        fetchUser(id); 
    }, [isListModalOpen, isReviewModalOpen, isDeleteListOpen, isDeleteReviewOpen]);

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

    const handleDeleteList = async () => {
        toggleDeleteList(selectedId);
        const response = await listService.deleteList(selectedId);
        if (!response.ok) {
            setError("Error Deleting List");
        }
    }

    const handleDeleteReview = async () => {
        toggleDeleteReview(selectedId);
        const response = await reviewService.deleteReview(selectedId);
        if (!response.ok) {
            setError("Error Deleting Review");
        }
    }

    const toggleListModal = () => setIsListModalOpen(!isListModalOpen);
    const toggleReviewModal = () => setIsReviewModalOpen(!isReviewModalOpen);
    const toggleDeleteList = (id: number) => {
        setSelectedId(id)
        setIsDeleteListOpen(!isDeleteListOpen);
    }
    const toggleDeleteReview = (id: number) => {
        setSelectedId(id)
        setIsDeleteReviewOpen(!isDeleteReviewOpen);
    }

    return (
            <>
                <Head>
                    <title>Yadig</title>
                </Head>
                <div className="flex flex-col h-screen">
                    <Header current="profile" isLoggedIn={isLoggedIn} />
                    {error ? (
                        <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                            <span className="text-red-800 main-font">{error}</span>
                        </div>
                    ):(user && 
                        <>
                            <div className="bg-bg1 w-screen grid gap-3">
                                <span className="text-center main-font text-text2 text-4xl">
                                    {user.username}
                                </span>
                                <span className="text-center main-thin text-text2 text-xl">
                                    digging since {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                                <div className="w-full lg:w-1/2 lg:pr-10 mb-6 lg:mb-0">
                                    <div className="relative flex items-center justify-center">
                                        <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Reviews</h1>
                                        <button
                                            onClick={toggleReviewModal}
                                            type="button"
                                            className="absolute right-0 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                        >
                                            <IconAdd width={20} height={20}/>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 justify-center pt-6 sm:pt-10 gap-4">
                                    {user && user.reviews.length > 0 ? user.reviews.map((review) => (
                                            <ReviewCard key={review.id} review={review} onDelete={toggleDeleteReview} userId={user.id}/>
                                    )) : (
                                        <h2 className="pt-6 sm:pt-10 sm:col-span-2 text-center main-font text-white">No Reviews To Show</h2>
                                    )}
                                    </div>
                                </div>

                                <div className="w-full lg:w-1/2 lg:border-l-[1px] border-bg2 lg:pl-10">
                                    <div className="relative flex items-center justify-center">
                                        <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Lists</h1>
                                        <button
                                            onClick={toggleListModal}
                                            type="button"
                                            className="absolute right-0 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                        >
                                            <IconAdd width={20} height={20}/>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 pt-6 sm:pt-10 gap-4">
                                        {user && user.lists.length > 0 ? user.lists.map((list) => (
                                            <ListCard key={list.id} list={list}  onDelete={toggleDeleteList}/>
                                        )) : (
                                            <h2 className="col-span-1 sm:col-span-2 text-center main-font text-white">No Lists To Show</h2>
                                        )}
                                    </div>
                                </div>

                            </main>
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
                                    id={selectedId} 
                                    handler={handleDeleteList} 
                                    onClose={toggleDeleteList}
                                    message={`Confirm List Deletion`}
                                    />
                            )}
                            {isDeleteReviewOpen && user && (
                                <ConfirmModal 
                                    id={selectedId} 
                                    handler={handleDeleteReview} 
                                    onClose={toggleDeleteReview}
                                    message={`Confirm Review Deletion`}
                                    />
                            )}
                        </>
                      )}
                </div>
            </>
    );
}

export default Profile;

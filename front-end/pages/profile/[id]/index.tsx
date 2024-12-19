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
import { List, ListInput, Review, ReviewInput, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from 'swr';

const fetchUser = async (id: number) => {
    const response = await userService.findById(id);
    if (!response.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
};

const Profile: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    
    const [isBlockModal, setIsBlockModal] = useState<boolean>(false);
    const [isPromoteModal, setIsPromoteModal] = useState<boolean>(false);
    const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isDeleteListOpen, setIsDeleteListOpen] = useState<boolean>(false);
    const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState<boolean>(false);
    const [isEditReviewOpen, setIsEditReviewOpen] = useState<boolean>(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [sessionUser, setSessionUser] = useState<User>();

    const { data: user, error: userError, mutate: mutateUser } = useSWR<User>(
        id ? `/api/users/${id}` : null,
        ()=>fetchUser(Number(id))
    );

    const isUserProfile = sessionUser?.id === Number(id);
    const isFollowing = user?.followedBy?.includes(sessionUser?.id ?? -1);
    const isFollower = user?.following?.includes(sessionUser?.id?? -1);

    useEffect(() => {
        const userString = sessionStorage.getItem("LoggedInUser");
        if (!userString || userService.isJwtExpired(JSON.parse(userString).token)) {
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
    }, [router]);

    if (sessionUser?.isBlocked) {
        router.push('/blocked');
    }

    const handleCreateList = async (list: ListInput) => {
        const response = await listService.createList(list);
        if(response.ok){
            mutateUser();
        }
        toggleCreateListModal();
    }

    const handleEditList = async (list: ListInput, id: number) => {
        const response = await listService.editList(list, id);
        if(response.ok){
            mutateUser();
        }
        toggleEditListModal(null);
    };


    const handleCreateReview = async (review: ReviewInput) => {
        await reviewService.createReview(review);
        mutateUser();
        toggleCreateReviewModal();
    }

    const handleEditReview = async (review: ReviewInput) => {
        if(!editingReview)return;
        const response = await reviewService.editReview(review, editingReview?.id);
        if(response.ok){
            mutateUser();
        }
        toggleEditReviewModal(null);
    };

    const handlePromoteUser = async () => {
        if (!user) return;
        const response = await userService.promoteUser(user.id);
        if (response.ok) {
            mutateUser();
        }
        togglePromoteModal();
    }

    const handleBlockUser = async () => {
        if (!user) return;
        const response = await userService.blockAccount(user.id);
        if (response.ok) {
            mutateUser();
        }
        toggleBlockModal();
    }

    const handleDeleteList = async () => {
        const response = await listService.deleteList(selectedId);
        if (response.ok) {
            mutateUser();
        }
        toggleDeleteList();
    }

    const handleDeleteReview = async () => {
        const response = await reviewService.deleteReview(selectedId);
        if (response.ok) {
            mutateUser();
        }
        toggleDeleteReview();
    }

    const handleFollowUser = async () => {
        if (!user) return;
        try {
            const response = isFollowing
                ? await userService.unfollowUser(user.id)
                : await userService.followUser(user.id);
            if (response.ok) {
                mutateUser();
            }
        } catch (error) {
            console.error("Error following/unfollowing user", error);
        }
    }

    const togglePromoteModal = () => setIsPromoteModal(!isPromoteModal);
    const toggleBlockModal = () => setIsBlockModal(!isBlockModal);
    const toggleCreateListModal = () => setIsListModalOpen(!isListModalOpen);
    const toggleEditListModal = (list: List | null) => {
        setEditingList(list??null);
        setIsListModalOpen(!isListModalOpen);
    }
    const toggleCreateReviewModal = () => setIsReviewModalOpen(!isReviewModalOpen);
    const toggleEditReviewModal = (review: Review | null) => {
        setEditingReview(review??null);
        setIsReviewModalOpen(!isReviewModalOpen);
    }
    const toggleDeleteList = (id?: number) => {
        setSelectedId(id ?? -1);
        setIsDeleteListOpen(!isDeleteListOpen);
    }
    const toggleDeleteReview = (id?: number) => {
        setSelectedId(id ?? -1);
        setIsDeleteReviewOpen(!isDeleteReviewOpen);
    }

    if (userError) return (
        <div className="flex flex-col h-screen bg-bg1  items-center">
            <Header current={isUserProfile ? "profile" : "home"} user={sessionUser} />
            <span className="text-red-800 main-font">Error loading user data</span>
        </div>
    );

    if (!user || !sessionUser) return (
        <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
            <span className="text-white main-font">Loading...</span>
        </div>
    );

    return (
        <>
            <Head>
                <title>Yadig</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current={isUserProfile ? "profile" : "home"} user={sessionUser} />
                <div className="bg-bg1 sm:p-4 lg:pt-8 w-screen border-b border-bg3 grid justify-center gap-3">
                    <div className="flex gap-3 items-center justify-center">
                        <span className="text-center main-font text-text2 text-4xl">
                            {user.username}
                        </span>
                        {!isUserProfile && sessionUser && (
                            <button
                                onClick={handleFollowUser}
                                type="button"
                                className={`rounded-lg px-2 py-1 mt-2 main-font text-sm transition-colors duration-100 ${
                                    isFollowing
                                        ? "bg-text2 text-text1 hover:bg-text1 hover:text-text2"
                                        : "bg-text1 text-text2 hover:bg-text2 hover:text-text1"
                                }`}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
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
                                    {user.isBlocked ? 'Unblock' : 'Block'} Account
                                </button>
                                {!user.isBlocked && (
                                    <button
                                        onClick={togglePromoteModal}
                                        type="button"
                                        className={`${user.role == 'user' ? "text-text2 bg-text1 hover:bg-text2 hover:text-text1" : "text-text1 bg-text2 hover:bg-red-500 hover:text-text2"} rounded-lg px-3 py-2 main-font text-sm transition-colors duration-100`}
                                    >
                                        {user.role == 'user' ? "Promote to Moderator" : "Demote to user"}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    {isFollower &&
                        <div className="flex justify-center">
                            <span className="text-center rounded-lg px-3 main-font text-sm transition-colors duration-100 text-text2 bg-text1 yadig-italic text">Follows you</span>
                        </div>
                    }
                </div>

                {(user.role === "admin" || user.role === "moderator") && (
                    <span className="text-center bg-bg1 border-b border-bg3 main-thin text-green-500 text-xl">
                        {user.role.toUpperCase()}
                    </span>
                )}

                {user.isBlocked ? (
                    <>
                        <span className="text-center bg-text1 border-b border-bg3 main-thin text-red-500 text-xl">
                            BLOCKED BY ADMIN
                        </span>
                        <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                        </main>
                    </>
                ) : (
                    <main className="flex-1 flex flex-col lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-hidden">
                        <div className="w-full lg:w-1/2 lg:pr-10 mb-6 lg:mb-0 overflow-y-auto">
                            <div className="flex justify-between items-center sticky top-0 z-10 bg-bg1 p-2 sm:p-3 lg:p-4">
                                {isUserProfile ? (
                                    <>
                                        <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Reviews</h1>
                                        <button
                                            onClick={toggleCreateReviewModal}
                                            type="button"
                                            className="mt-2 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                        >
                                            <IconAdd width={20} height={20} />
                                        </button>
                                    </>
                                ) : (
                                    <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">Album Reviews</h1>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 p-10 justify-center pt-6 sm:pt-10 gap-4 overflow-y-auto">
                                {user.reviews && user.reviews.length > 0 ? user.reviews.map((review) => (
                                    <ReviewCard 
                                        key={review.id} 
                                        review={review} 
                                        onEdit={isUserProfile ? toggleEditReviewModal : undefined}
                                        onDelete={isUserProfile ? toggleDeleteReview : undefined} 
                                        userId={user.id} 
                                    />
                                )) : (
                                    <h2 className="col-span-1 sm:col-span-2 text-center main-font text-white">No Reviews To Show</h2>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 lg:pl-10 overflow-y-auto">
                            <div className="flex justify-between items-center sticky top-0 z-10 bg-bg1 p-2 sm:p-3 lg:p-4">
                                {isUserProfile ? (
                                    <>
                                        <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">My Album Lists</h1>
                                        <button
                                            onClick={toggleCreateListModal}
                                            type="button"
                                            className="mt-2 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-text1 text-text2 hover:text-bg1 hover:bg-white transition-colors duration-100"
                                        >
                                            <IconAdd width={20} height={20} />
                                        </button>
                                    </>
                                ) : (
                                    <h1 className="main-font text-text2 text-2xl sm:text-3xl lg:text-4xl">Album Lists</h1>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 pt-6 p-10 rounded-lg sm:pt-10 gap-4 overflow-y-auto">
                                {user.lists && user.lists.length > 0 ? user.lists.map((list) => (
                                    <ListCard onEdit={()=>toggleEditListModal(list)} key={list.id} list={list} onDelete={isUserProfile ? toggleDeleteList : undefined} userId={user.id} />
                                )) : (
                                    <h2 className="col-span-1 sm:col-span-2 text-center main-font text-white">No Lists To Show</h2>
                                )}
                            </div>
                        </div>
                    </main>
                )}

                {isListModalOpen && user && (
                    <>
                        {editingList ? (
                            <ListModal
                                isOpen={isListModalOpen}
                                onClose={()=>toggleEditListModal(null)}
                                onEdit={handleEditList}
                                user={user}
                                list={editingList}
                            />
                        ):(
                            <ListModal
                                isOpen={isListModalOpen}
                                onClose={toggleCreateListModal}
                                onSave={handleCreateList}
                                user={user}
                            />
                        )}
                    </>
                )}
                {isReviewModalOpen && user && (
                    <>
                        {editingReview ? (
                            <ReviewModal
                                isOpen={isReviewModalOpen}
                                onClose={toggleEditReviewModal}
                                onSave={handleEditReview}
                                authorId={user.id}
                                review={editingReview}
                            />
                        ):(
                            <ReviewModal
                                isOpen={isReviewModalOpen}
                                onClose={toggleCreateReviewModal}
                                onSave={handleCreateReview}
                                authorId={user.id}
                            />
                        )}
                    </>
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
                        message={`${user.isBlocked ? "Unblock" : "Block"} ${user.username}?`}
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
            </div>
        </>
    );
}

export default Profile;

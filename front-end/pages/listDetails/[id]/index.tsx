import Header from "@/components/header";
import IconDisc from "@/components/ui/loading";
import albumService from "@/services/albumService";
import listService from "@/services/listService";
import userService from "@/services/userService";
import { Album, List, ListInput, User } from "@/types/index";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ListDetails from "@/components/lists/listDetails";
import ConfirmModal from "@/components/ui/DeleteModal";
import ListModal from "@/components/lists/createListModal";

const ListDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [error, setError] = useState<string>("");
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);

    const { data: user, error: userError } = useSWR<User>(
        'user',
        () => {
            const userString = sessionStorage.getItem("LoggedInUser");
            if (userString && !userService.isJwtExpired(JSON.parse(userString).token)) {
                const u = JSON.parse(userString);
                return {
                    id: u.id,
                    username: u.username,
                    isBlocked: u.isBlocked,
                    role: u.role
                };
            }
            throw new Error('User not authenticated');
        }
    );

    const { data: listData, error: listError, mutate } = useSWR<{list: List, albums: Album[]}>(
        id ? `listWithAlbums/${id}` : null,
        () => fetchListWithAlbums(Number(id))
    );

    useEffect(() => {
        if (userError) {
            router.push("/login");
        }
    }, [userError, router]);

    useEffect(() => {
        if (user?.isBlocked) {
            router.push('/blocked');
        }
    }, [user, router]);

    useEffect(() => {
        if (listError) {
            setError(listError.message);
        } else if (listData?.list.author.isBlocked) {
            setError("List No Longer Exists");
        } else {
            setError("");
        }
    }, [listError, listData]);

    const handleDelete = async ()=>{
        toggleDelete();
        if(!listData?.list) return;
        const response = await listService.deleteList(listData.list.id);
        if(!response){
            setError("error deleting list");
        }
        router.back();
    };

    const handleEdit = async (list: ListInput)=>{
        toggleEdit();
        if(!listData?.list) return;
        const response = await listService.editList(list, listData.list.id);
        if(!response){
            setError("error deleting list");
        }
        mutate();
    };

    const toggleEdit = () => {
        setEditModal(!editModal);
    };

    const toggleDelete = () => {
        setDeleteModal(!deleteModal);
    };

    const isUserList = listData?.list.author.id === user?.id;
    const isLoading = !listData && !listError;

    return (
        <>
            <Head>
                <title>{listData?.list ? (listData.list.title + " - Yadig") : "List Details"}</title>
            </Head>
            <div className="flex flex-col h-screen">
                <Header current="home" user={user}/>
                {error && (
                    <div className="flex-1 flex flex-col justify-center lg:flex-row bg-bg1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                        <span className="text-red-800 main-font">{error}</span>
                    </div>
                )}
                <main className="flex-1 bg-bg1 p-10 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <IconDisc height={100} width={100}/>
                        </div>
                    ) : (!error && listData && user && 
                        <>
                            <ListDetails
                                list={listData.list}
                                albums={listData.albums}
                                user={user}
                                onDelete={isUserList||user.role==='admin'?toggleDelete:undefined}
                                onEdit={isUserList?toggleEdit:undefined}
                            />
                            {deleteModal && (
                                <ConfirmModal
                                    handler={handleDelete}
                                    onClose={toggleDelete}
                                    isDeleting={true}
                                    message={`Delete List?`}
                                />
                            )}
                            {editModal && (
                                <ListModal
                                    isOpen={editModal} 
                                    onClose={toggleEdit}
                                    onEdit={handleEdit}
                                    user={user}
                                    list={listData.list}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

const fetchListWithAlbums = async (id: number): Promise<{list: List, albums: Album[]}> => {
    const response = await listService.getListById(id);
    if (!response.ok){
        throw new Error("couldn't find list"); 
    }
    const list: List = await response.json();
    
    const albumDetails = list.albumIds.map(id => id.split('_'));
    const albums = await Promise.all(
        albumDetails.map(([title, artist]) => 
            albumService.fetchAlbum(title, artist)
        )
    );

    return { list, albums };
};

export default ListDetailsPage;

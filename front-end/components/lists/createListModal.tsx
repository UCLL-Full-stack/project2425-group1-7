import React, { useEffect, useState } from "react";
import { Album, ListInput, User } from "@/types/index";
import albumService from "@/services/albumService";
import AlbumListCard from "../album/albumListCard";
import AlbumSearch from "../album/albumSearch";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newList: ListInput) => void;
    user: User,
};

const ListModal: React.FC<Props> = ({ isOpen, onClose, onSave, user }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [albums, setAlbums] = useState<Album[]>([]);
    const [query, setQuery] = useState<string>('');
    const [listAlbums, setListAlbums] = useState<Album[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(()=>{
        const fetchAlbums = async ()=>{
            if(!query){
                setAlbums([]);
                return;
            }
            const albums = await albumService.searchAlbums(query);    
            setAlbums(albums);
        }
        fetchAlbums();
        console.log(albums);
    },[query]);

    const albumIsAdded = (album: Album) => {
        return listAlbums.find((a) => album.name == a.name && album.artist == a.artist);
    }

    const handleAddAlbum = (id:string) => {
        
        const selectedAlbum = albums.find((album)=>album.id === id);
        if(!selectedAlbum) return;

        if(albumIsAdded(selectedAlbum)) return;

        setListAlbums([ ...listAlbums, selectedAlbum ])
        setQuery('');
    }

    const handleRemoveAlbum = (toRemove: Album) => {
        setListAlbums([
            ...listAlbums.filter(
                (album)=> album.id !== toRemove.id           
            )
        ]);
    }

    const handleSave = () => {

        if(!listAlbums || listAlbums.length == 0){
            setError("List cannot be empty")
            return;
        }

        const albumIds = [...listAlbums.map((album)=>album.id)];
        console.log(albumIds);

        if(!albumIds) return;

        const newList: ListInput = {
            authorId: user.id,
            title,
            description,
            albums: albumIds
        };

        onSave(newList);
    };

    return (
        <div className={`fixed inset-0 z-20  flex px-4 items-center justify-center bg-black bg-opacity-50 transition-opacity duration-100 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-text1 p-6 rounded-lg w-full max-w-md shadow-lg transform transition-transform duration-100 ${isOpen ? 'scale-100' : 'scale-0'}`}>
                <h2 className="text-2xl text-text2 main-font mb-4">Create an album list</h2>
                <label className="block mb-2 text-sm text-bg2 main-font">
                    Title
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block bg-bg4 text-text2 w-full mt-1 p-2 rounded"
                    />
                </label>

                <label className="block mb-4 text-sm text-bg2 main-font">
                    Description
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block bg-bg4 text-text2 w-full mt-1 p-2 rounded"
                    />
                </label>
                <AlbumSearch label="Albums" albums={albums} onAdd={handleAddAlbum} setQuery={setQuery} query={query}/>
                <AlbumListCard albums={listAlbums} onRemove={handleRemoveAlbum}/>
                {error && 
                    <div className="w-full text-center text-text2 border-1 rounded-md bg-red-500 p-2">
                        <span className="main-font">{error}</span>
                    </div>
                }
                <div className="flex justify-end main-font space-x-3 mt-8">
                    <button 
                        onClick={onClose} 
                        className="rounded-lg main-font w-2/4 px-3 py-2 text-sm text-white hover:bg-text2 hover:text-red-500 bg-red-500 transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="rounded-lg main-font w-2/4 px-3 py-2 main-font text-sm sm:text-base text-text2 bg-bg4 hover:bg-bg2 transition-colors duration-100"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListModal;

import React, { useEffect, useState } from "react";
import { Album, ReviewInput } from "@/types/index";
import albumService from "@/services/albumService";
import { Rating } from "@mui/material";
import AlbumListCard from "../album/albumListCard";
import AlbumSearch from "../album/albumSearch";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newList: ReviewInput) => void;
    authorId: number,
    album?: Album,
};

const ReviewModal: React.FC<Props> = ({ isOpen, onClose, onSave, authorId, album}) => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [albums, setAlbums] = useState<Album[]>([]);
    const [query, setQuery] = useState<string>('');
    const [reviewAlbum, setReviewAlbum] = useState<Album | null>(null);
    const [starRating, setStarRating] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const fetchAlbums = async () => {
        if (!query) {
            setAlbums([]);
            return;
        }
        const albums = await albumService.searchAlbums(query);
        setAlbums(albums);
    }

    useEffect(() => {
        fetchAlbums();
    }, [query]);

    const handleAddAlbum = (id: string) => {
        const selectedAlbum = albums.find((album) => album.id === id);
        if (!selectedAlbum) return;
        if (selectedAlbum == reviewAlbum) return;
        setReviewAlbum(selectedAlbum);
        setQuery('');
    }

    const handleRemoveAlbum = (album?: Album) => {
        setReviewAlbum(null);
    }

    const handleSave = () => {

        if (!reviewAlbum && !album) {
            setError("Choose an album to review");
            return;
        }

        if (title == "" || body == ""){
            setError("Please fill out all fields")
            return;
        }

        const newReview: ReviewInput = {
            title,
            body,
            albumId: (reviewAlbum?reviewAlbum.id:album?.id) || '',
            authorId,
            starRating,
        };

        onSave(newReview);
    };

    return (
        <div className={`fixed inset-0 z-20 flex px-4 items-center justify-center bg-black bg-opacity-50 transition-opacity duration-100 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-text1 p-6 rounded-lg w-full max-w-md shadow-lg transform transition-transform duration-100 ${isOpen ? 'scale-100' : 'scale-0'}`}>
                <h2 className="text-2xl text-text2 main-font mb-4">Review an album</h2>
                <label className="block mb-2 text-sm text-bg2 main-font">
                    Title
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block bg-bg4 text-text2 w-full mt-1 p-2 rounded"
                        required
                    />
                </label>

                <label className="block mb-4 text-sm text-bg2 main-font">
                    Body
                    <textarea 
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="block bg-bg4 text-text2 w-full mt-1 p-2 rounded"
                        required
                    />
                </label>
                {!album && (
                    <AlbumSearch label="albums" albums={albums} onAdd={handleAddAlbum} setQuery={setQuery} query={query}/>
                )}
                {reviewAlbum && !album && (
                    <>
                        <AlbumListCard review={true} albums={[reviewAlbum]} onRemove={handleRemoveAlbum}/>
                        <label className="flex bg-text2 rounded-b-md justify-center items-center p-2 text-sm text-text2 main-font">
                            <Rating 
                                onChange={(e, newValue) => setStarRating(Number(newValue))}
                                value={starRating}
                                size="large"
                            />
                        </label>
                    </>
                )}
                {album && (
                    <>
                        <AlbumListCard review={true} albums={[album]} onRemove={handleRemoveAlbum}/>
                        <label className="flex bg-text2 rounded-b-md justify-center items-center p-2 text-sm text-text2 main-font">
                            <Rating 
                                onChange={(e, newValue) => setStarRating(Number(newValue))}
                                value={starRating}
                                size="large"
                            />
                        </label>
                    </>
                )}
                {error && 
                    <div className="w-full text-center border-1 rounded-md bg-bg1 p-2">
                        <span className="text-[#d00] main-font">{error}</span>
                    </div>
                }
                <div className="flex justify-end main-font space-x-3 mt-8">
                    <button 
                        onClick={onClose} 
                        className="rounded-lg w-2/4 px-3 py-2 text-sm text-white hover:bg-text2 hover:text-red-500 bg-red-500 transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="rounded-lg w-2/4 px-3 py-2 main-font text-sm sm:text-base text-text2 bg-bg4 hover:bg-bg2 transition-colors duration-100"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

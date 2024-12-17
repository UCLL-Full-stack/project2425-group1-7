import React from "react";
import { Album } from "@/types";

type Props = {
    album: Album;
};

const AlbumCard: React.FC<Props> = ({ album }) => {
    const imageUrl = album.image[4]?.["#text"] || "";

    return (
        <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 min-w-[10vw] items-center bg-bg3 shadow-md rounded-lg p-4 hover:scale-105 hover:shadow-lg duration-200">
            <div className="aspect-square">
                <img
                    src={imageUrl}
                    alt={`${album.name} cover`}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>

            <div className="grid pl-4 text-center sm:text-left md:text-center">
                <h3 className="text-lg main-font text-text2 truncate w-full">
                    {album.name}
                </h3>
                <p className="text-md main-thin text-text1 truncate w-full">
                    {album.artist}
                </p>
            </div>
        </div>    
    );
};

export default AlbumCard;


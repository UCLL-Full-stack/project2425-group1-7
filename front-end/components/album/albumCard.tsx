import React from "react";
import { Album } from "@/types";

type Props = {
    album: Album;
};

const AlbumCard: React.FC<Props> = ({ album }) => {
    const imageUrl = album.image[3]?.["#text"] || "";

    return (
        <div className="max-w-[10vw] gap-4 sm:max-w-[40vw] md:max-w-[25vw] lg:max-w-[18vw] grid grid-cols-2 lg:grid-cols-1 items-center bg-bg3 shadow-md rounded-lg p-2 hover:scale-105 hover:shadow-lg duration-200">
          <div className="aspect-square">
            <img
              src={imageUrl}
              alt={`${album.name} cover`}
              className="object-cover rounded-md"
            />
          </div>

          <div className="grid pl-4 text-center sm:pl-2 sm:text-left md:pl-0 md:text-center">
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


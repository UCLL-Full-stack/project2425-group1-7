import { Album } from "@/types/index";

type Props={
    albums: Album[];
    onRemove?: (album: Album)=>void;
    review?: boolean;
}

const AlbumListCard = ({albums, onRemove, review}: Props) => {

    return(
        <div className={albums.length>0?`border ${review?"rounded-t-md":"rounded-md"} border-text2`:""}>
            {albums.map((album: Album, i)=>
                    <div key={i} className="w-full justify-between flex gap-5 p-2 items-center">
                        <div className="flex gap-5 items-center">
                            <img
                                className="rounded-md mb-4"
                                src={album.image[1]["#text"]} alt="cover"
                            />
                            <h2 className="text-white main-font text-left text-sm">
                            {album.artist} - {album.name}
                            </h2>  
                        </div>
                        {onRemove &&
                            <button
                                className="rounded-lg px-2 bg-red-500 text-white hover:text-red-500 hover:bg-text2 transition-colors duration-100"
                                onClick={()=>onRemove(album)}
                            >
                               ✖ 
                            </button>
                        }
                    </div>
            )}
        </div>
    )
}
export default AlbumListCard;

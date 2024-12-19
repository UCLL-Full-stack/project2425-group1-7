import { Album } from "@/types/index";
import { Input } from "@mui/material";

type Props={
    albums: Album[];
    query: string;
    setQuery: (query:string)=>void
    onAdd?: (id: string)=>void;
    label: string;
    discover?: boolean;
}

const AlbumSearch = ({discover, albums, query, setQuery, onAdd, label}: Props) => {

    return(
        <>
            <label className="flex items-center justify-center gap-3 mb-4 text-sm text-text2 main-font ">
                {label &&<p className="min-w-32">{label}</p>}
                <Input 
                    className="w-full p-1 text-text2 rounded-md" sx={{ input: { color: 'white' } }}  
                    onChange={(e) => setQuery(e.target.value)} 
                    type="search" 
                    value={query} 
                    placeholder="Search"/>
            </label>
            {!discover && onAdd && query && albums.length > 0 && (

                <div className="relative">
                    <div
                        className="absolute z-10 w-full max-h-60 overflow-y-auto bg-text1 rounded-md border border-text2 shadow-lg"
                        style={{ top: "calc(100%)" }}
                    >
                        {albums.slice(0, 10).map((album, i) => (
                            <div
                                key={i}
                                onClick={() => onAdd(album.id)}
                                className="p-2 flex gap-5 items-center text-text2 cursor-pointer hover:bg-bg4 transition-colors"
                            >
                                <img src={album.image[1]["#text"]} />
                                <div className="text-left"> {album.name} - {album.artist} </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
export default AlbumSearch;

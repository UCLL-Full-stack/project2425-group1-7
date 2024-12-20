import { Album, AlbumResponse } from "@/types/index";

const sanitizeUrl = (query: string): string => {
    return query.replace('#','%23');
};

const searchAlbums = async (query: string): Promise<Album[]> => {
    query = sanitizeUrl(query);
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}&format=json`);
    if(!response.ok){
        return await response.json();
    }
    if(!response.ok) throw new Error("Couldn't retrieve Albums");

    const albumResponse: AlbumResponse = await response.json();
    const albums = albumResponse.results.albummatches.album;
    albums.forEach(album=>album.id=`${album.name}_${album.artist}`);
    return albums.filter(a=>!!a.image);
}

const fetchAlbum = async (title: string, artist: string): Promise<Album> => {
    title = sanitizeUrl(title);
    artist = sanitizeUrl(artist);
    console.log(title+" "+artist);
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}&artist=${artist}&album=${title}&format=json `);
    if(!response.ok){
        return await response.json();
    }
    if(!response.ok) throw new Error("Couldn't retrieve Albums");

    const album: Album = (await response.json()).album;
    album.id = `${title}_${artist}`;
    return album;
}

const getAlbumsByFrequency = (albums: string[]): string[] => {
    const frequencyMap: Record<string, number> = {};
    albums.forEach(item=>{
        frequencyMap[item] = (frequencyMap[item] || 0) + 1;
    });

    const sorted = Object.keys(frequencyMap)
                    .sort((a,b) => frequencyMap[b] - frequencyMap[a])
    return sorted;
};


export default {
    searchAlbums,
    fetchAlbum,
    getAlbumsByFrequency
}

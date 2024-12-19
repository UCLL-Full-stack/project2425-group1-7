import { Album } from "@/types/index";

type Props= {
  album: Album;
  onReview: ()=>void;
};

const AlbumOverview = ({ album, onReview }: Props) => {
    const albumImage = album.image.find(img => img.size === "large")?.["#text"] ||  `https://fakeimg.pl/600x400?text=${album.name}`;
    let description: string = album.wiki?.content ?? album.wiki?.summary ?? '';
    description = description.split('<')[0];

    const words = description.split(' ') || [];
    if (words?.length > 100) {
        description =  words?.slice(0, 100).join(' ') + '...';
    }

    return (
      <div className="max-w-xl bg-text1 shadow-md rounded-lg p-6">
          <div className="text-center">
              <img
                  src={albumImage}
                  alt={`${album.name} cover`}
                  className="w-48 h-48 mx-auto object-cover rounded-md"
              />
              <h2 className="text-xl main-font text-text2 mt-4">{album.name}</h2>
              <p className="text-md text-text2 main-thin">By {album.artist}</p>
          </div>

          <div className="mt-5">
                  <p className="text-md main-font text-bg2 ">LastFm Playcount: {album.playcount}</p>
              {description.length > 0? (
                  <p className="text-md text-text2 mt-2 ">{description}</p>
              ) : (
                  <p className="text-md text-text2 italic">No description available.</p>
              )}
          </div>
          <div className="flex justify-center mt-5">
                    <button 
                        onClick={onReview}
                        className="rounded-lg main-font w-2/4 px-3 py-2 text-sm text-text1 hover:bg-bg1 hover:text-text2 bg-text2 transition-colors duration-100"
                    >
                        Review
                    </button>
          </div>
      </div>
  );
};

export default AlbumOverview;

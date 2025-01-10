import { useState, useEffect } from "react";
import { fetchArtworks } from "../utils/wellcomeCollectionApi";
import { fetchArtworksFromChicago } from "../utils/chicagoArtInstituteApi";

interface Artwork1 {
  id: string;
  aspectRatio: number;
  averageColor: string;
  thumbnail: {
    url: string;
    credit: string;
  };
  source: {
    id: string;
    title: string;
    type: string;
  };
}

interface Artwork2 {
  image_id: string;
  title: string;
  artist: string;
}
export const MultiApiFetch = () => {
  const [allWellcomeArtworks, setAllWellcomeArtworks] = useState<Artwork1[]>(
    []
  );
  const [allChicagoArtworks, setAllChicagoArtworks] = useState<Artwork2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetchArtworks()
        .then((AllWellcomeArtworks) => {
          setAllWellcomeArtworks(AllWellcomeArtworks);
        })
        .catch((error) =>
          console.error("Error fetching Wellcome artworks:", error)
        ),

      fetchArtworksFromChicago()
        .then((AllChicagoArtworks) => {
          const mappedChicagoArtworks = AllChicagoArtworks.map(
            (artwork: any) => ({
              image_id: artwork.image_id,
              title: artwork.title || "Unknown Title",
              artist: artwork.artist_title || "Unknown Artist",
            })
          );
          setAllChicagoArtworks(mappedChicagoArtworks);
        })
        .catch((error) =>
          console.error("Error fetching Chicago artworks:", error)
        ),
    ]);
    setIsLoading(false);
  }, []);
  const constructImageUrl = (infoUrl: string, size = "300, 300") => {
    return infoUrl.replace("/info.json", `/full/${size}/0/default.jpg`);
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div>
      <div className="wellcome-artworks">
        {allWellcomeArtworks.map((artwork) => (
          <div key={artwork.id} className="artwork-item">
            <img
              src={constructImageUrl(artwork.thumbnail.url)}
              alt={artwork.source.title}
              style={{ maxWidth: "300px", height: "300px", margin: "10px" }}
            />
            <h4>{artwork.source.title}</h4>
            <p>Credit: {artwork.thumbnail.credit}</p>
          </div>
        ))}
      </div>

      <div className="chicago-artworks">
        {allChicagoArtworks.map((artwork, index) => (
          <div key={index} className="artwork-item">
            {artwork.image_id ? (
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title}
                style={{ maxWidth: "300px", height: "300px", margin: "10px" }}
              />
            ) : (
              <p>No image available</p>
            )}
            <h4>{artwork.title}</h4>
            <p>Artist: {artwork.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiApiFetch;

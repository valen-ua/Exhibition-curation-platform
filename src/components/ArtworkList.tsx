import { useState, useEffect } from "react";
import { fetchArtworks } from "../utils/wellcomeCollectionApi";
import { fetchArtworksFromChicago } from "../utils/chicagoArtInstituteApi";

interface WellcomeArtwork {
  thumbnail: {
    url: string;
    credit: string;
  };
  id: string;
  source: {
    title: string;
  };
}

interface ChicagoArtwork {
  image_id: string;
  title: string;
  artist: string;
}
export const MultiApiFetch = () => {
  const [allWellcomeArtworks, setAllWellcomeArtworks] = useState<
    WellcomeArtwork[]
  >([]);
  const [allChicagoArtworks, setAllChicagoArtworks] = useState<
    ChicagoArtwork[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetchArtworks()
        .then((allWellcomeArtworks) => {
          setAllWellcomeArtworks(
            allWellcomeArtworks.map((artwork: WellcomeArtwork) => ({
              id: artwork.id,
              thumbnail: artwork.thumbnail,
              source: artwork.source,
            }))
          );
        })
        .catch((error) =>
          console.error("Error fetching Wellcome Collection artworks:", error)
        ),

      fetchArtworksFromChicago()
        .then((allChicagoArtworks) =>
          setAllChicagoArtworks(
            allChicagoArtworks.map((artwork: any) => ({
              image_id: artwork.image_id,
              title: artwork.title || "Unknown Title",
              artist: artwork.artist_title || "Unknown Artist",
            }))
          )
        )
        .catch((error) =>
          console.error("Error fetching Chicago Art Institute artworks:", error)
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
      <div className="container">
        <div className="artworks-wrapper">
          <div className="grid">
            <div className="wellcome-artworks">
              {allWellcomeArtworks.map((artwork) => (
                <div key={artwork.id} className="artwork-item">
                  <img
                    src={constructImageUrl(artwork.thumbnail.url)}
                    alt={artwork.source.title}
                    style={{
                      maxWidth: "300px",
                      height: "300px",
                      margin: "10px",
                    }}
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
                      style={{
                        maxWidth: "300px",
                        height: "300px",
                        margin: "10px",
                      }}
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
        </div>
      </div>
    </div>
  );
};

export default MultiApiFetch;

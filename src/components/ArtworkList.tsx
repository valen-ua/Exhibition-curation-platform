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
  const [currentPage, setCurrentPage] = useState(1);
  const [allWellcomeArtworks, setAllWellcomeArtworks] = useState<
    WellcomeArtwork[]
  >([]);
  const [allChicagoArtworks, setAllChicagoArtworks] = useState<
    ChicagoArtwork[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadMoreArtworks();
  }, []);
  const loadMoreArtworks = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    const nextPage = currentPage + 1;

    Promise.all([
      fetchArtworks(nextPage, 10).then((wellcomeResults) =>
        
        wellcomeResults.map((artwork: WellcomeArtwork) => ({
            
          id: artwork.id,
          thumbnail: artwork.thumbnail,
          source: artwork.source,
        }))
      ),
      fetchArtworksFromChicago(nextPage, 10).then((chicagoResults) =>
        chicagoResults.map((artwork: any) => ({
          image_id: artwork.image_id,
          title: artwork.title || "Unknown Title",
          artist: artwork.artist_title || "Unknown Artist",
        }))
      ),
    ])
      .then(([wellcomeResults, chicagoResults]) => {
        setAllWellcomeArtworks((prev) => [...prev, ...wellcomeResults]);
        setAllChicagoArtworks((prev) => [...prev, ...chicagoResults]);
        setCurrentPage(nextPage);
      })
      .catch((error) => console.error("Error fetching artworks:", error))
      .finally(() => setIsLoadingMore(false));
  };
  const constructImageUrl = (infoUrl: string, size = "300, 300") => {
    return infoUrl.replace("/info.json", `/full/${size}/0/default.jpg`);
  };

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
                  <h5>{artwork.source.title}</h5>
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
                  <h5>{artwork.title}</h5>
                  <p>Artist: {artwork.artist}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={loadMoreArtworks}
            disabled={isLoadingMore}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: isLoadingMore ? "not-allowed" : "pointer",
            }}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiApiFetch;

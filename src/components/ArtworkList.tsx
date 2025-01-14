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
  const [allArtworks, setAllArtworks] = useState<(WellcomeArtwork | ChicagoArtwork)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadMoreArtworks();
  }, []);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
        const combined = shuffleArray([...allArtworks, ...wellcomeResults, ...chicagoResults]);
        setAllArtworks(combined);
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
            {allArtworks.map((artwork: any, index) => (
              <div key={index} className="artwork-item">
                {artwork.thumbnail ? (
                  <img
                    src={constructImageUrl(artwork.thumbnail.url)}
                    alt={artwork.source?.title || "Unknown Source"}
                    style={{
                      maxWidth: "300px",
                      height: "300px",
                      margin: "10px",
                    }}
                  />
                ) : artwork.image_id ? (
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
                <h5>{artwork.source?.title || artwork.title || "Untitled"}</h5>
                <p>{artwork.thumbnail?.credit || artwork.artist || "Unknown"}</p>
              </div>
            ))}
          </div>
          <button
            className="load-more-button"
            onClick={loadMoreArtworks}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiApiFetch;

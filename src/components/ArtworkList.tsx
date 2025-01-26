import { useState, useEffect } from "react";
import { fetchArtworks } from "../utils/wellcomeCollectionApi";
import { fetchArtworksFromChicago } from "../utils/chicagoArtInstituteApi";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";

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
  id: number;
  image_id: string;
  title: string;
  artist: string;
}

export const MultiApiFetch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allArtworks, setAllArtworks] = useState<(WellcomeArtwork | ChicagoArtwork)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(""); 
  

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchInput)}`);
    }
  };

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
          id: artwork.id,
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
        <div style={{ textAlign: "center"}}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search artworks..."
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            borderRadius: "5%",
            border: "2px solid #fed6e9",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#fed6e9",
            border: "2px solid transparent",
            borderRadius: "10%",
            color: "#000",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
          <div className="grid">
            {allArtworks.map((artwork: any, index) => (
              <ArtworkCard 
              key={index}
              id={artwork.id || artwork.image_id}
              title={artwork.source?.title || artwork.title || "Untitled"}
              imageUrl={
                artwork.thumbnail
                  ? constructImageUrl(artwork.thumbnail.url)
                  : `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
              }
              artist={artwork.thumbnail?.credit || artwork.artist}
                       />
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

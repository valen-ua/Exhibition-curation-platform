import { useState, useEffect } from "react";
import { fetchArtworks } from "../utils/wellcomeCollectionApi";
import { fetchArtworksFromChicago } from "../utils/chicagoArtInstituteApi";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import Filters from "./Filters";
import { applyFiltersToArtworks } from "../utils/filterFunction";

export interface UnifiedArtwork {
  id: string;
  title: string;
  artist?: string;
  imageUrl: string;
  source: "Wellcome" | "Chicago";
  isPublicDomain: boolean;
}

export const MultiApiFetch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allArtworks, setAllArtworks] = useState<UnifiedArtwork[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [publicDomainFilter, setPublicDomainFilter] = useState<boolean>(false);

  const filteredArtworks = applyFiltersToArtworks(
    allArtworks,
    sourceFilter,
    publicDomainFilter
  );

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
        wellcomeResults.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.source?.title || "Untitled",
          artist: artwork.thumbnail?.credit || "Unknown Artist",
          imageUrl: constructImageUrl(artwork.thumbnail.url),
          source: "Wellcome",
          isPublicDomain: artwork.thumbnail.license.id === "cc0",
        }))
      ),
      fetchArtworksFromChicago(nextPage, 10).then((chicagoResults) =>
        chicagoResults.map((artwork: any) => ({
          id: artwork.id.toString(),
          title: artwork.title || "Unknown Title",
          artist: artwork.artist_title || "Unknown Artist",
          imageUrl: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
          source: "Chicago",
          isPublicDomain: artwork.is_public_domain,
        }))
      ),
    ])
      .then(([wellcomeResults, chicagoResults]) => {
        const combined = shuffleArray([
          ...allArtworks,
          ...wellcomeResults,
          ...chicagoResults,
        ]);
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
      <Filters
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        publicDomainFilter={publicDomainFilter}
        setPublicDomainFilter={setPublicDomainFilter}
      />
      <div className="container">
        <div className="artworks-wrapper">
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search artworks..."
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
          <div className="grid">
            {filteredArtworks.length > 0 ? (
              filteredArtworks.map((artwork: UnifiedArtwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))
            ) : (
              <p>No artworks match the selected filters.</p>
            )}
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

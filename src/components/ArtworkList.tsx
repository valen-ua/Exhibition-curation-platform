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
  const [totalPages, setTotalPages] = useState(1);
  const [allArtworks, setAllArtworks] = useState<UnifiedArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [filtersUsed, setFiltersUsed] = useState(false);
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
    fetchArtworksByPage(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const fetchArtworksByPage = (page: number) => {
    if (isLoading) return;

    setIsLoading(true);

    Promise.all([
      fetchArtworks(page, 10).then((wellcomeResults) =>
        wellcomeResults.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.source?.title || "Untitled",
          artist: artwork.thumbnail?.credit || "Unknown Artist",
          imageUrl: constructImageUrl(artwork.thumbnail.url),
          source: "Wellcome",
          isPublicDomain: artwork.thumbnail.license.id === "cc0",
        }))
      ),
      fetchArtworksFromChicago(page, 10).then((chicagoResults) =>
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
        const combined = shuffleArray([...wellcomeResults, ...chicagoResults]);
        setAllArtworks(combined);
        setTotalPages(200);

        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error fetching artworks:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const constructImageUrl = (infoUrl: string, size = "300, 300") => {
    return infoUrl.replace("/info.json", `/full/${size}/0/default.jpg`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  };

  return (
    <div role="region" aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="visually-hidden">
        Artwork Filters
      </h2>
      <Filters
        sourceFilter={sourceFilter}
        setSourceFilter={(value) => {
          setSourceFilter(value);
          setFiltersUsed(true);
        }}
        publicDomainFilter={publicDomainFilter}
        setPublicDomainFilter={(value) => {
          setPublicDomainFilter(value);
          setFiltersUsed(true);
        }}
      />
      <div className="container">
        <div className="artworks-wrapper">
          <div className="search-container">
            <label htmlFor="search-input" className="visually-hidden">
              Search for artworks
            </label>
            <input
              id="search-input"
              className="search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search artworks..."
            />
            <button
              onClick={handleSearch}
              className="search-button"
              aria-label="Search artworks"
            >
              Search
            </button>
          </div>
          <div className="grid" role="list">
            {filteredArtworks.length > 0 ? (
              filteredArtworks.map((artwork: UnifiedArtwork) => (
                <div role="listitem" key={artwork.id}>
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                </div>
              ))
            ) : filtersUsed ? (
              <p className="no-results-message" role="alert">
                No artworks match the selected filters.
              </p>
            ) : null}
          </div>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiApiFetch;

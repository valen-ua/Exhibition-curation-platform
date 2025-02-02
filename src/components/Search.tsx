import { useState, useEffect } from "react";
import { wellcomeSearchResults } from "../utils/wellcomeCollectionApi";
import { chicagoSearchResults } from "../utils/chicagoArtInstituteApi";
import { UnifiedArtwork } from "./ArtworkList";
import ArtworkCard from "./ArtworkCard";
import { applyFiltersToArtworks } from "../utils/filterFunction";
import Filters from "./Filters";

export const SearchApiFetch = () => {
  const [searchResults, setSearchResults] = useState<UnifiedArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [publicDomainFilter, setPublicDomainFilter] = useState<boolean>(false);

  const filteredResults = applyFiltersToArtworks(
    searchResults,
    sourceFilter,
    publicDomainFilter
  );

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  useEffect(() => {
    if (!searchQuery) return;

    setIsLoading(true);
    Promise.all([
      wellcomeSearchResults(searchQuery).then((results) =>
        results.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.source?.title || "Untitled",
          artist: artwork.thumbnail?.credit || "Unknown Artist",
          imageUrl: constructWellcomeImageUrl(artwork.thumbnail.url),
          source: "Wellcome",
          isPublicDomain: artwork.thumbnail.license.id === "cc0",
        }))
      ),
      chicagoSearchResults(searchQuery).then((results) =>
        Promise.all(
          results.map((artwork: any) =>
            fetch(artwork.api_link)
              .then((response) => response.json())
              .then((artworkDetails) => ({
                id: artwork.id.toString(),
                title: artwork.title || "Unknown Title",
                artist: artworkDetails.data.artist_title || "Unknown Artist",
                imageUrl: constructChicagoImageUrl(
                  artworkDetails.data.image_id
                ),
                source: "Chicago",
                isPublicDomain: artworkDetails.data.is_public_domain,
              }))
          )
        )
      ),
    ])
      .then(([wellcomeResults, chicagoResults]) => {
        const combinedResults = shuffleArray([
          ...wellcomeResults,
          ...chicagoResults,
        ]);
        setSearchResults(combinedResults);
      })
      .catch((error) => console.error("Error fetching search results:", error))
      .finally(() => setIsLoading(false));
  }, [searchQuery]);

  const constructWellcomeImageUrl = (url: string, size = "300,300") => {
    return url.replace("/info.json", `/full/${size}/0/default.jpg`);
  };
  const constructChicagoImageUrl = (image_id: string) => {
    return `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
  };

  return (
    <div>
      <Filters
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        publicDomainFilter={publicDomainFilter}
        setPublicDomainFilter={setPublicDomainFilter}
      />
      <h4 className="search-results-header">
        Search results for <i>{searchQuery}</i>
      </h4>
      <div className="container">
        <div className="artworks-wrapper">
          {isLoading ? (
            <p className="loading-message">Loading...</p>
          ) : filteredResults.length > 0 ? (
            <div className="grid">
              {filteredResults.map((artwork: UnifiedArtwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <p className="no-results-message">
              No results found. Please try a different query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

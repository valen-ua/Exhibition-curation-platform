import { useState, useEffect } from "react";
import { wellcomeSearchResults } from "../utils/wellcomeCollectionApi";
import { chicagoSearchResults } from "../utils/chicagoArtInstituteApi";

interface SearchWellcomeArtwork {
  thumbnail: {
    url: string;
    credit: string;
  };
  id: string;
  source: {
    title: string;
  };
}

interface SearchChicagoArtwork {
  image_id: string;
  title: string;
  artist: string;
  imageUrl: string;
  api_link: string;
}

export const SearchApiFetch = () => {
  const [searchResults, setSearchResults] = useState<
    (SearchWellcomeArtwork | SearchChicagoArtwork)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (!searchQuery) return;

    setIsLoading(true);
    Promise.all([
      wellcomeSearchResults(searchQuery).then((results) =>
        results.map((artwork: SearchWellcomeArtwork) => ({
          id: artwork.id,
          thumbnail: artwork.thumbnail || { url: "", credit: "Unknown" },
          source: artwork.source || { title: "Untitled" },
        }))
      ),
      chicagoSearchResults(searchQuery).then((results) =>
        Promise.all(
          results.map((artwork: SearchChicagoArtwork) =>
            fetch(artwork.api_link)
              .then((response) => response.json())
              .then((artworkDetails) => ({
                image_id: artworkDetails.data.image_id || "No Image Available",
                title: artwork.title || "Unknown Title",
                artist: artworkDetails.data.artist_display || "Unknown Artist",
              }))
              .catch((error) => {
                console.error(`Failed to fetch artwork details for ${artwork.title}:`, error);
                return null; 
              })
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

  const handleSearch = () => {
    if (searchInput.trim() === "") return;
    setSearchQuery(searchInput);
  };

  return (
    <div>
      <div style={{ textAlign: "center", margin: "20px" }}>
        <input className="search-bar"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search artworks..."
        />
        <button className="search-button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="container">
        <div className="artworks-wrapper">
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : searchResults.length > 0 ? (
            <div className="grid">
              {searchResults.map((artwork, index) => (
                <div className="artwork-item"
                  key={index}
                >
                  {"thumbnail" in artwork ? (
                    <>
                      <img
                        src={constructWellcomeImageUrl(artwork.thumbnail.url)}
                        alt={artwork.source?.title || "Unknown Source"}
                      />
                      <h5>{artwork.source?.title || "Untitled"}</h5>
                      <p>{artwork.thumbnail.credit || "Unknown Artist"}</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={constructChicagoImageUrl(artwork.image_id)}
                        alt={artwork.title || "Untitled"}
                      />
                      <h5>{artwork.title || "Untitled"}</h5>
                      <p>{artwork.artist || "Unknown Artist"}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>
              No results found. Try a different query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { wellcomeSearchResults } from "../utils/wellcomeCollectionApi";
import { chicagoSearchResults } from "../utils/chicagoArtInstituteApi";
import { useLocation } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";

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
  id: string;
}

export const SearchApiFetch = () => {
  const [searchResults, setSearchResults] = useState<
    (SearchWellcomeArtwork | SearchChicagoArtwork)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const query = queryParams.get("query")

    if(query) {
      setSearchQuery(query)
    }
  }, [location])

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
                id: artwork.id
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
        console.log(combinedResults)
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
      <div className="container">
        <div className="artworks-wrapper">
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : searchResults.length > 0 ? (
            <div className="grid">
              {searchResults.map((artwork, index) => (
                 <ArtworkCard 
                 key={index}
      id={"thumbnail" in artwork ? artwork.id : artwork.id}
      title={"thumbnail" in artwork ? artwork.source?.title : artwork.title}
      imageUrl={
        "thumbnail" in artwork
          ? constructWellcomeImageUrl(artwork.thumbnail.url)
          : constructChicagoImageUrl(artwork.image_id)
      }
      artist={"thumbnail" in artwork ? artwork.thumbnail.credit : artwork.artist}
/>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>
              No results found. Please try a different query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

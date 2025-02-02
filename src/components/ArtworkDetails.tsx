import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWellcomeIndividualArtwork } from "../utils/wellcomeCollectionApi";
import { fetchChicagoIndividualArtwork } from "../utils/chicagoArtInstituteApi";
import { UnifiedArtwork } from "./ArtworkList";
import { useExhibition } from "./ExhibitionContext";

const constructImageUrl = (infoUrl: string, size = "300, 300") => {
  return infoUrl.replace("/info.json", `/full/${size}/0/default.jpg`);
};

export const ArtworkDetail = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  const {
    exhibitions = [],
    addToExhibition,
    removeFromExhibition,
  } = useExhibition();
  const [individualArtwork, setIndividualArtwork] =
    useState<UnifiedArtwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string>("");

  useEffect(() => {
    if (!artworkId) {
      return;
    }
    const isWellcome = isNaN(Number(artworkId));

    const fetchIndividualArtwork = () => {
      const fetchFunction = isWellcome
        ? fetchWellcomeIndividualArtwork
        : fetchChicagoIndividualArtwork;

      fetchFunction(artworkId)
        .then((data) => {
          if (isWellcome) {
            const wellcomeArtwork: UnifiedArtwork = {
              id: data.id,
              title: data.source.title || "Untitled",
              artist: data.thumbnail?.credit || "Unknown Artist",
              imageUrl: constructImageUrl(data.thumbnail.url),
              source: "Wellcome",
              isPublicDomain: data.thumbnail.license.id === "cc0",
            };
            setIndividualArtwork(wellcomeArtwork);
          } else {
            const chicagoArtwork: UnifiedArtwork = {
              id: data.data.id.toString(),
              title: data.data.title || "Unknown Title",
              artist: data.data.artist_title || "Unknown Artist",
              imageUrl: `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`,
              source: "Chicago",
              isPublicDomain: data.data.is_public_domain,
            };
            setIndividualArtwork(chicagoArtwork);
          }
        })
        .catch(() => {
          setError("Failed to fetch artwork details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchIndividualArtwork();
  }, [artworkId]);

  const isInExhibition = !!(
    individualArtwork &&
    Array.isArray(exhibitions) &&
    exhibitions.some(
      (exhibition) =>
        Array.isArray(exhibition?.artworks) &&
        exhibition.artworks.some(
          (artwork) => artwork?.id === individualArtwork.id
        )
    )
  );

  const handleAddToExhibition = () => {
    if (selectedExhibitionId && individualArtwork) {
      addToExhibition(individualArtwork, selectedExhibitionId);
      alert("Artwork added to exhibition");
    } else {
      alert(
        "Please select an exhibition or go to Exhibitions page to create one"
      );
    }
  };

  const handleRemoveFromExhibition = (exhibitionId: string) => {
    if (individualArtwork) {
      removeFromExhibition(individualArtwork.id, exhibitionId);
      alert("Artwork removed from exhibition");
    }
  };

  if (isLoading) {
    return <p className="loading-message">Loading artwork details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!individualArtwork) {
    return <p className="no-results-message">No artwork details available.</p>;
  }

  return (
    <div className="individual-artwork-container">
      <h1>{individualArtwork.title}</h1>
      {individualArtwork.artist && <p> {individualArtwork.artist}</p>}
      <div className="individual-image-container">
        {
          <img
            src={individualArtwork.imageUrl}
            alt={individualArtwork.title || "Artwork Image"}
            className="artwork-image"
          />
        }
      </div>
      <div className="exhibition-box">
        {!isInExhibition && (
          <>
            <select
              className="select-exhibition-dropdown"
              value={selectedExhibitionId}
              onChange={(e) => setSelectedExhibitionId(e.target.value)}
            >
              <option value="">Select an Exhibition</option>
              {exhibitions.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id}>
                  {exhibition.name}
                </option>
              ))}
            </select>
            <button
              className="add-to-exhibition-button"
              onClick={handleAddToExhibition}
            >
              Add to Exhibition
            </button>
          </>
        )}

        {isInExhibition && (
          <div>
            <p>This artwork is part of the following exhibition:</p>
            {exhibitions
              .filter(
                (exhibition) =>
                  Array.isArray(exhibition?.artworks) &&
                  exhibition.artworks.some(
                    (artwork) => artwork?.id === individualArtwork?.id
                  )
              )
              .map((exhibition) => (
                <div key={exhibition.id} className="exhibition-item">
                  <span>{exhibition.name}</span>
                  <button
                    className="remove-from-exhibition-button"
                    onClick={() => handleRemoveFromExhibition(exhibition.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetail;

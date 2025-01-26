import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWellcomeIndividualArtwork } from "../utils/wellcomeCollectionApi"
import { fetchChicagoIndividualArtwork } from "../utils/chicagoArtInstituteApi";


interface WellcomeIndividualArtwork {
  thumbnail: {
    url: string;
    credit: string;
  };
  id: string;
  source: {
    title: string;
  };
}

interface ChicagoIndividualArtwork {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
}
const constructImageUrl = (infoUrl: string, size = "300, 300") => {
  return infoUrl.replace("/info.json", `/full/${size}/0/default.jpg`);
};

export const ArtworkDetail = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  console.log("id in use params", artworkId)
  const [individualArtwork, setIndividualArtwork] = useState<WellcomeIndividualArtwork | ChicagoIndividualArtwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
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
            const wellcomeArtwork: WellcomeIndividualArtwork = {
              id: data.id,
              thumbnail:  {
                url: constructImageUrl(data.thumbnail.url),
                credit: data.thumbnail.credit
              },
              source: data.source,
            };
            setIndividualArtwork(wellcomeArtwork);
          } else {
            const chicagoArtwork: ChicagoIndividualArtwork = {
              id: data.data.id,
              title: data.data.title || "Unknown Title",
              artist: data.data.artist_title || "Unknown Artist",
              imageUrl: `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`,
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

  if (isLoading) {
    return <p>Loading artwork details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!individualArtwork) {
    return <p>No artwork details available.</p>;
  }

  return (
    <div className="individual-artwork-container">
      <h1>
        {"source" in individualArtwork
          ? individualArtwork.source.title
          : individualArtwork.title}
      </h1>

      {"artist" in individualArtwork && <p>Artist: {individualArtwork.artist}</p>}
      <div className="individual-image-container">
        {"thumbnail" in individualArtwork && (
        <img
          src={individualArtwork.thumbnail.url}
          alt={individualArtwork.source.title}
          className="artwork-image"
        />
      )}
      {"imageUrl" in individualArtwork && (
        <img
          src={individualArtwork.imageUrl}
          alt={individualArtwork.title}
          className="artwork-image"
        />
      )}
    </div>
    </div>
  );
};

export default ArtworkDetail;
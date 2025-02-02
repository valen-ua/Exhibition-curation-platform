import React from "react";
import ArtworkCard from "./ArtworkCard";
import { useExhibition } from "./ExhibitionContext";
import { useParams } from "react-router-dom";

const ExhibitionDetail: React.FC = () => {
  const { exhibitionId } = useParams<{ exhibitionId: string }>();
  const { exhibitions } = useExhibition();

  const exhibition = exhibitions.find((ex) => ex.id === exhibitionId);

  if (!exhibition) {
    return <p>Exhibition not found</p>;
  }

  return (
    <div>
      <div className="exhibition-details">
        <h2>{exhibition.name}</h2>
        <div className="artworks">
          {exhibition.artworks.length === 0 ? (
            <p className="no-artworks-message">
              No artworks added to this exhibition yet
            </p>
          ) : (
            exhibition.artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetail;

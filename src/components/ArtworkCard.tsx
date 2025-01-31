import React from "react";
import { useNavigate } from "react-router-dom";

import { UnifiedArtwork } from "./ArtworkList";

interface ArtworkCardProps {
  artwork: UnifiedArtwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <div className="artwork-card" onClick={handleClick}>
      <img
        className="artwork-card-image"
        src={artwork.imageUrl}
        alt={artwork.title || "Artwork Image"}
      />
      <div className="artwork-card-text">
        <h5>{artwork.title || "Untitled"}</h5>
        <p>{artwork.artist || "Unknown Artist"}</p>
      </div>
    </div>
  );
};

export default ArtworkCard;

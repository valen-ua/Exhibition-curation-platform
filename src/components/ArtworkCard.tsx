import React from "react";
import { useNavigate } from "react-router-dom";

interface ArtworkCardProps {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ id, title, imageUrl, artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artwork/${id}`);
  };

  return (
    <div
      className="artwork-card"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        margin: "10px",
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          maxWidth: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <h4>{title || "Untitled"}</h4>
      <p>{artist || "Unknown Artist"}</p>
      
    </div>
  );
};

export default ArtworkCard;
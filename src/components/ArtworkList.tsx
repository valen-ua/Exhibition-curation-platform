import { useState, useEffect } from "react";
import { fetchArtworks } from "../utils/wellcomeCollectionApi";

interface Artwork {
    id: string;
    title: string;
    workType: {
      label: string;
    };
  }
export const AllWellcomeArtworks = () => {
  const [allWellcomeArtworks, setAllWellcomeArtworks] = useState <Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchArtworks().then((AllWellcomeArtworks) => {
      setAllWellcomeArtworks(AllWellcomeArtworks);
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div>
      {allWellcomeArtworks.map((artwork, i) => (
        <div key={artwork.id || i} className="artwork-item">
          <h4>{artwork.title}</h4>
          <h5>{artwork.workType.label}</h5>
        </div>
      ))}
    </div>
  );
};
export default AllWellcomeArtworks;

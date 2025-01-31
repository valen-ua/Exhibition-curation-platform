import React, { createContext, useContext, useState, useEffect } from "react";
import { UnifiedArtwork } from "../components/ArtworkList";

interface Exhibition {
  id: string;
  name: string;
  artworks: UnifiedArtwork[];
}

interface ExhibitionContextType {
  exhibitions: Exhibition[];
  addToExhibition: (artwork: UnifiedArtwork, exhibitionId: string) => void;
  removeFromExhibition: (artworkId: string, exhibitionId: string) => void;
  createNewExhibition: (name: string) => void;
}

const ExhibitionContext = createContext<ExhibitionContextType | undefined>(
  undefined
);

export const useExhibition = () => {
  const context = useContext(ExhibitionContext);
  if (!context) {
    throw new Error("useExhibition must be used within an ExhibitionProvider");
  }
  return context;
};

export const ExhibitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => {
    const savedExhibitions = localStorage.getItem("exhibitions");
    return savedExhibitions ? JSON.parse(savedExhibitions) : [];
  });

  useEffect(() => {
    localStorage.setItem("exhibitions", JSON.stringify(exhibitions));
  }, [exhibitions]);

  const addToExhibition = (artwork: UnifiedArtwork, exhibitionId: string) => {
    setExhibitions((prevExhibitions) =>
      prevExhibitions.map((exhibition) =>
        exhibition.id === exhibitionId
          ? { ...exhibition, artworks: [...exhibition.artworks, artwork] }
          : exhibition
      )
    );
  };

  const removeFromExhibition = (artworkId: string, exhibitionId: string) => {
    setExhibitions((prevExhibitions) =>
      prevExhibitions.map((exhibition) =>
        exhibition.id === exhibitionId
          ? {
              ...exhibition,
              artworks: exhibition.artworks.filter(
                (artwork) => artwork.id !== artworkId
              ),
            }
          : exhibition
      )
    );
  };

  const createNewExhibition = (name: string) => {
    const newExhibition: Exhibition = {
      id: Date.now().toString(),
      name,
      artworks: [],
    };
    setExhibitions((prevExhibitions) => [...prevExhibitions, newExhibition]);
  };

  return (
    <ExhibitionContext.Provider
      value={{
        exhibitions,
        addToExhibition,
        removeFromExhibition,
        createNewExhibition,
      }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
};

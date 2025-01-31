import { UnifiedArtwork } from "../components/ArtworkList";


export const applyFiltersToArtworks = (
  artworks: UnifiedArtwork[],
  sourceFilter: string,
  publicDomainFilter: boolean
) => {
  return artworks.filter((artwork) => {
    const matchesSource =
      sourceFilter === "all" || artwork.source === sourceFilter;

    const matchesPublicDomain =
    publicDomainFilter
    ? artwork.isPublicDomain
    : true;

    return matchesSource && matchesPublicDomain;
  });
};
export const applyFiltersToArtworks = (
  artworks: any[],
  sourceFilter: string,
  publicDomainFilter: boolean
) => {
  return artworks.filter((artwork) => {
    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "wellcome" && isNaN(Number(artwork.id))) ||
      (sourceFilter === "chicago" && !isNaN(Number(artwork.id)));

    const matchesPublicDomain =
      !publicDomainFilter || artwork.license?.id === "pdm" || artwork.is_public_domain;

    return matchesSource && matchesPublicDomain;
  });
};
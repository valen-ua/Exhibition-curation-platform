import React from "react";

interface FiltersProps {
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  publicDomainFilter: boolean;
  setPublicDomainFilter: (value: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({
  sourceFilter,
  setSourceFilter,
  publicDomainFilter,
  setPublicDomainFilter,
}) => {
  return (
    <fieldset className="filters-container" aria-labelledby="filter-legend">
      <legend id="filter-legend" className="visually-hidden">
        Filter artworks by source and availability
      </legend>
      <div className="filters-container">
        <div className="filter-header">
          <label htmlFor="source-filter">Filter by Source:</label>
          <select
            id="source-filter"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="source-dropdown"
            aria-describedby="source-filter-description"
          >
            <option value="all">All Sources</option>
            <option value="Wellcome">Wellcome Collection</option>
            <option value="Chicago">Chicago Art Institute</option>
          </select>
          <p id="source-filter-description" className="visually-hidden">
            Choose an artwork source from the dropdown menu.
          </p>
        </div>
        <div className="filter-checkbox">
          <label>Public Domain Only:</label>
          <input
            type="checkbox"
            id="public-domain-filter"
            checked={publicDomainFilter}
            onChange={(e) => setPublicDomainFilter(e.target.checked)}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default Filters;

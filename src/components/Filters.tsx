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
    <div className="filters-container">
      <div className="filter-header">
        <h3>Filter by source</h3>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="source-dropdown"
        >
          <option value="all">All Sources</option>
          <option value="wellcome">Wellcome Collection</option>
          <option value="chicago">Chicago Art Institute</option>
        </select>
      </div>
      <div className="filter-checkbox">
        <label>Public Domain Only:</label>
        <input
          type="checkbox"
          checked={publicDomainFilter}
          onChange={(e) => setPublicDomainFilter(e.target.checked)}
        />
      </div>
      {/* <div className="filter-buttons">
        <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
        <button className="clear-button" onClick={clearFilters}>Clear Filters</button>
      </div> */}
    </div>
  );
};

export default Filters;

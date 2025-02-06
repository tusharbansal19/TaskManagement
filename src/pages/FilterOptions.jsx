import React from "react";

const FilterOptions = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="filters">
      <select value={selectedFilter} onChange={(e) => onFilterChange(e.target.value)}>
        <option value="all">All Tasks</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>
  );
};

export default FilterOptions;

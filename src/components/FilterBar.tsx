import React from 'react';
import type { Category, Campus } from '../types/publication';


interface FilterBarProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  campuses: Campus[];
  selectedCampus: Campus;
  onSelectCampus: (campus: Campus) => void;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  campuses,
  selectedCampus,
  onSelectCampus,
  filteredCount
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-section">
        <span className="filter-label">Categorías:</span>
        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section secondary-filters">
        <span className="filter-label">Ubicación / Campus:</span>
        <div className="filter-chips">
          {campuses.map((camp) => (
            <button
              key={camp}
              className={`filter-chip campus-chip ${selectedCampus === camp ? 'active' : ''}`}
              onClick={() => onSelectCampus(camp)}
            >
              {camp}
            </button>
          ))}
        </div>
        <div className="results-counter">
          Mostrando <strong>{filteredCount}</strong> {filteredCount === 1 ? 'publicación' : 'publicaciones'}
        </div>
      </div>
    </div>
  );
};

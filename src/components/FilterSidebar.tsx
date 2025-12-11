
import React, { useState } from 'react';
import { Book, FilterState } from '../types/opds';
import { filterEngine } from '../services/filterEngine';
import { DATE_FILTER_OPTIONS } from '../utils/constants';
import { STORYWEAVER_LEVELS } from '../utils/storyWeaverCategories';

interface FilterSidebarProps {
  books: Book[];
  filters: FilterState;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: string) => void;
  onCategoryChange: (category: string) => void;
  onPublisherChange: (publisher: string) => void;
  onDateChange: (date: FilterState['dateFilter']) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  books,
  filters,
  onLanguageChange,
  onLevelChange,
  onCategoryChange,
  onPublisherChange,
  onDateChange,
  onReset,
  hasActiveFilters,
}) => {
  const options = filterEngine.getFilterOptions(books);
  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    levels: true,
    categories: true,
    publishers: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterCheckbox = ({ 
    label, 
    checked, 
    onChange,
    isCategory = false,
  }: { 
    label: string; 
    checked: boolean; 
    onChange: () => void;
    isCategory?: boolean;
  }) => (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
      />
      <span className={`ml-2 text-sm group-hover:text-blue-600 transition-colors ${
        isCategory ? 'text-gray-700' : 'text-gray-700'
      }`}>
        {label}
      </span>
    </label>
  );

  const FilterSection = ({
    title,
    icon,
    children,
    sectionKey,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
  }) => (
    <div className="mb-6 border-b border-gray-200 pb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full hover:text-blue-600 transition-colors mb-3"
      >
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        <span className={`text-gray-500 transition-transform ${
          expandedSections[sectionKey] ? 'rotate-180' : ''
        }`}>
          ▼
        </span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-full lg:w-72 bg-white p-4 border-r border-gray-200 h-auto lg:h-screen lg:overflow-y-auto shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🎯 Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors font-medium"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Language Filter */}
      <FilterSection title="Language" icon="🌍" sectionKey="languages">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {options.languages.slice(0, 12).map((lang) => (
            <FilterCheckbox
              key={lang}
              label={lang}
              checked={filters.languages.has(lang)}
              onChange={() => onLanguageChange(lang)}
            />
          ))}
        </div>
        {options.languages.length > 12 && (
          <p className="text-xs text-gray-500 mt-2">+{options.languages.length - 12} more</p>
        )}
      </FilterSection>

      {/* Level Filter */}
      {options.levels.length > 0 && (
        <FilterSection title="Reading Level" icon="📚" sectionKey="levels">
          <div className="space-y-2">
            {STORYWEAVER_LEVELS.map((level) => (
              <FilterCheckbox
                key={level}
                label={level}
                checked={filters.levels.has(level)}
                onChange={() => onLevelChange(level)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Category Filter - StoryWeaver Compatible */}
      {options.categories.length > 0 && (
        <FilterSection title="Categories" icon="🏷️" sectionKey="categories">
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {options.categories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={filters.categories.has(cat)}
                onChange={() => onCategoryChange(cat)}
                isCategory={true}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Publisher Filter */}
      {options.publishers.length > 0 && (
        <FilterSection title="Publishers" icon="🏢" sectionKey="publishers">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {options.publishers.slice(0, 10).map((pub) => (
              <FilterCheckbox
                key={pub}
                label={pub}
                checked={filters.publishers.has(pub)}
                onChange={() => onPublisherChange(pub)}
              />
            ))}
          </div>
          {options.publishers.length > 10 && (
            <p className="text-xs text-gray-500 mt-2">+{options.publishers.length - 10} more</p>
          )}
        </FilterSection>
      )}

      {/* Date Filter */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
          📅 Publication Date
        </h3>
        <select
          value={filters.dateFilter}
          onChange={(e) => onDateChange(e.target.value as FilterState['dateFilter'])}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors"
        >
          {DATE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">💡 Tip:</p>
        <p>Click multiple filters to narrow down your search!</p>
      </div>
    </aside>
  );
};
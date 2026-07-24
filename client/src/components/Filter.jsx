import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';

const priceRanges = [
  { label: 'Under ৳500', min: 0, max: 500 },
  { label: '৳500 - ৳1000', min: 500, max: 1000 },
  { label: '৳1000 - ৳2000', min: 1000, max: 2000 },
  { label: '৳2000 - ৳5000', min: 2000, max: 5000 },
  { label: 'Above ৳5000', min: 5000, max: Infinity },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const colors = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#F9FAFB' },
  { name: 'Pink', hex: '#CF15D4' },
  { name: 'Purple', hex: '#7B14F9' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Blue', hex: '#3B82F6' },
];

const ratings = [5, 4, 3, 2, 1];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between text-left font-semibold text-gray-800"
      >
        <span>{title}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#CF15D4]' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Filter = ({ onFilterChange }) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const togglePriceRange = (label) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAll = () => {
    setSelectedPriceRanges([]);
    setSelectedSizes([]);
    setSelectedColor(null);
    setSelectedRating(null);
  };

  const hasActiveFilters =
    selectedPriceRanges.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColor ||
    selectedRating;

  return (
    <aside className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-[#CF15D4] hover:underline"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
            Clear all
          </button>
        )}
      </div>

      {/* Price */}
      <FilterSection title="Price">
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(range.label)}
                onChange={() => togglePriceRange(range.label)}
                className="w-4 h-4 rounded border-gray-300 text-[#CF15D4] focus:ring-[#CF15D4]"
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors duration-150 ${
                selectedSizes.includes(size)
                  ? 'bg-gradient-to-r from-[#CF15D4] to-[#7B14F9] text-white border-transparent'
                  : 'border-gray-200 text-gray-600 hover:border-[#CF15D4] hover:text-[#CF15D4]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              title={color.name}
              onClick={() =>
                setSelectedColor((prev) => (prev === color.name ? null : color.name))
              }
              className={`w-8 h-8 rounded-full border-2 transition-transform duration-150 ${
                selectedColor === color.name
                  ? 'border-[#CF15D4] scale-110'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" defaultOpen={false}>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="w-4 h-4 border-gray-300 text-[#CF15D4] focus:ring-[#CF15D4]"
              />
              <span className="flex items-center gap-1">
                {'★'.repeat(rating)}
                <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
                <span className="ml-1 text-gray-500">& up</span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};

export default Filter;

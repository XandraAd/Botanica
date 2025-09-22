import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiFilter, FiChevronDown, FiChevronUp, FiDollarSign } from "react-icons/fi";
import { IoColorPaletteOutline, IoShirtOutline, IoPricetagOutline, IoGridOutline } from "react-icons/io5";

const FilterSidebar = ({
  data = [],
  onFilter = () => {},
  filtersConfig = {},
  isOpen = false,
  onToggle,
}) => {
  // Extract unique filter options
  const categories = useMemo(() => {
    if (!filtersConfig.showCategories) return [];
    return [...new Set(data.map((p) => p.category?.name || p.category).filter(Boolean))];
  }, [data, filtersConfig]);

  const sizes = useMemo(() => {
    if (!filtersConfig.showSizes) return [];
    return [...new Set(data.flatMap((p) => p.sizes || []).filter(Boolean))];
  }, [data, filtersConfig]);

  const colors = useMemo(() => {
    if (!filtersConfig.showColors) return [];
    return [...new Set(data.flatMap((p) => p.colors || []).filter(Boolean))];
  }, [data, filtersConfig]);

  const collections = useMemo(() => {
    if (!filtersConfig.showCollections) return [];
    return [...new Set(
      data.map((item) => {
        if (item.name) return item.name;
        if (item.collection?.name) return item.collection.name;
        if (item.collection) return item.collection;
        return null;
      }).filter(Boolean)
    )];
  }, [data, filtersConfig]);

  // Get price range from data
  const priceBounds = useMemo(() => {
    const prices = data.map(item => item.price).filter(price => typeof price === 'number');
    if (prices.length === 0) return [0, 1000];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [data]);

  // Selected states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [priceRange, setPriceRange] = useState(priceBounds);

  // Update price range when data changes
  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds]);

  // Expand/collapse sections
  const [activeSections, setActiveSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    collections: true,
    price: true,
  });

  // Apply filters
  useEffect(() => {
    let filtered = [...data];
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category?.name || item.category)
      );
    }
    
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((item) =>
        item.sizes?.some((s) => selectedSizes.includes(s))
      );
    }
    
    if (selectedColors.length > 0) {
      filtered = filtered.filter((item) =>
        item.colors?.some((c) => selectedColors.includes(c))
      );
    }
    
    if (selectedCollections.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCollections.includes(item.collection?.name || item.collection)
      );
    }
    
    if (priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }
    
    onFilter(filtered);
  }, [data, selectedCategories, selectedSizes, selectedColors, selectedCollections, priceRange, onFilter]);

  // Helper functions
  const toggleFilter = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCollections([]);
    setPriceRange(priceBounds);
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedCollections.length > 0 ||
    priceRange[0] !== priceBounds[0] ||
    priceRange[1] !== priceBounds[1];

  // Count active filters for badge
  const activeFilterCount = [
    selectedCategories.length,
    selectedSizes.length,
    selectedColors.length,
    selectedCollections.length,
    priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1] ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full md:h-auto w-80 md:w-72 bg-white shadow-xl md:shadow-sm md:rounded-lg
        transform transition-transform duration-300 z-40 md:z-0 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiFilter className="text-green-600 text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Filters</h3>
                <p className="text-xs text-gray-500">Refine your results</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-green-600 hover:text-green-800 font-medium px-2 py-1 hover:bg-green-50 rounded"
                >
                  Clear all
                </button>
              )}
              {onToggle && (
                <button 
                  onClick={onToggle} 
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <FiX className="text-gray-500 hover:text-gray-700" />
                </button>
              )}
            </div>
          </div>

          {/* Active filters badge */}
          {hasActiveFilters && (
            <div className="mb-4 p-2 bg-green-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-green-800">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={clearFilters}
                className="text-xs text-green-600 hover:text-green-800 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-5 pb-4 border-b border-gray-100">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-3 group"
                onClick={() => toggleSection("categories")}
              >
                <div className="flex items-center gap-2">
                  <IoGridOutline className="text-gray-400 group-hover:text-green-600" />
                  <span>Categories</span>
                </div>
                {activeSections.categories ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              {activeSections.categories && (
                <div className="space-y-2 max-h-48 overflow-y-auto pl-6">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center text-sm py-1.5 hover:bg-gray-50 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                        className="rounded text-green-600 focus:ring-green-500 mr-3"
                      />
                      <span className="capitalize text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-5 pb-4 border-b border-gray-100">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-3 group"
                onClick={() => toggleSection("sizes")}
              >
                <div className="flex items-center gap-2">
                  <IoShirtOutline className="text-gray-400 group-hover:text-green-600" />
                  <span>Sizes</span>
                </div>
                {activeSections.sizes ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              {activeSections.sizes && (
                <div className="flex flex-wrap gap-2 pl-6">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                      className={`px-3 py-1.5 border rounded-full text-sm transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-green-600 text-white border-green-600 shadow-sm"
                          : "border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-5 pb-4 border-b border-gray-100">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-3 group"
                onClick={() => toggleSection("colors")}
              >
                <div className="flex items-center gap-2">
                  <IoColorPaletteOutline className="text-gray-400 group-hover:text-green-600" />
                  <span>Colors</span>
                </div>
                {activeSections.colors ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              {activeSections.colors && (
                <div className="flex flex-wrap gap-2 pl-6">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColors.includes(color)
                          ? "ring-2 ring-green-500 ring-offset-2"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {selectedColors.includes(color) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collections */}
          {collections.length > 0 && (
            <div className="mb-5 pb-4 border-b border-gray-100">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-3 group"
                onClick={() => toggleSection("collections")}
              >
                <div className="flex items-center gap-2">
                  <IoPricetagOutline className="text-gray-400 group-hover:text-green-600" />
                  <span>Collections</span>
                </div>
                {activeSections.collections ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              {activeSections.collections && (
                <div className="space-y-2 max-h-48 overflow-y-auto pl-6">
                  {collections.map((col) => (
                    <label key={col} className="flex items-center text-sm py-1.5 hover:bg-gray-50 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(col)}
                        onChange={() => toggleFilter(selectedCollections, setSelectedCollections, col)}
                        className="rounded text-green-600 focus:ring-green-500 mr-3"
                      />
                      <span className="capitalize text-gray-700">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-5">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-3 group"
              onClick={() => toggleSection("price")}
            >
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-gray-400 group-hover:text-green-600" />
                <span>Price Range</span>
              </div>
              {activeSections.price ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
            </button>
            {activeSections.price && (
              <div className="flex flex-col gap-4 pl-6">
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                    />
                  </div>
                  <span className="text-gray-400 mt-5">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
            )}
          </div>

          {!hasActiveFilters && (
            <div className="text-center py-6 border-t border-gray-100 mt-4">
              <p className="text-gray-400 text-sm">Select filters to refine your results</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
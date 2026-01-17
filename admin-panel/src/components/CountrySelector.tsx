import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Check, X } from 'lucide-react';
import { countries } from '../data/countries';

interface CountrySelectorProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  onSelectionChange,
  placeholder = "Search countries..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Handle click outside to close dropdown and update position on scroll
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (isOpen && inputRef.current) {
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Throttle updates to prevent too many re-renders
        scrollTimeoutRef.current = setTimeout(() => {
          if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            const position = spaceAbove > spaceBelow && spaceAbove > 350 ? 'top' : 'bottom';
            
            const top = position === 'top' 
              ? rect.top - 350
              : rect.bottom + 8;
            
            setDropdownCoords({
              top,
              left: rect.left,
              width: rect.width
            });
          }
        }, 16); // ~60fps
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', updateDropdownPosition, { passive: true });
      window.addEventListener('resize', updateDropdownPosition, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCountryToggle = (country: string) => {
    const newSelection = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    onSelectionChange(newSelection);
  };

  const handleRemoveCountry = (country: string) => {
    const newSelection = selectedCountries.filter(c => c !== country);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredCountries);
  };

  const handleDeselectAll = () => {
    const newSelection = selectedCountries.filter(
      country => !filteredCountries.includes(country)
    );
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Calculate dropdown position
      const position = spaceAbove > spaceBelow && spaceAbove > 350 ? 'top' : 'bottom';
      
      // Calculate coordinates for the dropdown
      const top = position === 'top' 
        ? rect.top - 350 // Show above
        : rect.bottom + 8; // Show below
      
      setDropdownCoords({
        top,
        left: rect.left,
        width: rect.width
      });
      
      // Scroll into view
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: position === 'top' ? 'end' : 'start' 
        });
      }, 100);
    }
    setIsOpen(true);
  };

  return (
    <div className="relative bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-400 transition-colors" style={{ zIndex: 1 }}>
      {/* Selected Countries Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-lg font-semibold text-gray-800">
            🌍 Selected Countries ({selectedCountries.length})
          </label>
          {selectedCountries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
        {selectedCountries.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {selectedCountries.map(country => (
              <span
                key={country}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-blue-600 transition-colors"
              >
                <span>🏳️</span>
                {country}
                <button
                  onClick={() => handleRemoveCountry(country)}
                  className="ml-1 hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500 font-medium">No countries selected yet</p>
            <p className="text-sm text-gray-400 mt-1">Start typing below to search and select countries</p>
          </div>
        )}
      </div>

      {/* Search and Selection Area */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className="w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {!searchTerm && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Dropdown Portal */}
        {isOpen && createPortal(
          <div 
            data-dropdown="country-selector"
            className="fixed z-[99999] bg-white border-2 border-blue-300 rounded-lg shadow-2xl"
            style={{
              top: dropdownCoords.top,
              left: dropdownCoords.left,
              width: dropdownCoords.width,
              maxHeight: '350px'
            }}
          >
            {/* Action Buttons */}
            <div className="flex gap-2 p-3 border-b-2 border-blue-100 bg-blue-50 rounded-t-lg">
              <button
                onClick={handleSelectAll}
                className="flex-1 text-sm px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium transition-colors"
              >
                ✅ Select All ({filteredCountries.length})
              </button>
              <button
                onClick={handleDeselectAll}
                className="flex-1 text-sm px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium transition-colors"
              >
                ❌ Deselect All
              </button>
            </div>

            {/* Countries List */}
            <div 
              className="overflow-y-auto bg-white rounded-b-lg"
              style={{ maxHeight: '250px' }}
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map(country => (
                  <label
                    key={country}
                    className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-base text-gray-700 font-medium flex-1">{country}</span>
                    {selectedCountries.includes(country) && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Selected</span>
                      </div>
                    )}
                  </label>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-gray-400 text-6xl mb-2">🔍</div>
                  <p className="text-gray-500 font-medium">No countries found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[99998]"
          onClick={(e) => {
            // Don't close if clicking on the dropdown itself
            const target = e.target as HTMLElement;
            if (target.closest('[data-dropdown="country-selector"]')) {
              return;
            }
            setIsOpen(false);
          }}
        />,
        document.body
      )}
    </div>
  );
};

export default CountrySelector;

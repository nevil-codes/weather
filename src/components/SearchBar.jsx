// SearchBar.jsx — Production search with autocomplete dropdown
// Debounced city suggestions from the Open-Meteo geocoding API

import { useState, useEffect, useRef } from 'react'
import { searchCities } from '../api/weather'

function SearchBar({ onSearch }) {
  const [city, setCity] = useState(
    () => localStorage.getItem('lastCity') || ''
  )
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  // Debounced autocomplete — waits 300ms after the user stops typing
  useEffect(() => {
    if (city.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    // Clear any existing timeout
    clearTimeout(debounceRef.current)

    // Set a new timeout to fetch suggestions
    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(city)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
      setActiveSuggestion(-1)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [city])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const trimmed = city.trim()
    if (trimmed) {
      onSearch(trimmed)
      setShowDropdown(false)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion)
    setShowDropdown(false)
    onSearch(suggestion)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSelectSuggestion(suggestions[activeSuggestion])
      } else {
        handleSearch()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const isDisabled = city.trim().length === 0

  return (
    <div className="search-bar" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Autocomplete dropdown */}
        {showDropdown && (
          <ul className="autocomplete-dropdown" role="listbox">
            {suggestions.map((s, index) => (
              <li
                key={s}
                className={`autocomplete-item ${index === activeSuggestion ? 'active' : ''}`}
                onClick={() => handleSelectSuggestion(s)}
                role="option"
                aria-selected={index === activeSuggestion}
              >
                📍 {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="search-button"
        onClick={handleSearch}
        disabled={isDisabled}
        aria-label="Search weather"
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar

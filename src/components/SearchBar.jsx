import { useState, useEffect, useRef } from 'react'
import { searchCities } from '../api/weather'

function SearchBar({ onSearch }) {
  const [city, setCity] = useState(() => localStorage.getItem('lastCity') || '')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  // debounced autocomplete
  useEffect(() => {
    if (city.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(city)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
      setActiveIdx(-1)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [city])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submitSearch = () => {
    const trimmed = city.trim()
    if (trimmed) {
      onSearch(trimmed)
      setShowDropdown(false)
    }
  }

  const pickSuggestion = (s) => {
    setCity(s)
    setShowDropdown(false)
    onSearch(s)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        pickSuggestion(suggestions[activeIdx])
      } else {
        submitSearch()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  return (
    <div className="search-bar" ref={wrapperRef}>
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

        {showDropdown && (
          <ul className="autocomplete-dropdown" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={s}
                className={`autocomplete-item ${i === activeIdx ? 'active' : ''}`}
                onClick={() => pickSuggestion(s)}
                role="option"
                aria-selected={i === activeIdx}
              >
                📍 {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="search-button"
        onClick={submitSearch}
        disabled={!city.trim()}
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar

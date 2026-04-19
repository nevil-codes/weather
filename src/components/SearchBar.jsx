// SearchBar.jsx — Production search input with enhanced UX
// Disabled button when empty, visual feedback, Enter key support

import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [city, setCity] = useState(
    () => localStorage.getItem('lastCity') || ''
  )

  const handleSearch = () => {
    const trimmed = city.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Check if input has valid content for enabling the button
  const isDisabled = city.trim().length === 0

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck="false"
      />
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

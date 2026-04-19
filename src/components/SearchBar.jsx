// SearchBar.jsx — Handles city name input and search trigger
// Uses useState for input tracking and calls onSearch prop when user submits

import { useState } from 'react'

function SearchBar({ onSearch }) {
  // State to store the text the user types in the input
  const [city, setCity] = useState('')

  // Called when the user clicks "Search" or presses Enter
  const handleSearch = () => {
    // Only search if the input is not empty
    if (city.trim() !== '') {
      onSearch(city.trim())  // Pass the city name up to the parent (App)
    }
  }

  // Allow searching by pressing the Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-bar">
      {/* Text input — controlled by React state */}
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Button triggers the search */}
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

export default SearchBar

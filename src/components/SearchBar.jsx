// SearchBar.jsx — Handles city name input and search trigger
// Uses useState to track the current input value

import { useState } from 'react'

function SearchBar() {
  // State to store the text the user types in the input
  const [city, setCity] = useState('')

  return (
    <div className="search-bar">
      {/* Text input — value is controlled by React state */}
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      {/* Button to trigger the search */}
      <button className="search-button">
        Search
      </button>
    </div>
  )
}

export default SearchBar

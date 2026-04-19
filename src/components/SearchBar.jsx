// SearchBar.jsx — Handles city name input and search trigger
// Contains a text input and a search button side by side

function SearchBar() {
  return (
    <div className="search-bar">
      {/* Text input where the user types a city name */}
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
      />

      {/* Button to trigger the search */}
      <button className="search-button">
        Search
      </button>
    </div>
  )
}

export default SearchBar

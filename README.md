# ⛅ Weather Dashboard

A polished, production-ready weather dashboard built with React and the Open-Meteo API. Features glassmorphism UI, city autocomplete, and browser geolocation.

**[Live Demo →](#)** *(deploy to Vercel/Netlify and update this link)*

---

## ✨ Features

- 🔍 **City Search** — search any city worldwide with real-time autocomplete
- 📍 **Geolocation** — one-click weather for your current location
- 🎨 **Glassmorphism UI** — frosted glass cards with animated gradient background
- 💾 **Persistence** — remembers your last searched city across sessions
- ⌨️ **Keyboard Navigation** — full arrow key + Enter support in autocomplete
- 📱 **Responsive** — works seamlessly on mobile and desktop
- ♿ **Accessible** — ARIA roles, labels, and semantic HTML

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite) |
| Styling | Vanilla CSS (custom properties) |
| Weather API | [Open-Meteo](https://open-meteo.com/) (free, no key required) |
| Geocoding | Open-Meteo Geocoding + Nominatim (reverse) |
| State | React hooks (`useState`, `useEffect`, `useRef`) |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/weather.git
cd weather

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── api/
│   └── weather.js        # API layer (fetch, geocode, autocomplete)
├── components/
│   ├── SearchBar.jsx      # Search input with autocomplete dropdown
│   └── WeatherCard.jsx    # Weather data display card
├── App.jsx                # Root component and state management
├── index.css              # Design system (tokens, layout, components)
└── main.jsx               # Application entry point
```

## 🎨 Design Decisions

- **CSS Custom Properties** over utility classes — keeps styles readable and maintainable
- **Debounced autocomplete** (300ms) — prevents excessive API calls during typing
- **Shared `performFetch` pattern** — single try/catch flow for all fetch operations
- **No API key required** — Open-Meteo is free and open, no `.env` setup needed
- **WMO weather codes** mapped to emoji + descriptions for a clean, icon-free display

## 📝 License

MIT

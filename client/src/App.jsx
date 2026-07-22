import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch weather from YOUR backend
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/weather?city=${city}`
      );
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🌤️ Weather Dashboard</h1>

        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button onClick={fetchWeather} className="search-btn">
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="loading">Loading weather... ⏳</p>}

        {/* Error */}
        {error && <p className="error">⚠️ {error}</p>}

        {/* Weather Display */}
        {weather && (
          <div className="weather-card">
            <h2 className="city-name">
              {weather.city}, {weather.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.description}
              className="weather-icon"
            />

            <p className="temperature">{weather.temperature}°C</p>
            <p className="description">{weather.description}</p>
            <p className="feels-like">Feels like {weather.feelsLike}°C</p>

            <div className="details">
              <div className="detail-item">
                <span className="detail-label">💧 Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💨 Wind</span>
                <span className="detail-value">{weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
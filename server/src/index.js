const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Debug — check key loaded
console.log("🔑 API KEY:", API_KEY ? "Loaded ✅" : "MISSING ❌");

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "🌤️ Weather Server is running!" });
});

// 🌤️ REAL WEATHER ROUTE
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: "Please provide a city name" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const data = response.data;

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });

  } catch (error) {
    console.error("Error:", error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "City not found!" });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
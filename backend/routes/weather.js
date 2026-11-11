
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const city = req.query.city || "Tirupati";

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: "metric"
        }
      }
    );

    res.json(response.data);
  }  catch (error) {
  console.log("Weather API Error:", error.response?.data || error.message);

  res.status(500).json({
    message: "Unable to fetch weather data"
  });
}

});

module.exports = router;

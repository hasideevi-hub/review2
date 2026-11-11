
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("../routes/auth");
const weatherRoutes = require("../routes/weather");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

let connectionPromise;

module.exports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI)
          .catch((err) => {
            connectionPromise = null;
            throw err;
          });
      }

      await connectionPromise;
    }

    return app(req, res);
  } catch (error) {
    console.error("Backend error:", error.message);
    return res.status(500).json({
      message: "Backend connection failed"
    });
  }
};

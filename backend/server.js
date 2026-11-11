
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.get("/", (req, res) => {
  res.send("Disaster Management Backend Running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

import rateLimit from 'express-rate-limit'

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })

app.use('/api/auth', limiter)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");

const app = express();

app.use(cors());
app.use(express.json());

import cors from 'cors'

app.use(cors({
  origin: 'http://localhost:5173' // your frontend URL only
}))

// Serve uploaded videos statically
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Day.ly backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
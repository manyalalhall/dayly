const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Day.ly backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
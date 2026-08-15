// Imports the main tools needed to create the backend server.
const express = require("express");
const cors = require("cors");

// Imports route files that handle different parts of the app.
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

// Creates the Express app.
const app = express();

// Sets the port for the backend server.
const PORT = 5000;

// Allows the React frontend to connect to this backend.
app.use(cors());

// Allows the server to read JSON data from requests.
app.use(express.json());

// Main API route groups.
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/rewards", rewardRoutes);

// Simple test route to make sure the server is running.
app.get("/", (req, res) => {
  res.send("Questy Academy API is running!");
});

// Starts the server.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
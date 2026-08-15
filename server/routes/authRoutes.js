// Imports Express so we can create routes.
const express = require("express");

// Imports controller functions for register, login, and profile.
const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

// Imports middleware that protects private routes.
const { protectRoute } = require("../middleware/authMiddleware");

// Creates a router object.
const router = express.Router();

// Public route for creating a new account.
router.post("/register", registerUser);

// Public route for logging in.
router.post("/login", loginUser);

// Private route for getting the logged-in user's profile.
router.get("/profile", protectRoute, getProfile);

// Exports the router so server.js can use it.
module.exports = router;
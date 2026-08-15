// Imports Express so we can create progress routes.
const express = require("express");

// Imports progress controller functions.
const {
  completeLevel,
  updateGrade,
  resetProgress
} = require("../controllers/progressController");

// Imports route protection middleware.
const { protectRoute } = require("../middleware/authMiddleware");

// Creates a router object.
const router = express.Router();

// Completes a learning level and gives rewards.
router.put("/complete-level", protectRoute, completeLevel);

// Updates the student's grade.
router.put("/grade", protectRoute, updateGrade);

// Resets progress for testing or replaying.
router.put("/reset", protectRoute, resetProgress);

// Exports the router.
module.exports = router;
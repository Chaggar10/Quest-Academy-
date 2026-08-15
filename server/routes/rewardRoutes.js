// Imports Express so we can create reward routes.
const express = require("express");

// Imports reward controller functions.
const {
  getShopItems,
  buyItem,
  equipItem
} = require("../controllers/rewardController");

// Imports route protection middleware.
const { protectRoute } = require("../middleware/authMiddleware");

// Creates a router object.
const router = express.Router();

// Gets all shop items.
router.get("/shop", protectRoute, getShopItems);

// Buys an item using coins.
router.put("/buy", protectRoute, buyItem);

// Equips an unlocked item.
router.put("/equip", protectRoute, equipItem);

// Exports the router.
module.exports = router;
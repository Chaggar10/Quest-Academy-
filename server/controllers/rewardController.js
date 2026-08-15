// Imports helper functions for reading and saving users.
const { readUsers, saveUsers } = require("../utils/fileHelpers");

// Shop items the student can unlock using coins.
const shopItems = [
  {
    id: "gold-crown",
    name: "Gold Crown",
    emoji: "👑",
    price: 50,
    type: "hat"
  },
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    emoji: "🧙",
    price: 75,
    type: "hat"
  },
  {
    id: "star-glasses",
    name: "Star Glasses",
    emoji: "🤩",
    price: 60,
    type: "face"
  },
  {
    id: "space-pet",
    name: "Space Pet",
    emoji: "🚀",
    price: 100,
    type: "pet"
  },
  {
    id: "dragon-buddy",
    name: "Dragon Buddy",
    emoji: "🐉",
    price: 120,
    type: "pet"
  }
];

// Sends the available shop items to the frontend.
function getShopItems(req, res) {
  res.json(shopItems);
}

// Lets a user buy a shop item with coins.
function buyItem(req, res) {
  const { itemId } = req.body;

  const selectedItem = shopItems.find(item => item.id === itemId);

  if (!selectedItem) {
    return res.status(404).json({ message: "Item not found." });
  }

  const users = readUsers();

  const userIndex = users.findIndex(user => user.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  const user = users[userIndex];

  if (user.unlockedItems.includes(itemId)) {
    return res.status(400).json({ message: "You already own this item." });
  }

  if (user.coins < selectedItem.price) {
    return res.status(400).json({ message: "Not enough coins." });
  }

  user.coins -= selectedItem.price;
  user.unlockedItems.push(itemId);

  if (!user.achievements.includes("First Shop Unlock")) {
    user.achievements.push("First Shop Unlock");
  }

  users[userIndex] = user;
  saveUsers(users);

  res.json({
    message: `${selectedItem.name} unlocked!`,
    user
  });
}

// Lets a user equip an item they already unlocked.
function equipItem(req, res) {
  const { itemId } = req.body;

  const users = readUsers();

  const userIndex = users.findIndex(user => user.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  const user = users[userIndex];

  if (!user.unlockedItems.includes(itemId)) {
    return res.status(400).json({ message: "You must unlock this item first." });
  }

  if (!user.equippedItems.includes(itemId)) {
    user.equippedItems.push(itemId);
  }

  users[userIndex] = user;
  saveUsers(users);

  res.json({
    message: "Item equipped!",
    user
  });
}

module.exports = {
  getShopItems,
  buyItem,
  equipItem
};
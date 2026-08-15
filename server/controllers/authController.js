// Imports bcrypt for password hashing.
const bcrypt = require("bcryptjs");

// Imports JWT for creating login tokens.
const jwt = require("jsonwebtoken");

// Imports helper functions for reading and saving users.
const { readUsers, saveUsers } = require("../utils/fileHelpers");

// Imports the secret key used for JWT.
const { JWT_SECRET } = require("../middleware/authMiddleware");

// Creates a new user account.
async function registerUser(req, res) {
  const { name, email, password, grade, avatar } = req.body;

  if (!name || !email || !password || !grade || !avatar) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  const users = readUsers();

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    grade,
    avatar,
    coins: 0,
    xp: 0,
    level: 1,
    completedLevels: [],
    unlockedItems: ["starter-badge"],
    equippedItems: [],
    achievements: []
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: "Account created successfully.",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      grade: newUser.grade,
      avatar: newUser.avatar,
      coins: newUser.coins,
      xp: newUser.xp,
      level: newUser.level,
      completedLevels: newUser.completedLevels,
      unlockedItems: newUser.unlockedItems,
      equippedItems: newUser.equippedItems,
      achievements: newUser.achievements
    }
  });
}

// Logs in an existing user.
async function loginUser(req, res) {
  const { email, password } = req.body;

  const users = readUsers();

  const user = users.find(savedUser => savedUser.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      avatar: user.avatar,
      coins: user.coins,
      xp: user.xp,
      level: user.level,
      completedLevels: user.completedLevels,
      unlockedItems: user.unlockedItems,
      equippedItems: user.equippedItems,
      achievements: user.achievements
    }
  });
}

// Gets the currently logged-in user's profile.
function getProfile(req, res) {
  const users = readUsers();

  const user = users.find(savedUser => savedUser.id === req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    grade: user.grade,
    avatar: user.avatar,
    coins: user.coins,
    xp: user.xp,
    level: user.level,
    completedLevels: user.completedLevels,
    unlockedItems: user.unlockedItems,
    equippedItems: user.equippedItems,
    achievements: user.achievements
  });
}

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
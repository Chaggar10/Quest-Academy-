const { readUsers, saveUsers } = require("../utils/fileHelpers");

function completeLevel(req, res) {
  const { levelId, subject, score } = req.body;

  if (!levelId || !subject || score === undefined) {
    return res.status(400).json({ message: "Missing level completion details." });
  }

  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  const user = users[userIndex];
  const alreadyCompleted = user.completedLevels.includes(levelId);

  const coinsEarned = score >= 80 ? 25 : score >= 60 ? 15 : 8;
  const xpEarned = score >= 80 ? 50 : score >= 60 ? 30 : 15;

  if (!alreadyCompleted) {
    user.completedLevels.push(levelId);
    user.coins += coinsEarned;
    user.xp += xpEarned;
  }

  user.level = Math.floor(user.xp / 100) + 1;

  if (score === 100 && !user.achievements.includes("Perfect Score Star")) {
    user.achievements.push("Perfect Score Star");
  }

  if (user.completedLevels.length >= 5 && !user.achievements.includes("Level Explorer")) {
    user.achievements.push("Level Explorer");
  }

  users[userIndex] = user;
  saveUsers(users);

  res.json({
    message: alreadyCompleted
      ? "Level already completed. Progress was not rewarded twice."
      : "Level completed successfully!",
    coinsEarned: alreadyCompleted ? 0 : coinsEarned,
    xpEarned: alreadyCompleted ? 0 : xpEarned,
    user
  });
}

function updateGrade(req, res) {
  const { grade } = req.body;

  if (!grade) {
    return res.status(400).json({ message: "Grade is required." });
  }

  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  users[userIndex].grade = grade;
  saveUsers(users);

  res.json({
    message: "Grade updated successfully.",
    user: users[userIndex]
  });
}

function resetProgress(req, res) {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  users[userIndex].coins = 0;
  users[userIndex].xp = 0;
  users[userIndex].level = 1;
  users[userIndex].completedLevels = [];
  users[userIndex].achievements = [];
  users[userIndex].unlockedItems = ["starter-badge"];
  users[userIndex].equippedItems = [];

  saveUsers(users);

  res.json({
    message: "Progress reset successfully.",
    user: users[userIndex]
  });
}

module.exports = {
  completeLevel,
  updateGrade,
  resetProgress
};
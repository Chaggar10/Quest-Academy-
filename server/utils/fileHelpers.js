// Imports Node.js file system tools.
const fs = require("fs");
const path = require("path");

// Creates the file path to the users.json file.
const usersFilePath = path.join(__dirname, "../data/users.json");

// Reads all users from the JSON file.
function readUsers() {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(data);
}

// Saves all users back into the JSON file.
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Exports helper functions so controllers can use them.
module.exports = {
  readUsers,
  saveUsers
};
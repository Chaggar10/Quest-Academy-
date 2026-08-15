// Imports JWT so the server can verify login tokens.
const jwt = require("jsonwebtoken");

// Secret key used to sign and verify tokens.
// In a real project, this should be stored in a .env file.
const JWT_SECRET = "questy_secret_key";

// Middleware that protects private routes.
function protectRoute(req, res, next) {
  const authHeader = req.headers.authorization;

  // Checks if the request has a token.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Removes "Bearer " from the token string.
    const token = authHeader.split(" ")[1];

    // Verifies the token.
    const decoded = jwt.verify(token, JWT_SECRET);

    // Saves the user ID onto the request.
    req.userId = decoded.id;

    // Moves to the next function.
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Exports the middleware and secret key.
module.exports = {
  protectRoute,
  JWT_SECRET
};
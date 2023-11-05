// JWT token helps us to authorize the user at the backend.

// The backend will check if the user has the token the access
// the authorized resources.
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;

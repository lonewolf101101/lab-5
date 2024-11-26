const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", { email, password });

  // Validate request body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  // Find the user by email in MongoDB
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the provided password matches the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Create and assign a JWT token
    const secret =
      "0e71b9b989e2c3161037404a05b5d6638931fb02f384ea84b870d8a4317ec054"; // You can also use process.env.JWT_SECRET
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Use the _id field for MongoDB's unique identifier
      secret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Store the session with user information (optional, if using sessions)
    req.session.user = {
      id: user._id,
      email: user.email,
      isLoggedIn: true,
    };

    return res.json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers["authorization"];

    // If no token is present
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Create a redis key for the token
    const redisKey = `blacklist_${token}`;

    // Add token to blacklist in Redis with expiration
    await setAsync(
      redisKey,
      "true",
      "EX",
      decoded.exp - Math.floor(Date.now() / 1000) // Set expiration to token's remaining time
    );

    // Optional: Additional logout logic (e.g., update user status)
    // await updateUserLogoutStatus(decoded.id);

    // Respond with success
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        success: false,
      });
    }

    // Generic error response
    return res.status(500).json({
      message: "Internal server error during logout",
      success: false,
    });
  }
};

// Middleware to check token blacklist
const checkTokenBlacklist = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers["authorization"];

    // If no token is present, proceed to next middleware
    if (!token) {
      return next();
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await getAsync(`blacklist_${token}`);

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is no longer valid",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.error("Token blacklist check error:", error);
    return res.status(500).json({
      message: "Error verifying token",
      success: false,
    });
  }
};

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Token verification failed",
      success: false,
    });
  }
};

module.exports = {
  login,
  logout,
  checkTokenBlacklist,
  verifyToken,
};

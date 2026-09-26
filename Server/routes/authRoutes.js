const express = require("express");

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth route is working",
    });
});

module.exports = router;
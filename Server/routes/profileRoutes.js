const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/profileController");

// =====================================================
// GET PROFILE
// =====================================================

router.get(
    "/",
    authMiddleware,
    getProfile
);

// =====================================================
// UPDATE PROFILE
// =====================================================

router.put(
    "/",
    authMiddleware,
    updateProfile
);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

module.exports = router;
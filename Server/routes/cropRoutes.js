const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    addCrop,
    getMyCrops,
    updateCrop,
    deleteCrop,
} = require("../controllers/cropController");

const router = express.Router();

// Add Crop
router.post("/", authMiddleware, addCrop);

// Get My Crops
router.get("/", authMiddleware, getMyCrops);

// Update Crop
router.put("/:id", authMiddleware, updateCrop);

// Delete Crop
router.delete("/:id", authMiddleware, deleteCrop);

module.exports = router;
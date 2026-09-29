const express = require("express");
const mongoose = require("mongoose");
const Farm = require("../models/Farm");

const router = express.Router();

// ======================================================
// CREATE FARM
// POST /api/farms
// ======================================================
router.post("/", async (req, res) => {
    try {
        const {
            farmer,
            farmName,
            location,
            area,
            areaUnit,
            farmingType,
            soilType,
            irrigationSource,
            waterAvailability,
            description,
        } = req.body;

        if (!farmer) {
            return res.status(400).json({
                success: false,
                message: "Farmer ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(farmer)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer ID",
            });
        }

        if (!farmName) {
            return res.status(400).json({
                success: false,
                message: "Farm name is required",
            });
        }

        if (!location?.village || !location?.district) {
            return res.status(400).json({
                success: false,
                message: "Village and district are required",
            });
        }

        if (area === undefined || area === null || Number(area) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid farm area is required",
            });
        }

        const farm = await Farm.create({
            farmer,
            farmName,
            location,
            area: Number(area),
            areaUnit,
            farmingType,
            soilType,
            irrigationSource,
            waterAvailability,
            description,
        });

        res.status(201).json({
            success: true,
            message: "Farm added successfully",
            farm,
        });
    } catch (error) {
        console.error("CREATE FARM ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add farm",
            error: error.message,
        });
    }
});

// ======================================================
// GET ALL FARMS
// GET /api/farms
// ======================================================
router.get("/", async (req, res) => {
    try {
        const farms = await Farm.find()
            .populate("farmer", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: farms.length,
            farms,
        });
    } catch (error) {
        console.error("GET FARMS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch farms",
            error: error.message,
        });
    }
});

// ======================================================
// GET FARMS BY FARMER
// GET /api/farms/farmer/:farmerId
// ======================================================
router.get("/farmer/:farmerId", async (req, res) => {
    try {
        const { farmerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer ID",
            });
        }

        const farms = await Farm.find({
            farmer: farmerId,
        })
            .populate("farmer", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: farms.length,
            farms,
        });
    } catch (error) {
        console.error("GET FARMER FARMS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch farmer farms",
            error: error.message,
        });
    }
});

// ======================================================
// GET SINGLE FARM
// GET /api/farms/:id
// ======================================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farm ID",
            });
        }

        const farm = await Farm.findById(id)
            .populate("farmer", "name email");

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found",
            });
        }

        res.status(200).json({
            success: true,
            farm,
        });
    } catch (error) {
        console.error("GET FARM ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch farm",
            error: error.message,
        });
    }
});

// ======================================================
// UPDATE FARM
// PUT /api/farms/:id
// ======================================================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farm ID",
            });
        }

        const farm = await Farm.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate("farmer", "name email");

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Farm updated successfully",
            farm,
        });
    } catch (error) {
        console.error("UPDATE FARM ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update farm",
            error: error.message,
        });
    }
});

// ======================================================
// DELETE FARM
// DELETE /api/farms/:id
// ======================================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farm ID",
            });
        }

        const farm = await Farm.findByIdAndDelete(id);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Farm deleted successfully",
        });
    } catch (error) {
        console.error("DELETE FARM ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete farm",
            error: error.message,
        });
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();

const PestAlert = require("../models/PestAlert");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET ALL MY PEST ALERTS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const alerts = await PestAlert.find({
            farmer: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: alerts.length,
            alerts,
        });
    } catch (error) {
        console.error(
            "Get Pest Alerts Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pest alerts",
        });
    }
});

// ==========================================
// GET MY PEST ALERTS BY CROP
// ==========================================
router.get(
    "/crop/:cropName",
    authMiddleware,
    async (req, res) => {
        try {
            const alerts = await PestAlert.find({
                farmer: req.user.id,
                cropName: {
                    $regex: req.params.cropName,
                    $options: "i",
                },
            }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                count: alerts.length,
                alerts,
            });
        } catch (error) {
            console.error(
                "Crop Pest Alert Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch crop pest alerts",
            });
        }
    }
);

// ==========================================
// GET MY PEST ALERTS BY RISK LEVEL
// ==========================================
router.get(
    "/risk/:riskLevel",
    authMiddleware,
    async (req, res) => {
        try {
            const alerts = await PestAlert.find({
                farmer: req.user.id,
                riskLevel: {
                    $regex: req.params.riskLevel,
                    $options: "i",
                },
            }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                count: alerts.length,
                alerts,
            });
        } catch (error) {
            console.error(
                "Risk Pest Alert Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch risk-based pest alerts",
            });
        }
    }
);

// ==========================================
// ADD NEW PEST ALERT
// ==========================================
router.post(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                cropName,
                pestName,
                diseaseName,
                symptoms,
                riskLevel,
                prevention,
                treatment,
                affectedSeason,
            } = req.body;

            const newAlert = new PestAlert({
                cropName,
                pestName,
                diseaseName,
                symptoms,
                riskLevel,
                prevention,
                treatment,
                affectedSeason,

                // Logged-in farmer
                farmer: req.user.id,
            });

            const savedAlert = await newAlert.save();

            res.status(201).json({
                success: true,
                message:
                    "Pest alert added successfully 🐛",
                alert: savedAlert,
            });
        } catch (error) {
            console.error(
                "Add Pest Alert Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to add pest alert",
                error: error.message,
            });
        }
    }
);

// ==========================================
// UPDATE MY PEST ALERT
// ==========================================
router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const updatedAlert =
                await PestAlert.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        farmer: req.user.id,
                    },
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!updatedAlert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Pest alert not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Pest alert updated successfully",
                alert: updatedAlert,
            });
        } catch (error) {
            console.error(
                "Update Pest Alert Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update pest alert",
                error: error.message,
            });
        }
    }
);

// ==========================================
// DELETE MY PEST ALERT
// ==========================================
router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const deletedAlert =
                await PestAlert.findOneAndDelete({
                    _id: req.params.id,
                    farmer: req.user.id,
                });

            if (!deletedAlert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Pest alert not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Pest alert deleted successfully 🗑️",
            });
        } catch (error) {
            console.error(
                "Delete Pest Alert Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to delete pest alert",
                error: error.message,
            });
        }
    }
);

module.exports = router;
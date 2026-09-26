const express = require("express");
const router = express.Router();

const SoilAnalysis = require("../models/SoilAnalysis");
const authMiddleware = require("../middleware/authMiddleware");

// ============================================
// GET ALL MY SOIL ANALYSIS
// ============================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const analyses = await SoilAnalysis
            .find({
                farmer: req.user.id,
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: analyses.length,
            analyses,
        });

    } catch (error) {
        console.error(
            "Get Soil Analysis Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch soil analysis",
        });
    }
});


// ============================================
// GET MY SOIL ANALYSIS BY ID
// ============================================
router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const analysis =
                await SoilAnalysis.findOne({
                    _id: req.params.id,
                    farmer: req.user.id,
                });

            if (!analysis) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Soil analysis not found",
                });
            }

            res.status(200).json({
                success: true,
                analysis,
            });

        } catch (error) {
            console.error(
                "Get Soil Analysis By ID Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch soil analysis",
            });
        }
    }
);


// ============================================
// POST - ADD SOIL ANALYSIS
// ============================================
router.post(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                fieldName,
                soilType,
                ph,
                nitrogen,
                phosphorus,
                potassium,
                moisture,
                temperature,
                season,
                soilHealth,
                fertilizerRecommendation,
                suitableCrops,
            } = req.body;

            const newAnalysis =
                new SoilAnalysis({
                    // Automatically use
                    // logged-in farmer
                    farmer: req.user.id,

                    fieldName,
                    soilType,
                    ph,
                    nitrogen,
                    phosphorus,
                    potassium,
                    moisture,
                    temperature,
                    season,
                    soilHealth,
                    fertilizerRecommendation,
                    suitableCrops,
                });

            const savedAnalysis =
                await newAnalysis.save();

            res.status(201).json({
                success: true,
                message:
                    "Soil analysis added successfully 🌱",
                analysis: savedAnalysis,
            });

        } catch (error) {
            console.error(
                "Add Soil Analysis Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to add soil analysis",
                error: error.message,
            });
        }
    }
);


// ============================================
// PUT - UPDATE MY SOIL ANALYSIS
// ============================================
router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            // Prevent user from changing
            // farmer ownership
            const updateData = {
                ...req.body,
            };

            delete updateData.farmer;

            const updatedAnalysis =
                await SoilAnalysis.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        farmer: req.user.id,
                    },
                    updateData,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!updatedAnalysis) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Soil analysis not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Soil analysis updated successfully",
                analysis: updatedAnalysis,
            });

        } catch (error) {
            console.error(
                "Update Soil Analysis Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update soil analysis",
            });
        }
    }
);


// ============================================
// DELETE MY SOIL ANALYSIS
// ============================================
router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const deletedAnalysis =
                await SoilAnalysis.findOneAndDelete({
                    _id: req.params.id,
                    farmer: req.user.id,
                });

            if (!deletedAnalysis) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Soil analysis not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Soil analysis deleted successfully 🗑️",
            });

        } catch (error) {
            console.error(
                "Delete Soil Analysis Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to delete soil analysis",
            });
        }
    }
);


module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCropRecommendations,
    getFertilizerRecommendation,
} = require("../services/cropRecommendationService");

// =====================================================
// GET CROP RECOMMENDATIONS
// POST /api/crop-recommendations
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            soilType,
            season,
            temperature,
            rainfall,
            soilPH,
            nitrogen,
            phosphorus,
            potassium,
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!soilType) {
            return res.status(400).json({
                success: false,
                message: "Soil type is required.",
            });
        }

        // ==========================================
        // CROP RECOMMENDATION
        // ==========================================

        const recommendations =
            getCropRecommendations({
                soilType,
                season,
                temperature,
                rainfall,
                soilPH,
                nitrogen,
                phosphorus,
                potassium,
            });

        // ==========================================
        // FERTILIZER RECOMMENDATION
        // ==========================================

        const fertilizerRecommendation =
            getFertilizerRecommendation({
                nitrogen,
                phosphorus,
                potassium,
                soilPH,
                soilType,
            });

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({
            success: true,

            message:
                "Crop recommendation generated successfully.",

            recommendations,

            fertilizerRecommendation,
        });

    } catch (error) {

        console.error(
            "Crop Recommendation Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate crop recommendation.",
            error: error.message,
        });
    }
});

module.exports = router;
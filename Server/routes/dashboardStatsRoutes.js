const express = require("express");
const router = express.Router();

const Crop = require("../models/Crop");
const MarketPrice = require("../models/MarketPrice");
const PestAlert = require("../models/PestAlert");
const SoilAnalysis = require("../models/SoilAnalysis");

const authMiddleware = require("../middleware/authMiddleware");


// =====================================================
// DASHBOARD STATISTICS
// =====================================================
router.get("/", authMiddleware, async (req, res) => {
    try {

        // Logged-in farmer ID
        const farmerId = req.user.id;


        // =========================
        // Crop Statistics
        // =========================
        const totalCrops =
            await Crop.countDocuments({
                farmer: farmerId,
            });


        // =========================
        // Market Price Statistics
        // =========================
        const totalMarketPrices =
            await MarketPrice.countDocuments({
                farmer: farmerId,
            });


        const recentMarketPrices =
            await MarketPrice
                .find({
                    farmer: farmerId,
                })
                .sort({ date: -1 })
                .limit(5);


        // =========================
        // Upcoming Crop Activities
        // =========================
        const crops =
            await Crop
                .find({
                    farmer: farmerId,
                })
                .sort({
                    expectedHarvestDate: 1,
                })
                .limit(10);


        const today = new Date();


        const upcomingActivities =
            crops.filter((crop) => {

                if (!crop.expectedHarvestDate) {
                    return false;
                }

                const harvestDate =
                    new Date(
                        crop.expectedHarvestDate
                    );

                return harvestDate >= today;
            });


        // =========================
        // Pest Alert Statistics
        // =========================
        const totalPestAlerts =
            await PestAlert.countDocuments({
                farmer: farmerId,
            });


        const highRiskAlerts =
            await PestAlert.countDocuments({
                farmer: farmerId,
                riskLevel: "High",
            });


        const criticalAlerts =
            await PestAlert.countDocuments({
                farmer: farmerId,
                riskLevel: "Critical",
            });


        // =========================
        // Recent Pest Alerts
        // =========================
        const recentPestAlerts =
            await PestAlert
                .find({
                    farmer: farmerId,
                })
                .sort({
                    createdAt: -1,
                })
                .limit(5);


        // =========================
        // Soil Analysis Statistics
        // =========================

        // Total Soil Analyses
        const totalSoilAnalyses =
            await SoilAnalysis.countDocuments({
                farmer: farmerId,
            });


        // Good + Excellent Soil
        const goodSoils =
            await SoilAnalysis.countDocuments({
                farmer: farmerId,
                soilHealth: {
                    $in: [
                        "Good",
                        "Excellent",
                    ],
                },
            });


        // Poor Soil
        const poorSoils =
            await SoilAnalysis.countDocuments({
                farmer: farmerId,
                soilHealth: "Poor",
            });


        // Recent Soil Analyses
        const recentSoilAnalyses =
            await SoilAnalysis
                .find({
                    farmer: farmerId,
                })
                .sort({
                    createdAt: -1,
                })
                .limit(5);


        // =========================
        // FINAL DASHBOARD RESPONSE
        // =========================
        res.status(200).json({

            success: true,

            // Crop
            totalCrops,

            // Market Prices
            totalMarketPrices,
            recentMarketPrices,

            // Upcoming Activities
            upcomingActivities,

            // Pest Alerts
            totalPestAlerts,
            highRiskAlerts,
            criticalAlerts,
            recentPestAlerts,

            // Soil Analysis
            totalSoilAnalyses,
            goodSoils,
            poorSoils,
            recentSoilAnalyses,
        });


    } catch (error) {

        console.error(
            "Dashboard Statistics Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch dashboard statistics",
        });
    }
});


module.exports = router;
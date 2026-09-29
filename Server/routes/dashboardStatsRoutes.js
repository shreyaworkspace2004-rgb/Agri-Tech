const express = require("express");
const router = express.Router();

const Crop = require("../models/Crop");
const Farm = require("../models/Farm");
const FarmActivity = require("../models/FarmActivity");
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

        // =================================================
        // FARM STATISTICS
        // =================================================
        const totalFarms = await Farm.countDocuments({
            farmer: farmerId,
        });

        // =================================================
        // CROP STATISTICS
        // =================================================
        const totalCrops = await Crop.countDocuments({
            farmer: farmerId,
        });

        // =================================================
        // MARKET PRICE STATISTICS
        // =================================================
        const totalMarketPrices =
            await MarketPrice.countDocuments({
                farmer: farmerId,
            });

        const recentMarketPrices =
            await MarketPrice.find({
                farmer: farmerId,
            })
                .sort({ date: -1 })
                .limit(5);

        // =================================================
        // UPCOMING CROP ACTIVITIES
        // =================================================
        const crops = await Crop.find({
            farmer: farmerId,
        })
            .sort({
                expectedHarvestDate: 1,
            })
            .limit(10);

        const today = new Date();

        const upcomingActivities = crops.filter((crop) => {
            if (!crop.expectedHarvestDate) {
                return false;
            }

            const harvestDate = new Date(
                crop.expectedHarvestDate
            );

            return harvestDate >= today;
        });

        // =================================================
        // FARM ACTIVITY STATISTICS
        // =================================================
        const totalFarmActivities =
            await FarmActivity.countDocuments({
                farmer: farmerId,
            });

        // =================================================
        // TOTAL FARM ACTIVITY COST
        // =================================================
        const activityCostResult =
            await FarmActivity.aggregate([
                {
                    $match: {
                        farmer: farmerId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCost: {
                            $sum: "$cost",
                        },
                    },
                },
            ]);

        const totalActivityCost =
            activityCostResult.length > 0
                ? activityCostResult[0].totalCost
                : 0;

        // =================================================
        // RECENT FARM ACTIVITIES
        // =================================================
        const recentFarmActivities =
            await FarmActivity.find({
                farmer: farmerId,
            })
                .populate(
                    "farm",
                    "farmName location"
                )
                .populate(
                    "crop",
                    "cropName cropType"
                )
                .sort({
                    activityDate: -1,
                })
                .limit(5);

        // =================================================
        // PEST ALERT STATISTICS
        // =================================================
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

        // =================================================
        // RECENT PEST ALERTS
        // =================================================
        const recentPestAlerts =
            await PestAlert.find({
                farmer: farmerId,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(5);

        // =================================================
        // SOIL ANALYSIS STATISTICS
        // =================================================
        const totalSoilAnalyses =
            await SoilAnalysis.countDocuments({
                farmer: farmerId,
            });

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

        const poorSoils =
            await SoilAnalysis.countDocuments({
                farmer: farmerId,
                soilHealth: "Poor",
            });

        // =================================================
        // RECENT SOIL ANALYSES
        // =================================================
        const recentSoilAnalyses =
            await SoilAnalysis.find({
                farmer: farmerId,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(5);

        // =================================================
        // FINAL DASHBOARD RESPONSE
        // =================================================
        res.status(200).json({
            success: true,

            // Farm
            totalFarms,

            // Crop
            totalCrops,

            // Market Prices
            totalMarketPrices,
            recentMarketPrices,

            // Upcoming Crop Activities
            upcomingActivities,

            // Farm Activities
            totalFarmActivities,
            totalActivityCost,
            recentFarmActivities,

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
            error: error.message,
        });
    }
});

module.exports = router;
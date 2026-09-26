const express = require("express");

const Crop = require("../models/Crop");
const PestAlert = require("../models/PestAlert");
const SoilAnalysis = require("../models/SoilAnalysis");
const MarketPrice = require("../models/MarketPrice");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET MY NOTIFICATIONS
// =====================================================
router.get("/", authMiddleware, async (req, res) => {
    try {

        const notifications = [];

        // Logged-in farmer ID
        const farmerId = req.user.id;


        // =====================================
        // 1. CROP HARVEST REMINDERS
        // =====================================

        const crops = await Crop.find({
            farmer: farmerId,
        });

        const today = new Date();

        crops.forEach((crop) => {

            if (!crop.expectedHarvestDate) {
                return;
            }

            const harvestDate = new Date(
                crop.expectedHarvestDate
            );

            const difference =
                harvestDate.getTime() -
                today.getTime();

            const daysLeft = Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

            if (
                daysLeft >= 0 &&
                daysLeft <= 7
            ) {

                notifications.push({
                    type: "crop",
                    level: "warning",
                    title:
                        "Crop Harvest Reminder",

                    message:
                        `${crop.cropName} harvest is expected in ${daysLeft} day(s).`,

                    date: harvestDate,
                });
            }
        });


        // =====================================
        // 2. HIGH / CRITICAL PEST ALERTS
        // =====================================

        const pestAlerts =
            await PestAlert.find({
                farmer: farmerId,

                riskLevel: {
                    $in: [
                        "High",
                        "Critical",
                    ],
                },
            })
                .sort({
                    createdAt: -1,
                })
                .limit(10);


        pestAlerts.forEach((alert) => {

            notifications.push({

                type: "pest",

                level:
                    alert.riskLevel ===
                        "Critical"
                        ? "danger"
                        : "warning",

                title:
                    alert.riskLevel ===
                        "Critical"
                        ? "Critical Pest Alert"
                        : "High Pest Alert",

                message:
                    `${alert.pestName} detected in ${alert.cropName}.`,

                date: alert.createdAt,
            });
        });


        // =====================================
        // 3. POOR SOIL HEALTH ALERT
        // =====================================

        const poorSoils =
            await SoilAnalysis.find({
                farmer: farmerId,
                soilHealth: "Poor",
            })
                .sort({
                    createdAt: -1,
                })
                .limit(10);


        poorSoils.forEach((soil) => {

            notifications.push({

                type: "soil",

                level: "danger",

                title:
                    "Poor Soil Health",

                message:
                    `${soil.fieldName} has poor soil health. Check fertilizer recommendations.`,

                date: soil.createdAt,
            });
        });


        // =====================================
        // 4. MARKET PRICE UPDATES
        // =====================================

        const recentPrices =
            await MarketPrice.find({
                farmer: farmerId,
            })
                .sort({
                    date: -1,
                })
                .limit(5);


        recentPrices.forEach((price) => {

            notifications.push({

                type: "market",

                level: "info",

                title:
                    "Market Price Update",

                message:
                    `${price.cropName} modal price is ₹${price.modalPrice} ${price.priceUnit}.`,

                date: price.date,
            });
        });


        // =====================================
        // SORT NOTIFICATIONS
        // =====================================

        notifications.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


        // =====================================
        // FINAL RESPONSE
        // =====================================

        res.status(200).json({

            success: true,

            count:
                notifications.length,

            notifications,
        });


    } catch (error) {

        console.error(
            "Notification Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch notifications",
        });
    }
});


module.exports = router;
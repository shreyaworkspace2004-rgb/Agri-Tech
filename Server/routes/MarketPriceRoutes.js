const express = require("express");
const router = express.Router();

const MarketPrice = require("../models/MarketPrice");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// GET ALL MY MARKET PRICES
// ===============================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const prices = await MarketPrice
            .find({
                farmer: req.user.id,
            })
            .sort({ date: -1 });

        res.status(200).json(prices);

    } catch (error) {
        console.error(
            "Get Market Prices Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch market prices",
        });
    }
});


// ===============================
// GET MY MARKET PRICES BY CROP
// ===============================
router.get(
    "/crop/:cropName",
    authMiddleware,
    async (req, res) => {
        try {
            const prices = await MarketPrice
                .find({
                    farmer: req.user.id,
                    cropName: {
                        $regex: req.params.cropName,
                        $options: "i",
                    },
                })
                .sort({ date: -1 });

            res.status(200).json(prices);

        } catch (error) {
            console.error(
                "Crop Search Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to search crop prices",
            });
        }
    }
);


// ===============================
// GET MY MARKET PRICES BY DISTRICT
// ===============================
router.get(
    "/district/:district",
    authMiddleware,
    async (req, res) => {
        try {
            const prices = await MarketPrice
                .find({
                    farmer: req.user.id,
                    district: {
                        $regex: req.params.district,
                        $options: "i",
                    },
                })
                .sort({ date: -1 });

            res.status(200).json(prices);

        } catch (error) {
            console.error(
                "District Search Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to search district prices",
            });
        }
    }
);


// ===============================
// ADD NEW MARKET PRICE
// ===============================
router.post(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                cropName,
                marketName,
                district,
                state,
                minPrice,
                maxPrice,
                modalPrice,
                priceUnit,
                date,
            } = req.body;

            // ===============================
            // BASIC VALIDATION
            // ===============================
            if (
                !cropName ||
                !marketName ||
                !district ||
                minPrice === undefined ||
                maxPrice === undefined ||
                modalPrice === undefined
            ) {
                return res.status(400).json({
                    message:
                        "Please provide all required market price details",
                });
            }

            // ===============================
            // PRICE VALIDATION
            // ===============================
            if (
                Number(minPrice) >
                Number(modalPrice)
            ) {
                return res.status(400).json({
                    message:
                        "Minimum price cannot be greater than modal price",
                });
            }

            if (
                Number(modalPrice) >
                Number(maxPrice)
            ) {
                return res.status(400).json({
                    message:
                        "Modal price cannot be greater than maximum price",
                });
            }

            const newPrice =
                new MarketPrice({
                    cropName,
                    marketName,
                    district,
                    state,
                    minPrice,
                    maxPrice,
                    modalPrice,
                    priceUnit,
                    date,

                    // Automatically assign
                    // logged-in farmer
                    farmer: req.user.id,
                });

            const savedPrice =
                await newPrice.save();

            res.status(201).json({
                success: true,
                message:
                    "Market price added successfully 💰",
                price: savedPrice,
            });

        } catch (error) {
            console.error(
                "Add Market Price Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add market price",
                error: error.message,
            });
        }
    }
);


// ===============================
// UPDATE MY MARKET PRICE
// ===============================
router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            // Prevent changing ownership
            const updateData = {
                ...req.body,
            };

            delete updateData.farmer;

            // ===============================
            // PRICE VALIDATION
            // ===============================
            if (
                updateData.minPrice !== undefined &&
                updateData.modalPrice !== undefined &&
                Number(updateData.minPrice) >
                Number(updateData.modalPrice)
            ) {
                return res.status(400).json({
                    message:
                        "Minimum price cannot be greater than modal price",
                });
            }

            if (
                updateData.modalPrice !== undefined &&
                updateData.maxPrice !== undefined &&
                Number(updateData.modalPrice) >
                Number(updateData.maxPrice)
            ) {
                return res.status(400).json({
                    message:
                        "Modal price cannot be greater than maximum price",
                });
            }

            const updatedPrice =
                await MarketPrice.findOneAndUpdate(
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

            if (!updatedPrice) {
                return res.status(404).json({
                    message:
                        "Market price not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Market price updated successfully ✏️",
                price: updatedPrice,
            });

        } catch (error) {
            console.error(
                "Update Market Price Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update market price",
                error: error.message,
            });
        }
    }
);


// ===============================
// DELETE MY MARKET PRICE
// ===============================
router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const deletedPrice =
                await MarketPrice.findOneAndDelete({
                    _id: req.params.id,
                    farmer: req.user.id,
                });

            if (!deletedPrice) {
                return res.status(404).json({
                    message:
                        "Market price not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Market price deleted successfully 🗑️",
            });

        } catch (error) {
            console.error(
                "Delete Market Price Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete market price",
                error: error.message,
            });
        }
    }
);


module.exports = router;
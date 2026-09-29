const express = require("express");
const mongoose = require("mongoose");
const FarmActivity = require("../models/FarmActivity");

const router = express.Router();

// ======================================================
// CREATE FARM ACTIVITY
// POST /api/farm-activities
// ======================================================
router.post("/", async (req, res) => {
    try {
        const {
            farmer,
            farm,
            crop,
            activityType,
            activityDate,
            description,
            quantity,
            quantityUnit,
            cost,
            notes,
        } = req.body;

        // Farmer validation
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

        // Farm validation
        if (!farm) {
            return res.status(400).json({
                success: false,
                message: "Farm ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(farm)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farm ID",
            });
        }

        // Activity type validation
        if (!activityType) {
            return res.status(400).json({
                success: false,
                message: "Activity type is required",
            });
        }

        const activity = await FarmActivity.create({
            farmer,
            farm,
            crop: crop || null,
            activityType,
            activityDate: activityDate || new Date(),
            description,
            quantity,
            quantityUnit,
            cost,
            notes,
        });

        const populatedActivity =
            await FarmActivity.findById(activity._id)
                .populate("farmer", "name email")
                .populate("farm", "farmName location")
                .populate("crop", "cropName cropType");

        res.status(201).json({
            success: true,
            message: "Farm activity added successfully",
            activity: populatedActivity,
        });

    } catch (error) {
        console.error(
            "Create Farm Activity Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to add farm activity",
            error: error.message,
        });
    }
});


// ======================================================
// GET ALL FARM ACTIVITIES
// GET /api/farm-activities
// ======================================================
router.get("/", async (req, res) => {
    try {
        const activities = await FarmActivity.find()
            .populate("farmer", "name email")
            .populate("farm", "farmName location")
            .populate("crop", "cropName cropType")
            .sort({ activityDate: -1 });

        res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });

    } catch (error) {
        console.error(
            "Get Farm Activities Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch farm activities",
            error: error.message,
        });
    }
});


// ======================================================
// GET SINGLE FARM ACTIVITY
// GET /api/farm-activities/:id
// ======================================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        const activity =
            await FarmActivity.findById(id)
                .populate("farmer", "name email")
                .populate("farm", "farmName location")
                .populate("crop", "cropName cropType");

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Farm activity not found",
            });
        }

        res.status(200).json({
            success: true,
            activity,
        });

    } catch (error) {
        console.error(
            "Get Farm Activity Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch farm activity",
            error: error.message,
        });
    }
});


// ======================================================
// GET ACTIVITIES BY FARMER
// GET /api/farm-activities/farmer/:farmerId
// ======================================================
router.get(
    "/farmer/:farmerId",
    async (req, res) => {
        try {
            const { farmerId } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(
                    farmerId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid farmer ID",
                });
            }

            const activities =
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
                    });

            res.status(200).json({
                success: true,
                count: activities.length,
                activities,
            });

        } catch (error) {
            console.error(
                "Get Farmer Activities Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch farmer activities",
                error: error.message,
            });
        }
    }
);


// ======================================================
// GET ACTIVITIES BY FARM
// GET /api/farm-activities/farm/:farmId
// ======================================================
router.get(
    "/farm/:farmId",
    async (req, res) => {
        try {
            const { farmId } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(
                    farmId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid farm ID",
                });
            }

            const activities =
                await FarmActivity.find({
                    farm: farmId,
                })
                    .populate(
                        "farmer",
                        "name email"
                    )
                    .populate(
                        "crop",
                        "cropName cropType"
                    )
                    .sort({
                        activityDate: -1,
                    });

            res.status(200).json({
                success: true,
                count: activities.length,
                activities,
            });

        } catch (error) {
            console.error(
                "Get Farm Activities Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch farm activities",
                error: error.message,
            });
        }
    }
);


// ======================================================
// UPDATE FARM ACTIVITY
// PUT /api/farm-activities/:id
// ======================================================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        const activity =
            await FarmActivity.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            )
                .populate("farmer", "name email")
                .populate(
                    "farm",
                    "farmName location"
                )
                .populate(
                    "crop",
                    "cropName cropType"
                );

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Farm activity not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Farm activity updated successfully",
            activity,
        });

    } catch (error) {
        console.error(
            "Update Farm Activity Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update farm activity",
            error: error.message,
        });
    }
});


// ======================================================
// DELETE FARM ACTIVITY
// DELETE /api/farm-activities/:id
// ======================================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        const activity =
            await FarmActivity.findByIdAndDelete(id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Farm activity not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Farm activity deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete Farm Activity Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete farm activity",
            error: error.message,
        });
    }
});


module.exports = router;
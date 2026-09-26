const Crop = require("../models/Crop");

// ADD CROP
const addCrop = async (req, res) => {
    try {
        const {
            cropName,
            cropType,
            area,
            soilType,
            sowingDate,
            expectedHarvestDate,
            status,
        } = req.body;

        if (
            !cropName ||
            !cropType ||
            !area ||
            !soilType ||
            !sowingDate ||
            !expectedHarvestDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all crop details",
            });
        }

        const crop = await Crop.create({
            cropName,
            cropType,
            area,
            soilType,
            sowingDate,
            expectedHarvestDate,
            status: status || "Planned",
            farmer: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Crop added successfully 🌾",
            crop,
        });
    } catch (error) {
        console.error("Add Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while adding crop",
        });
    }
};


// GET MY CROPS
const getMyCrops = async (req, res) => {
    try {
        const crops = await Crop.find({
            farmer: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: crops.length,
            crops,
        });
    } catch (error) {
        console.error("Get Crops Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching crops",
        });
    }
};


// UPDATE CROP
const updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findOneAndUpdate(
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

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: "Crop not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Crop updated successfully 🌱",
            crop,
        });
    } catch (error) {
        console.error("Update Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating crop",
        });
    }
};


// DELETE CROP
const deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findOneAndDelete({
            _id: req.params.id,
            farmer: req.user.id,
        });

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: "Crop not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Crop deleted successfully 🗑️",
        });
    } catch (error) {
        console.error("Delete Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting crop",
        });
    }
};


module.exports = {
    addCrop,
    getMyCrops,
    updateCrop,
    deleteCrop,
};
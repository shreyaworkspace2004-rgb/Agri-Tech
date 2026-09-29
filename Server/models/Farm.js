const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        farmName: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            village: {
                type: String,
                required: true,
                trim: true,
            },

            district: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                default: "Maharashtra",
                trim: true,
            },

            pincode: {
                type: String,
                trim: true,
            },
        },

        area: {
            type: Number,
            required: true,
            min: 0,
        },

        areaUnit: {
            type: String,
            enum: ["Acre", "Hectare"],
            default: "Acre",
        },

        farmingType: {
            type: String,
            enum: [
                "Organic",
                "Conventional",
                "Mixed",
            ],
            default: "Conventional",
        },

        soilType: {
            type: String,
            enum: [
                "Black Soil",
                "Red Soil",
                "Alluvial Soil",
                "Laterite Soil",
                "Sandy Soil",
                "Loamy Soil",
                "Other",
            ],
            default: "Other",
        },

        irrigationSource: {
            type: String,
            enum: [
                "Rainwater",
                "Borewell",
                "Well",
                "Canal",
                "Drip Irrigation",
                "Sprinkler",
                "Other",
            ],
            default: "Rainwater",
        },

        waterAvailability: {
            type: String,
            enum: [
                "Good",
                "Moderate",
                "Low",
            ],
            default: "Moderate",
        },

        description: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Farm", farmSchema);
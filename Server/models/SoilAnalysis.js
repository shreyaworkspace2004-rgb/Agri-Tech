const mongoose = require("mongoose");

const soilAnalysisSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fieldName: {
            type: String,
            required: true,
            trim: true,
        },

        soilType: {
            type: String,
            required: true,
            trim: true,
        },

        ph: {
            type: Number,
            required: true,
            min: 0,
            max: 14,
        },

        nitrogen: {
            type: Number,
            required: true,
            min: 0,
        },

        phosphorus: {
            type: Number,
            required: true,
            min: 0,
        },

        potassium: {
            type: Number,
            required: true,
            min: 0,
        },

        moisture: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        temperature: {
            type: Number,
            required: true,
        },

        season: {
            type: String,
            enum: ["Kharif", "Rabi", "Summer"],
            required: true,
        },

        soilHealth: {
            type: String,
            enum: ["Poor", "Moderate", "Good", "Excellent"],
            default: "Moderate",
        },

        fertilizerRecommendation: {
            type: String,
            default: "",
        },

        suitableCrops: {
            type: [String],
            default: [],
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SoilAnalysis", soilAnalysisSchema);
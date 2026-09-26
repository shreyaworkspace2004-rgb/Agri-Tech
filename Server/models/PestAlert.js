const mongoose = require("mongoose");

const pestAlertSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: true,
            trim: true,
        },

        pestName: {
            type: String,
            required: true,
            trim: true,
        },

        diseaseName: {
            type: String,
            default: "",
            trim: true,
        },

        symptoms: {
            type: String,
            required: true,
            trim: true,
        },

        riskLevel: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical",
            ],
            default: "Low",
        },

        prevention: {
            type: String,
            required: true,
            trim: true,
        },

        treatment: {
            type: String,
            required: true,
            trim: true,
        },

        affectedSeason: {
            type: String,
            default: "",
            trim: true,
        },

        // ==============================
        // FARMER / USER
        // ==============================
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

module.exports = mongoose.model(
    "PestAlert",
    pestAlertSchema
);
const mongoose = require("mongoose");

const farmActivitySchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        farm: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farm",
            required: true,
        },

        crop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            default: null,
        },

        activityType: {
            type: String,
            enum: [
                "Ploughing",
                "Sowing",
                "Irrigation",
                "Fertilization",
                "Pesticide Application",
                "Weeding",
                "Harvesting",
                "Other",
            ],
            required: true,
        },

        activityDate: {
            type: Date,
            required: true,
        },

        quantity: {
            type: Number,
            default: 0,
            min: 0,
        },

        quantityUnit: {
            type: String,
            default: "Kg",
            trim: true,
        },

        cost: {
            type: Number,
            default: 0,
            min: 0,
        },

        description: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Planned",
                "Completed",
                "Pending",
            ],
            default: "Completed",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "FarmActivity",
    farmActivitySchema
);
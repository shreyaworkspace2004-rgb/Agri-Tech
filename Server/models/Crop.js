const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: true,
            trim: true,
        },

        cropType: {
            type: String,
            required: true,
            trim: true,
        },

        area: {
            type: Number,
            required: true,
        },

        soilType: {
            type: String,
            required: true,
            trim: true,
        },

        sowingDate: {
            type: Date,
            required: true,
        },

        expectedHarvestDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Planned", "Growing", "Harvested"],
            default: "Planned",
        },

        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Crop", cropSchema);
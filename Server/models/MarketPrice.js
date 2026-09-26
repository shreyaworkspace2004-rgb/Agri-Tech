const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: true,
            trim: true,
        },

        marketName: {
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

        minPrice: {
            type: Number,
            required: true,
        },

        maxPrice: {
            type: Number,
            required: true,
        },

        modalPrice: {
            type: Number,
            required: true,
        },

        priceUnit: {
            type: String,
            default: "₹ / Quintal",
        },

        date: {
            type: Date,
            default: Date.now,
        },

        // ==============================
        // FARMER / USER
        // ==============================
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

module.exports = mongoose.model(
    "MarketPrice",
    marketPriceSchema
);
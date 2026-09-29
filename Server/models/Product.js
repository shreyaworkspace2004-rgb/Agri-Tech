const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // ==========================================
        // PRODUCT BASIC INFORMATION
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Seeds",
                "Fertilizers",
                "Pesticides",
                "Equipment",
                "Other",
            ],
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // PRICE & STOCK
        // ==========================================

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        unit: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // PRODUCT IMAGE
        // ==========================================

        image: {
            type: String,
            default: "",
        },

        // ==========================================
        // SUPPLIER INFORMATION
        // ==========================================

        supplierName: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // PRODUCT STATUS
        // ==========================================

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Product",
    productSchema
);
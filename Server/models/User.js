const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // =========================================
        // BASIC USER INFORMATION
        // =========================================

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        // =========================================
        // PROFILE INFORMATION
        // =========================================

        mobile: {
            type: String,
            trim: true,
            default: "",
        },

        address: {
            type: String,
            trim: true,
            default: "",
        },

        city: {
            type: String,
            trim: true,
            default: "",
        },

        state: {
            type: String,
            trim: true,
            default: "",
        },

        pincode: {
            type: String,
            trim: true,
            default: "",
        },

        farmName: {
            type: String,
            trim: true,
            default: "",
        },

        // =========================================
        // USER ROLE
        // =========================================

        role: {
            type: String,
            enum: ["farmer", "admin"],
            default: "farmer",
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
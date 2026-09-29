const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(
            "Get Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile.",
            error: error.message,
        });
    }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            mobile,
            address,
            city,
            state,
            pincode,
            farmName,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (name !== undefined) {
            user.name = name.trim();
        }

        if (mobile !== undefined) {
            user.mobile = mobile.trim();
        }

        if (address !== undefined) {
            user.address = address.trim();
        }

        if (city !== undefined) {
            user.city = city.trim();
        }

        if (state !== undefined) {
            user.state = state.trim();
        }

        if (pincode !== undefined) {
            user.pincode = pincode.trim();
        }

        if (farmName !== undefined) {
            user.farmName = farmName.trim();
        }

        await user.save();

        const updatedUser = await User.findById(
            req.user.id
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        });

    } catch (error) {
        console.error(
            "Update Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update profile.",
            error: error.message,
        });
    }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password and confirm password do not match.",
            });
        }

        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // ---------------------------------------------
        // CHECK CURRENT PASSWORD
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        // ---------------------------------------------
        // PREVENT SAME PASSWORD
        // ---------------------------------------------

        const samePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password.",
            });
        }

        // ---------------------------------------------
        // HASH NEW PASSWORD
        // ---------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password = hashedPassword;

        await user.save();

        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        res.status(200).json({
            success: true,
            message:
                "Password changed successfully.",
        });

    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to change password.",
            error: error.message,
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};
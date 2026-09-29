const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            // =================================================
            // FARMERS
            // =================================================

            const totalFarmers = await User.countDocuments({
                role: "farmer",
            });

            // =================================================
            // ORDERS
            // =================================================

            const totalOrders =
                await Order.countDocuments();

            const pendingOrders =
                await Order.countDocuments({
                    orderStatus: "Pending",
                });

            const confirmedOrders =
                await Order.countDocuments({
                    orderStatus: "Confirmed",
                });

            const processingOrders =
                await Order.countDocuments({
                    orderStatus: "Processing",
                });

            const shippedOrders =
                await Order.countDocuments({
                    orderStatus: "Shipped",
                });

            const deliveredOrders =
                await Order.countDocuments({
                    orderStatus: "Delivered",
                });

            const cancelledOrders =
                await Order.countDocuments({
                    orderStatus: "Cancelled",
                });

            // =================================================
            // TOTAL SALES
            // =================================================

            const salesResult =
                await Order.aggregate([
                    {
                        $match: {
                            orderStatus: {
                                $ne: "Cancelled",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalSales: {
                                $sum: "$totalAmount",
                            },
                        },
                    },
                ]);

            const totalSales =
                salesResult.length > 0
                    ? salesResult[0].totalSales
                    : 0;

            // =================================================
            // PRODUCTS
            // =================================================

            const totalProducts =
                await Product.countDocuments();

            // =================================================
            // RECENT ORDERS
            // =================================================

            const recentOrders =
                await Order.find()
                    .populate(
                        "farmer",
                        "name email"
                    )
                    .populate(
                        "orderItems.product",
                        "name category price"
                    )
                    .sort({
                        createdAt: -1,
                    })
                    .limit(10);

            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({
                success: true,

                totalFarmers,

                totalOrders,

                totalProducts,

                totalSales,

                pendingOrders,

                confirmedOrders,

                processingOrders,

                shippedOrders,

                deliveredOrders,

                cancelledOrders,

                recentOrders,
            });

        } catch (error) {

            console.error(
                "Admin Dashboard Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch admin dashboard statistics.",
                error: error.message,
            });
        }
    }
);

module.exports = router;
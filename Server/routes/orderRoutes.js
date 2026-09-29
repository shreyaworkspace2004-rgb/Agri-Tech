const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// JWT authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Admin authentication middleware
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================================
// CREATE ORDER
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            orderItems,
            totalItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
        } = req.body;

        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (
            !orderItems ||
            !Array.isArray(orderItems) ||
            orderItems.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order must contain at least one product.",
            });
        }

        if (!deliveryAddress) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery address is required.",
            });
        }

        // ----------------------------------------------
        // CREATE ORDER
        // ----------------------------------------------

        const order = await Order.create({
            farmer: req.user.id,

            orderItems,

            totalItems,

            totalAmount,

            deliveryAddress,

            paymentMethod:
                paymentMethod ||
                "Cash on Delivery",

            paymentStatus: "Pending",

            orderStatus: "Pending",
        });

        // ----------------------------------------------
        // RESPONSE
        // ----------------------------------------------

        res.status(201).json({
            success: true,
            message:
                "Order placed successfully.",
            order,
        });

    } catch (error) {
        console.error(
            "Create Order Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to create order.",
            error: error.message,
        });
    }
});

// ======================================================
// GET MY ORDERS
// ======================================================

router.get(
    "/my-orders",
    authMiddleware,
    async (req, res) => {
        try {
            const orders = await Order.find({
                farmer: req.user.id,
            })
                .populate(
                    "orderItems.product",
                    "name category price"
                )
                .sort({
                    createdAt: -1,
                });

            res.status(200).json({
                success: true,
                count: orders.length,
                orders,
            });

        } catch (error) {
            console.error(
                "Get My Orders Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch orders.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const orders = await Order.find()
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
                });

            res.status(200).json({
                success: true,
                count: orders.length,
                orders,
            });

        } catch (error) {
            console.error(
                "Admin Get All Orders Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch all orders.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

router.put(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const {
                orderStatus,
            } = req.body;

            // ------------------------------------------
            // VALID STATUS VALUES
            // ------------------------------------------

            const allowedStatuses = [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ];

            if (
                !allowedStatuses.includes(
                    orderStatus
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid order status.",
                });
            }

            // ------------------------------------------
            // FIND ORDER
            // ------------------------------------------

            const order =
                await Order.findById(
                    req.params.id
                );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found.",
                });
            }

            // ------------------------------------------
            // UPDATE STATUS
            // ------------------------------------------

            order.orderStatus =
                orderStatus;

            await order.save();

            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            res.status(200).json({
                success: true,
                message:
                    "Order status updated successfully.",
                order,
            });

        } catch (error) {
            console.error(
                "Admin Update Order Status Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update order status.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// GET SINGLE ORDER
// ======================================================

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const order =
                await Order.findOne({
                    _id: req.params.id,
                    farmer: req.user.id,
                }).populate(
                    "orderItems.product",
                    "name category price"
                );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found.",
                });
            }

            res.status(200).json({
                success: true,
                order,
            });

        } catch (error) {
            console.error(
                "Get Single Order Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch order.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// CANCEL ORDER
// ======================================================

router.put(
    "/:id/cancel",
    authMiddleware,
    async (req, res) => {
        try {
            const order =
                await Order.findOne({
                    _id: req.params.id,
                    farmer: req.user.id,
                });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found.",
                });
            }

            if (
                order.orderStatus ===
                "Delivered"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Delivered order cannot be cancelled.",
                });
            }

            if (
                order.orderStatus ===
                "Cancelled"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order is already cancelled.",
                });
            }

            order.orderStatus =
                "Cancelled";

            await order.save();

            res.status(200).json({
                success: true,
                message:
                    "Order cancelled successfully.",
                order,
            });

        } catch (error) {
            console.error(
                "Cancel Order Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to cancel order.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// ADMIN UPDATE ORDER STATUS
// ======================================================

router.put(
    "/admin/:id/status",
    authMiddleware,
    async (req, res) => {
        try {
            // Check admin role
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Admin access required",
                });
            }

            const { orderStatus } = req.body;

            // Validate status
            const allowedStatuses = [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ];

            if (!allowedStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status.",
                });
            }

            // Find order
            const order = await Order.findById(
                req.params.id
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            // Update status
            order.orderStatus = orderStatus;

            // If delivered, payment can be considered completed
            if (orderStatus === "Delivered") {
                order.paymentStatus = "Paid";
            }

            await order.save();

            res.status(200).json({
                success: true,
                message: "Order status updated successfully.",
                order,
            });

        } catch (error) {
            console.error(
                "Admin Update Order Status Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to update order status.",
                error: error.message,
            });
        }
    }
);

module.exports = router;
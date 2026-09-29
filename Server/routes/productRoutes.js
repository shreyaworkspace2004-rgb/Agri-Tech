const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message,
        });
    }
});

// =====================================================
// GET PRODUCTS BY CATEGORY
// =====================================================

router.get("/category/:category", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            isActive: true,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("Get Products By Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products by category",
            error: error.message,
        });
    }
});

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message,
        });
    }
});

// =====================================================
// ADD PRODUCT
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            stock,
            unit,
            image,
            supplierName,
        } = req.body;

        // Required field validation
        if (
            !name ||
            !category ||
            !description ||
            price === undefined ||
            stock === undefined ||
            !unit
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required product details.",
            });
        }

        const product = await Product.create({
            name,
            category,
            description,
            price,
            stock,
            unit,
            image: image || "",
            supplierName: supplierName || "",
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product,
        });
    } catch (error) {
        console.error("Add Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message,
        });
    }
});

// =====================================================
// UPDATE PRODUCT
// =====================================================

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            stock,
            unit,
            image,
            supplierName,
            isActive,
        } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                description,
                price,
                stock,
                unit,
                image,
                supplierName,
                isActive,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
});

// =====================================================
// DELETE PRODUCT
// =====================================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        });
    }
});

module.exports = router;
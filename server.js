const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cropRoutes = require("./routes/cropRoutes");
const marketPriceRoutes = require("./routes/MarketPriceRoutes");
const dashboardStatsRoutes = require("./routes/dashboardStatsRoutes");
const pestAlertRoutes = require("./routes/pestAlertRoutes");
const soilAnalysisRoutes = require("./routes/SoilAnalysisRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ==========================================
// CONNECT MONGODB
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
app.use("/api/auth", authRoutes);

// ==========================================
// DASHBOARD ROUTES
// ==========================================
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/dashboard/stats", dashboardStatsRoutes);

// ==========================================
// CROP MANAGEMENT ROUTES
// ==========================================
app.use("/api/crops", cropRoutes);

// ==========================================
// MARKET PRICE ROUTES
// ==========================================
app.use("/api/market-prices", marketPriceRoutes);

// ==========================================
// PEST ALERT ROUTES
// ==========================================
app.use("/api/pest-alerts", pestAlertRoutes);

// ==========================================
// SOIL ANALYSIS
// ==========================================
app.use("/api/soil-analysis", soilAnalysisRoutes);

// ==========================================
// NOTIFICATIONS
// ==========================================
app.use("/api/notifications", notificationRoutes);

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Agri-Tech Server is running successfully 🌾",
    });
});

// ==========================================
// SERVER PORT
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Agri-Tech Server running on http://localhost:${PORT}`
    );
});
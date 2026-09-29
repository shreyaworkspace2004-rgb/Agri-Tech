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
const farmRoutes = require("./routes/farmRoutes");
const farmActivityRoutes = require("./routes/farmActivityRoutes");

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
// TEST ROOT ROUTE
// ==========================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Agri-Tech Server is running successfully 🌾",
    });
});

// ==========================================
// AUTHENTICATION
// ==========================================
app.use("/api/auth", authRoutes);

// ==========================================
// DASHBOARD
// ==========================================
app.use("/api/dashboard", dashboardRoutes);

app.use(
    "/api/dashboard/stats",
    dashboardStatsRoutes
);

// ==========================================
// CROP MANAGEMENT
// ==========================================
app.use("/api/crops", cropRoutes);

// ==========================================
// MARKET PRICES
// ==========================================
app.use(
    "/api/market-prices",
    marketPriceRoutes
);

// ==========================================
// FARM MANAGEMENT
// ==========================================
app.use("/api/farms", farmRoutes);

// ==========================================
// FARM ACTIVITY MANAGEMENT
// ==========================================
app.use(
    "/api/farm-activities",
    farmActivityRoutes
);

// ==========================================
// PEST ALERTS
// ==========================================
app.use(
    "/api/pest-alerts",
    pestAlertRoutes
);

// ==========================================
// SOIL ANALYSIS
// ==========================================
app.use(
    "/api/soil-analysis",
    soilAnalysisRoutes
);

// ==========================================
// NOTIFICATIONS
// ==========================================
app.use(
    "/api/notifications",
    notificationRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ==========================================
// ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
    });
});

// ==========================================
// SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("==========================================");
    console.log(
        `Agri-Tech Server running on http://localhost:${PORT}`
    );
    console.log(
        "Farm API: http://localhost:5000/api/farms"
    );
    console.log(
        "Farm Activity API: http://localhost:5000/api/farm-activities"
    );
    console.log("==========================================");
});
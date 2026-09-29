import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import PestAlerts from "./pages/PestAlerts";
import SoilAnalysis from "./pages/SoilAnalysis";
import FarmManagement from "./pages/FarmManagement";
import FarmActivities from "./pages/FarmActivities";
import CropRecommendation from "./pages/CropRecommendation";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =====================================================
            PROFILE
        ===================================================== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            REGISTER
        ===================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =====================================================
           SETTINGS
        ===================================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FARMER DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CROP MANAGEMENT
        ===================================================== */}

        <Route
          path="/crops"
          element={
            <ProtectedRoute>
              <Crops />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CROP RECOMMENDATION
        ===================================================== */}

        <Route
          path="/crop-recommendation"
          element={
            <ProtectedRoute>
              <CropRecommendation />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CART
        ===================================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CHECKOUT
        ===================================================== */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ORDER SUCCESS
        ===================================================== */}

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* =====================================================
            MY ORDERS
        ===================================================== */}

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ORDER DETAILS
        ===================================================== */}

        <Route
          path="/order-details/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ADMIN DASHBOARD
        ===================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ADMIN ORDERS
        ===================================================== */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FARM MANAGEMENT
        ===================================================== */}

        <Route
          path="/farm-management"
          element={
            <ProtectedRoute>
              <FarmManagement />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FARM ACTIVITIES
        ===================================================== */}

        <Route
          path="/farm-activities"
          element={
            <ProtectedRoute>
              <FarmActivities />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            WEATHER
        ===================================================== */}

        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            MARKET PRICES
        ===================================================== */}

        <Route
          path="/market-prices"
          element={
            <ProtectedRoute>
              <MarketPrices />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PEST ALERTS
        ===================================================== */}

        <Route
          path="/pest-alerts"
          element={
            <ProtectedRoute>
              <PestAlerts />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SOIL ANALYSIS
        ===================================================== */}

        <Route
          path="/soil-analysis"
          element={
            <ProtectedRoute>
              <SoilAnalysis />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
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

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Crop Management */}
        <Route
          path="/crops"
          element={
            <ProtectedRoute>
              <Crops />
            </ProtectedRoute>
          }
        />

        {/* Weather */}
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />

        {/* Market Prices */}
        <Route
          path="/market-prices"
          element={
            <ProtectedRoute>
              <MarketPrices />
            </ProtectedRoute>
          }
        />

        {/* Pest Alerts */}
        <Route
          path="/pest-alerts"
          element={
            <ProtectedRoute>
              <PestAlerts />
            </ProtectedRoute>
          }
        />
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
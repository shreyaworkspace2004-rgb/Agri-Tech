import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

function Navbar() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = localStorage.getItem("token");

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setNotifications(
                    response.data.notifications || []
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;

        i18n.changeLanguage(selectedLanguage);

        localStorage.setItem(
            "language",
            selectedLanguage
        );
    };

    const getNotificationIcon = (type) => {
        if (type === "crop") return "🌾";
        if (type === "pest") return "🐛";
        if (type === "soil") return "🌱";
        if (type === "market") return "💰";

        return "🔔";
    };

    const getNotificationClass = (level) => {
        if (level === "danger") return "bg-danger-subtle";
        if (level === "warning") return "bg-warning-subtle";
        if (level === "info") return "bg-info-subtle";

        return "bg-light";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">

                {/* Logo */}
                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    🌾 Agri-Tech
                </Link>

                <div className="navbar-nav ms-auto align-items-center">

                    {/* Home */}
                    <Link
                        className="nav-link"
                        to="/"
                    >
                        {t("common.home")}
                    </Link>

                    {/* Login / Register */}
                    {!token && (
                        <>
                            <Link
                                className="nav-link"
                                to="/login"
                            >
                                {t("common.login")}
                            </Link>

                            <Link
                                className="nav-link"
                                to="/register"
                            >
                                {t("common.register")}
                            </Link>
                        </>
                    )}

                    {/* Logged-in User */}
                    {token && (
                        <>
                            {/* Dashboard */}
                            <Link
                                className="nav-link"
                                to="/dashboard"
                            >
                                {t("common.dashboard")}
                            </Link>

                            {/* Crops */}
                            <Link
                                className="nav-link"
                                to="/crops"
                            >
                                {t("common.crops")}
                            </Link>

                            {/* Products */}
                            <Link
                                className="nav-link"
                                to="/products"
                            >
                                🛒 Products
                            </Link>

                            {/* Farm Management */}
                            <Link
                                className="nav-link"
                                to="/farm-management"
                            >
                                🌾 Farm Management
                            </Link>

                            {/* Farm Activity */}
                            <Link
                                className="nav-link"
                                to="/farm-activities"
                            >
                                🚜 Activities
                            </Link>

                            {/* Weather */}
                            <Link
                                className="nav-link"
                                to="/weather"
                            >
                                {t("common.weather")}
                            </Link>

                            {/* Market Prices */}
                            <Link
                                className="nav-link"
                                to="/market-prices"
                            >
                                {t("common.marketPrices")}
                            </Link>

                            {/* Pest Alerts */}
                            <Link
                                className="nav-link"
                                to="/pest-alerts"
                            >
                                🐛 {t("common.pestAlerts")}
                            </Link>

                            {/* Soil Analysis */}
                            <Link
                                className="nav-link"
                                to="/soil-analysis"
                            >
                                🌱 {t("common.soilAnalysis")}
                            </Link>

                            {/* Language Selector */}
                            <div className="ms-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={i18n.language}
                                    onChange={handleLanguageChange}
                                    style={{
                                        width: "125px",
                                        cursor: "pointer",
                                    }}
                                    title={t("common.language")}
                                >
                                    <option value="en">
                                        English
                                    </option>

                                    <option value="mr">
                                        मराठी
                                    </option>

                                    <option value="hi">
                                        हिंदी
                                    </option>
                                </select>
                            </div>

                            {/* Notifications */}
                            <div
                                className="position-relative ms-2"
                                style={{
                                    display: "inline-block",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-light position-relative"
                                    onClick={() =>
                                        setShowNotifications(
                                            !showNotifications
                                        )
                                    }
                                    title="Notifications"
                                >
                                    🔔

                                    {notifications.length > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{
                                                fontSize: "10px",
                                            }}
                                        >
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div
                                        className="position-absolute bg-white shadow-lg rounded p-2"
                                        style={{
                                            width: "380px",
                                            right: "0",
                                            top: "50px",
                                            zIndex: 1050,
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">

                                            <h6 className="fw-bold mb-0 text-dark">
                                                🔔 Notifications
                                            </h6>

                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={
                                                    fetchNotifications
                                                }
                                            >
                                                🔄
                                            </button>

                                        </div>

                                        {notifications.length > 0 ? (
                                            notifications.map(
                                                (
                                                    notification,
                                                    index
                                                ) => (
                                                    <div
                                                        key={`${notification.type}-${index}`}
                                                        className={`p-2 mb-2 rounded ${getNotificationClass(
                                                            notification.level
                                                        )}`}
                                                    >
                                                        <div className="d-flex">

                                                            <div
                                                                className="me-2"
                                                                style={{
                                                                    fontSize:
                                                                        "24px",
                                                                }}
                                                            >
                                                                {getNotificationIcon(
                                                                    notification.type
                                                                )}
                                                            </div>

                                                            <div>

                                                                <div
                                                                    className="fw-bold text-dark"
                                                                    style={{
                                                                        fontSize:
                                                                            "14px",
                                                                    }}
                                                                >
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </div>

                                                                <div
                                                                    className="text-dark"
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </div>

                                                                <small className="text-muted">
                                                                    {notification.date
                                                                        ? new Date(
                                                                            notification.date
                                                                        ).toLocaleDateString(
                                                                            "en-IN",
                                                                            {
                                                                                day: "2-digit",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                            }
                                                                        )
                                                                        : ""}
                                                                </small>

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center text-muted py-4">

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "40px",
                                                    }}
                                                >
                                                    🔔
                                                </div>

                                                <p className="mb-0">
                                                    No new notifications.
                                                </p>

                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Logout */}
                            <button
                                className="btn btn-light btn-sm ms-2"
                                onClick={handleLogout}
                            >
                                {t("common.logout")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
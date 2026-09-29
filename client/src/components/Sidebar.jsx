import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Home",
            path: "/",
            icon: "🏠",
        },
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "▦",
        },
        {
            name: "My Crops",
            path: "/crops",
            icon: "🌱",
        },
        {
            name: "Crop Recommendation",
            path: "/crop-recommendation",
            icon: "🌾",
        },
        {
            name: "Products",
            path: "/products",
            icon: "🛒",
        },
        {
            name: "My Orders",
            path: "/my-orders",
            icon: "📦",
        },
        {
            name: "Farm Management",
            path: "/farm-management",
            icon: "🌾",
        },
        {
            name: "Farm Activities",
            path: "/farm-activities",
            icon: "🚜",
        },
        {
            name: "Weather",
            path: "/weather",
            icon: "☁️",
        },
        {
            name: "Market Prices",
            path: "/market-prices",
            icon: "💰",
        },
        {
            name: "Pest Alerts",
            path: "/pest-alerts",
            icon: "🐛",
        },
        {
            name: "Soil Analysis",
            path: "/soil-analysis",
            icon: "🌱",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <aside className="agri-sidebar">

            {/* LOGO */}

            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    🌾
                </div>

                <div className="sidebar-logo-text">
                    Agri-Tech
                </div>
            </div>

            {/* MENU */}

            <nav className="sidebar-menu">

                {menuItems.map((item) => {

                    const active =
                        location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={
                                active
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span className="sidebar-text">
                                {item.name}
                            </span>

                        </Link>
                    );

                })}

            </nav>

            {/* BOTTOM MENU */}

            <div className="sidebar-bottom">

                <Link
                    to="/notifications"
                    className="sidebar-link"
                >
                    <span className="sidebar-icon">
                        🔔
                    </span>

                    <span className="sidebar-text">
                        Notifications
                    </span>
                </Link>

                <button
                    type="button"
                    className="sidebar-link sidebar-logout"
                    onClick={handleLogout}
                >
                    <span className="sidebar-icon">
                        🚪
                    </span>

                    <span className="sidebar-text">
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
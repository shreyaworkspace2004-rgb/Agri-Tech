import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH ADMIN DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login as admin.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to load admin dashboard."
                );
                return;
            }

            setStats(data);

        } catch (error) {
            console.error(
                "Admin Dashboard Error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {
        fetchDashboard();
    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-success"
                    role="status"
                ></div>

                <h5 className="mt-3">
                    Loading Admin Dashboard...
                </h5>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="container py-5">

                <div className="alert alert-danger text-center">
                    <strong>Error:</strong>{" "}
                    {error}
                </div>

                <div className="text-center">

                    <button
                        className="btn btn-success"
                        onClick={fetchDashboard}
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>
        );
    }

    // =====================================================
    // NO DATA
    // =====================================================

    if (!stats) {
        return (
            <div className="container py-5 text-center">

                <h4>
                    No dashboard data available.
                </h4>

            </div>
        );
    }

    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    return (
        <div className="admin-dashboard-page">

            <div className="container py-4">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                    <div>

                        <h1 className="fw-bold text-success">
                            🌾 Admin Dashboard
                        </h1>

                        <p className="text-muted mb-0">
                            Manage your Agri-Tech platform
                        </p>

                    </div>

                    <div className="d-flex gap-2 flex-wrap">

                        <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={fetchDashboard}
                        >
                            🔄 Refresh
                        </button>

                        <Link
                            to="/admin/orders"
                            className="btn btn-success"
                        >
                            📦 Manage Orders
                        </Link>

                        <Link
                            to="/products"
                            className="btn btn-outline-success"
                        >
                            🛒 Products
                        </Link>

                    </div>

                </div>

                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div className="row g-4 mb-4">

                    {/* TOTAL FARMERS */}

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="admin-stat-icon">
                                    👨‍🌾
                                </div>

                                <p className="text-muted mb-1">
                                    Total Farmers
                                </p>

                                <h2 className="fw-bold mb-0">
                                    {stats.totalFarmers ?? 0}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* TOTAL ORDERS */}

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="admin-stat-icon">
                                    📦
                                </div>

                                <p className="text-muted mb-1">
                                    Total Orders
                                </p>

                                <h2 className="fw-bold mb-0">
                                    {stats.totalOrders ?? 0}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* TOTAL PRODUCTS */}

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="admin-stat-icon">
                                    🛒
                                </div>

                                <p className="text-muted mb-1">
                                    Total Products
                                </p>

                                <h2 className="fw-bold mb-0">
                                    {stats.totalProducts ?? 0}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* TOTAL SALES */}

                    <div className="col-md-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="admin-stat-icon">
                                    💰
                                </div>

                                <p className="text-muted mb-1">
                                    Total Sales
                                </p>

                                <h2 className="fw-bold text-success mb-0">
                                    ₹{stats.totalSales ?? 0}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    ORDER STATUS
                ================================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <h4 className="fw-bold mb-4">
                            📊 Order Status
                        </h4>

                        <div className="row g-3">

                            {/* PENDING */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box pending">

                                    <h4>
                                        {stats.pendingOrders ?? 0}
                                    </h4>

                                    <span>
                                        Pending
                                    </span>

                                </div>

                            </div>

                            {/* CONFIRMED */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box confirmed">

                                    <h4>
                                        {stats.confirmedOrders ?? 0}
                                    </h4>

                                    <span>
                                        Confirmed
                                    </span>

                                </div>

                            </div>

                            {/* PROCESSING */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box processing">

                                    <h4>
                                        {stats.processingOrders ?? 0}
                                    </h4>

                                    <span>
                                        Processing
                                    </span>

                                </div>

                            </div>

                            {/* SHIPPED */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box shipped">

                                    <h4>
                                        {stats.shippedOrders ?? 0}
                                    </h4>

                                    <span>
                                        Shipped
                                    </span>

                                </div>

                            </div>

                            {/* DELIVERED */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box delivered">

                                    <h4>
                                        {stats.deliveredOrders ?? 0}
                                    </h4>

                                    <span>
                                        Delivered
                                    </span>

                                </div>

                            </div>

                            {/* CANCELLED */}

                            <div className="col-6 col-md-4 col-lg-2">

                                <div className="status-box cancelled">

                                    <h4>
                                        {stats.cancelledOrders ?? 0}
                                    </h4>

                                    <span>
                                        Cancelled
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    RECENT ORDERS
                ================================================= */}

                <div className="card border-0 shadow-sm">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

                            <h4 className="fw-bold mb-0">
                                📋 Recent Orders
                            </h4>

                            <Link
                                to="/admin/orders"
                                className="btn btn-outline-success btn-sm"
                            >
                                View All
                            </Link>

                        </div>

                        {/* NO ORDERS */}

                        {!stats.recentOrders ||
                            stats.recentOrders.length === 0 ? (

                            <div className="text-center py-4">

                                <div className="display-5">
                                    📦
                                </div>

                                <p className="text-muted mt-2">
                                    No orders found.
                                </p>

                            </div>

                        ) : (

                            /* ORDERS TABLE */

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead>

                                        <tr>

                                            <th>
                                                Order ID
                                            </th>

                                            <th>
                                                Farmer
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {stats.recentOrders.map(
                                            (order) => {

                                                const status =
                                                    order.orderStatus
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        );

                                                return (
                                                    <tr
                                                        key={
                                                            order._id
                                                        }
                                                    >

                                                        {/* ORDER ID */}

                                                        <td>
                                                            <strong>
                                                                #
                                                                {order._id?.slice(
                                                                    -8
                                                                )}
                                                            </strong>
                                                        </td>

                                                        {/* FARMER */}

                                                        <td>
                                                            {order.farmer?.name ||
                                                                "Farmer"}
                                                        </td>

                                                        {/* AMOUNT */}

                                                        <td>

                                                            <strong className="text-success">
                                                                ₹
                                                                {
                                                                    order.totalAmount
                                                                }
                                                            </strong>

                                                        </td>

                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={`badge status-${status}`}
                                                            >
                                                                {
                                                                    order.orderStatus
                                                                }
                                                            </span>

                                                        </td>

                                                        {/* DATE */}

                                                        <td>

                                                            {order.createdAt
                                                                ? new Date(
                                                                    order.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )
                                                                : "-"}

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
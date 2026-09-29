import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";
import { Link } from "react-router-dom";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH ALL ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login as admin.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/orders/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(response.data.orders || []);

        } catch (err) {
            console.error(
                "Fetch Admin Orders Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateOrderStatus = async (
        orderId,
        newStatus
    ) => {
        try {
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login as admin.");
                return;
            }

            await axios.put(
                `http://localhost:5000/api/orders/admin/${orderId}/status`,
                {
                    orderStatus: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Reload orders after update
            await fetchOrders();

        } catch (err) {
            console.error(
                "Update Order Status Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update order status."
            );
        }
    };

    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {
        fetchOrders();
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
                    Loading Orders...
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

                <div className="alert alert-danger">

                    <strong>Error:</strong>{" "}
                    {error}

                    <div className="mt-3">

                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={fetchOrders}
                        >
                            🔄 Try Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // ADMIN ORDERS PAGE
    // =====================================================

    return (
        <div className="admin-orders-page">

            <div className="container py-4">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                    <div>

                        <h1 className="fw-bold text-success">
                            📦 Manage Orders
                        </h1>

                        <p className="text-muted mb-0">
                            View and manage all farmer orders
                        </p>

                    </div>

                    <Link
                        to="/admin/dashboard"
                        className="btn btn-outline-success"
                    >
                        📊 Dashboard
                    </Link>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={fetchOrders}
                    >
                        🔄 Refresh Orders
                    </button>

                </div>

                {/* ================================================= */}
                {/* ORDER COUNT */}
                {/* ================================================= */}

                <div className="row mb-4">

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Total Orders
                                </h6>

                                <h2 className="fw-bold text-success mb-0">
                                    {orders.length}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================================================= */}
                {/* NO ORDERS */}
                {/* ================================================= */}

                {orders.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div className="display-3">
                                📦
                            </div>

                            <h4 className="fw-bold mt-3">
                                No Orders Found
                            </h4>

                            <p className="text-muted">
                                There are no orders available.
                            </p>

                        </div>

                    </div>

                ) : (

                    /* =================================================
                       ORDERS TABLE
                    ================================================= */

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead>

                                        <tr>

                                            <th>
                                                Order ID
                                            </th>

                                            <th>
                                                Products
                                            </th>

                                            <th>
                                                Items
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Payment
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

                                        {orders.map(
                                            (order) => (

                                                <tr
                                                    key={
                                                        order._id
                                                    }
                                                >

                                                    {/* ORDER ID */}

                                                    <td>

                                                        <small className="fw-semibold">

                                                            #
                                                            {order._id
                                                                ? order._id.slice(
                                                                    -8
                                                                )
                                                                : "N/A"}

                                                        </small>

                                                    </td>

                                                    {/* PRODUCTS */}

                                                    <td>

                                                        {order.orderItems &&
                                                            order.orderItems.length >
                                                            0 ? (

                                                            order.orderItems.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="small mb-1"
                                                                    >

                                                                        {item
                                                                            .product
                                                                            ?.name ||
                                                                            "Product"}

                                                                        {" × "}

                                                                        {
                                                                            item.quantity
                                                                        }

                                                                    </div>

                                                                )
                                                            )

                                                        ) : (

                                                            <span className="text-muted">
                                                                No products
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* TOTAL ITEMS */}

                                                    <td>

                                                        <span className="badge bg-success-subtle text-success">

                                                            {
                                                                order.totalItems
                                                            }

                                                        </span>

                                                    </td>

                                                    {/* TOTAL AMOUNT */}

                                                    <td>

                                                        <strong className="text-success">

                                                            ₹
                                                            {
                                                                order.totalAmount
                                                            }

                                                        </strong>

                                                    </td>

                                                    {/* PAYMENT */}

                                                    <td>

                                                        <div>
                                                            {
                                                                order.paymentMethod ||
                                                                "Cash on Delivery"
                                                            }
                                                        </div>

                                                        <small className="text-muted">

                                                            {
                                                                order.paymentStatus ||
                                                                "Pending"
                                                            }

                                                        </small>

                                                    </td>

                                                    {/* ORDER STATUS */}

                                                    <td>

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                order.orderStatus ||
                                                                "Pending"
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateOrderStatus(
                                                                    order._id,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        >

                                                            <option value="Pending">
                                                                Pending
                                                            </option>

                                                            <option value="Confirmed">
                                                                Confirmed
                                                            </option>

                                                            <option value="Processing">
                                                                Processing
                                                            </option>

                                                            <option value="Shipped">
                                                                Shipped
                                                            </option>

                                                            <option value="Delivered">
                                                                Delivered
                                                            </option>

                                                            <option value="Cancelled">
                                                                Cancelled
                                                            </option>

                                                        </select>

                                                    </td>

                                                    {/* DATE */}

                                                    <td>

                                                        <small>

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

                                                        </small>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminOrders;
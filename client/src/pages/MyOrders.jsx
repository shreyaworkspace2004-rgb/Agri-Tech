import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH MY ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to view your orders."
                );

                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/orders/my-orders",
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
                    "Unable to load orders."
                );

                return;
            }

            setOrders(data.orders || []);

        } catch (error) {
            console.error(
                "My Orders Error:",
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
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const cancelOrder = async (orderId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/orders/${orderId}/cancel`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to cancel order."
                );

                return;
            }

            alert(
                "Order cancelled successfully."
            );

            fetchOrders();

        } catch (error) {
            console.error(
                "Cancel Order Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="container py-5">

                <div className="text-center">

                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="text-muted mt-3">
                        Loading your orders...
                    </p>

                </div>

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
                    {error}
                </div>

                <div className="text-center">

                    <Link
                        to="/products"
                        className="btn btn-success"
                    >
                        🛍️ Browse Products
                    </Link>

                </div>

            </div>
        );
    }

    // =====================================================
    // NO ORDERS
    // =====================================================

    if (orders.length === 0) {
        return (
            <div className="container py-5">

                <div className="my-orders-empty text-center">

                    <div className="display-1 mb-3">
                        📦
                    </div>

                    <h2 className="fw-bold">
                        No Orders Yet
                    </h2>

                    <p className="text-muted">
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/products"
                        className="btn btn-success mt-3"
                    >
                        🛍️ Browse Products
                    </Link>

                </div>

            </div>
        );
    }

    // =====================================================
    // ORDERS PAGE
    // =====================================================

    return (
        <div className="container py-4 my-orders-page">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1 className="fw-bold text-success">
                        📦 My Orders
                    </h1>

                    <p className="text-muted mb-0">
                        View and manage your orders
                    </p>

                </div>

                <Link
                    to="/products"
                    className="btn btn-outline-success"
                >
                    🛍️ Continue Shopping
                </Link>

            </div>

            {/* ORDER LIST */}

            {orders.map((order) => (

                <div
                    className="card border-0 shadow-sm mb-4 order-card"
                    key={order._id}
                >

                    <div className="card-body">

                        {/* ORDER HEADER */}

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">

                            <div>

                                <span className="text-muted small">
                                    Order ID
                                </span>

                                <h6 className="fw-bold mb-0 order-id">
                                    {order._id}
                                </h6>

                            </div>

                            <div className="text-md-end">

                                <span className="text-muted small d-block">
                                    Order Date
                                </span>

                                <strong>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </strong>

                            </div>

                        </div>

                        <hr />

                        {/* ORDER STATUS */}

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">

                            <div>

                                <span className="text-muted small d-block">
                                    Order Status
                                </span>

                                <span
                                    className={`badge order-status status-${order.orderStatus
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {order.orderStatus}
                                </span>

                            </div>

                            <div>

                                <span className="text-muted small d-block">
                                    Payment
                                </span>

                                <strong>
                                    {order.paymentMethod}
                                </strong>

                            </div>

                            <div>

                                <span className="text-muted small d-block">
                                    Total Items
                                </span>

                                <strong>
                                    {order.totalItems}
                                </strong>

                            </div>

                            <div>

                                <span className="text-muted small d-block">
                                    Total Amount
                                </span>

                                <strong className="text-success fs-5">
                                    ₹{order.totalAmount}
                                </strong>

                            </div>

                        </div>

                        {/* PRODUCTS */}

                        <div className="order-products">

                            <h6 className="fw-bold mb-3">
                                Ordered Products
                            </h6>

                            {order.orderItems?.map(
                                (item, index) => (

                                    <div
                                        className="order-product-item"
                                        key={index}
                                    >

                                        <div>

                                            <strong>
                                                {item.name}
                                            </strong>

                                            <small>
                                                Quantity:{" "}
                                                {item.quantity}
                                                {" × "}
                                                ₹{item.price}
                                            </small>

                                        </div>

                                        <strong className="text-success">
                                            ₹
                                            {Number(
                                                item.price
                                            ) *
                                                Number(
                                                    item.quantity
                                                )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                        {/* ACTIONS */}

                        <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">

                            <Link
                                to={`/order-details/${order._id}`}
                                className="btn btn-success btn-sm"
                            >
                                👁️ View Details
                            </Link>

                            {order.orderStatus !==
                                "Delivered" &&
                                order.orderStatus !==
                                "Cancelled" && (

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            cancelOrder(
                                                order._id
                                            )
                                        }
                                    >
                                        🗑️ Cancel Order
                                    </button>

                                )}

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default MyOrders;
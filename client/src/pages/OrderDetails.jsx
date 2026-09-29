import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH SINGLE ORDER
    // =====================================================

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to view order details."
                );
                setLoading(false);
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
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
                    "Unable to load order details."
                );
                return;
            }

            setOrder(data.order);

        } catch (error) {
            console.error(
                "Order Details Error:",
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
    // LOAD ORDER
    // =====================================================

    useEffect(() => {
        fetchOrder();
    }, [id]);

    // =====================================================
    // GET TRACKING STEP
    // =====================================================

    const getTrackingStep = (status) => {
        switch (status) {
            case "Pending":
                return 1;

            case "Confirmed":
                return 2;

            case "Processing":
                return 3;

            case "Shipped":
                return 4;

            case "Delivered":
                return 5;

            default:
                return 0;
        }
    };

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

                <p className="text-muted mt-3">
                    Loading order details...
                </p>

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
                        to="/my-orders"
                        className="btn btn-success"
                    >
                        ← Back to My Orders
                    </Link>

                </div>

            </div>
        );
    }

    // =====================================================
    // NO ORDER
    // =====================================================

    if (!order) {
        return (
            <div className="container py-5">

                <div className="alert alert-warning text-center">
                    Order not found.
                </div>

                <div className="text-center">

                    <Link
                        to="/my-orders"
                        className="btn btn-success"
                    >
                        ← Back to My Orders
                    </Link>

                </div>

            </div>
        );
    }

    // =====================================================
    // TRACKING
    // =====================================================

    const currentStep = getTrackingStep(
        order.orderStatus
    );

    // =====================================================
    // ORDER DETAILS PAGE
    // =====================================================

    return (
        <div className="container py-4 order-details-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1 className="fw-bold text-success">
                        📦 Order Details
                    </h1>

                    <p className="text-muted mb-0">
                        Track your agricultural product order
                    </p>

                </div>

                <Link
                    to="/my-orders"
                    className="btn btn-outline-success"
                >
                    ← My Orders
                </Link>

            </div>


            {/* =================================================
                ORDER INFORMATION
            ================================================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-4">

                        {/* ORDER ID */}

                        <div className="col-md-6">

                            <span className="text-muted small">
                                Order ID
                            </span>

                            <p className="fw-bold order-detail-id">
                                {order._id}
                            </p>

                        </div>


                        {/* ORDER DATE */}

                        <div className="col-md-6">

                            <span className="text-muted small">
                                Order Date
                            </span>

                            <p className="fw-bold">

                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}

                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="col-md-4">

                            <span className="text-muted small">
                                Status
                            </span>

                            <p>

                                <span
                                    className={`badge ${order.orderStatus ===
                                            "Cancelled"
                                            ? "bg-danger"
                                            : order.orderStatus ===
                                                "Delivered"
                                                ? "bg-success"
                                                : order.orderStatus ===
                                                    "Shipped"
                                                    ? "bg-primary"
                                                    : "bg-warning text-dark"
                                        }`}
                                >
                                    {order.orderStatus}
                                </span>

                            </p>

                        </div>


                        {/* PAYMENT */}

                        <div className="col-md-4">

                            <span className="text-muted small">
                                Payment
                            </span>

                            <p className="fw-bold">
                                {order.paymentMethod}
                            </p>

                        </div>


                        {/* TOTAL AMOUNT */}

                        <div className="col-md-4">

                            <span className="text-muted small">
                                Total Amount
                            </span>

                            <p className="fw-bold text-success fs-5">
                                ₹{order.totalAmount}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ORDER TRACKING
            ================================================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">
                        🚚 Order Tracking
                    </h4>


                    {/* CANCELLED */}

                    {order.orderStatus === "Cancelled" ? (

                        <div className="alert alert-danger mb-0">

                            <h5 className="fw-bold">
                                ❌ Order Cancelled
                            </h5>

                            <p className="mb-0">
                                This order has been cancelled.
                            </p>

                        </div>

                    ) : (

                        <div className="tracking-container">

                            {/* ===============================
                                ORDER PLACED
                            =============================== */}

                            <div
                                className={
                                    currentStep >= 1
                                        ? "tracking-step active"
                                        : "tracking-step"
                                }
                            >

                                <div className="tracking-circle">

                                    {currentStep >= 1
                                        ? "✓"
                                        : "1"}

                                </div>

                                <span>
                                    Order Placed
                                </span>

                            </div>


                            <div
                                className={
                                    currentStep >= 2
                                        ? "tracking-line active"
                                        : "tracking-line"
                                }
                            ></div>


                            {/* ===============================
                                CONFIRMED
                            =============================== */}

                            <div
                                className={
                                    currentStep >= 2
                                        ? "tracking-step active"
                                        : "tracking-step"
                                }
                            >

                                <div className="tracking-circle">

                                    {currentStep >= 2
                                        ? "✓"
                                        : "2"}

                                </div>

                                <span>
                                    Confirmed
                                </span>

                            </div>


                            <div
                                className={
                                    currentStep >= 3
                                        ? "tracking-line active"
                                        : "tracking-line"
                                }
                            ></div>


                            {/* ===============================
                                PROCESSING
                            =============================== */}

                            <div
                                className={
                                    currentStep >= 3
                                        ? "tracking-step active"
                                        : "tracking-step"
                                }
                            >

                                <div className="tracking-circle">

                                    {currentStep >= 3
                                        ? "✓"
                                        : "3"}

                                </div>

                                <span>
                                    Processing
                                </span>

                            </div>


                            <div
                                className={
                                    currentStep >= 4
                                        ? "tracking-line active"
                                        : "tracking-line"
                                }
                            ></div>


                            {/* ===============================
                                SHIPPED
                            =============================== */}

                            <div
                                className={
                                    currentStep >= 4
                                        ? "tracking-step active"
                                        : "tracking-step"
                                }
                            >

                                <div className="tracking-circle">

                                    {currentStep >= 4
                                        ? "✓"
                                        : "4"}

                                </div>

                                <span>
                                    Shipped
                                </span>

                            </div>


                            <div
                                className={
                                    currentStep >= 5
                                        ? "tracking-line active"
                                        : "tracking-line"
                                }
                            ></div>


                            {/* ===============================
                                DELIVERED
                            =============================== */}

                            <div
                                className={
                                    currentStep >= 5
                                        ? "tracking-step active"
                                        : "tracking-step"
                                }
                            >

                                <div className="tracking-circle">

                                    {currentStep >= 5
                                        ? "✓"
                                        : "5"}

                                </div>

                                <span>
                                    Delivered
                                </span>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                ORDERED PRODUCTS
            ================================================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">
                        🌾 Ordered Products
                    </h4>


                    {order.orderItems?.map(
                        (item, index) => (

                            <div
                                className="order-detail-product"
                                key={index}
                            >

                                <div>

                                    <h6 className="fw-bold mb-1">

                                        {item.name ||
                                            item.product?.name ||
                                            "Product"}

                                    </h6>


                                    <small className="text-muted">

                                        Quantity:{" "}
                                        {item.quantity}

                                        {" × "}

                                        ₹{item.price}

                                    </small>

                                </div>


                                <strong className="text-success">

                                    ₹
                                    {Number(
                                        item.price || 0
                                    ) *
                                        Number(
                                            item.quantity || 0
                                        )}

                                </strong>

                            </div>

                        )
                    )}


                    <hr />


                    <div className="d-flex justify-content-between">

                        <span className="fw-bold">
                            Total Amount
                        </span>

                        <span className="fw-bold text-success fs-4">
                            ₹{order.totalAmount}
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            {order.deliveryAddress && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <h4 className="fw-bold mb-4">
                            🏠 Delivery Address
                        </h4>


                        <div className="delivery-address">

                            <h6 className="fw-bold">

                                {
                                    order
                                        .deliveryAddress
                                        .fullName
                                }

                            </h6>


                            <p className="mb-1">

                                📱{" "}

                                {
                                    order
                                        .deliveryAddress
                                        .mobile
                                }

                            </p>


                            <p className="mb-1">

                                {
                                    order
                                        .deliveryAddress
                                        .address
                                }

                            </p>


                            <p className="mb-0">

                                {
                                    order
                                        .deliveryAddress
                                        .city
                                }

                                ,{" "}

                                {
                                    order
                                        .deliveryAddress
                                        .state
                                }

                                {" - "}

                                {
                                    order
                                        .deliveryAddress
                                        .pincode
                                }

                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <div className="text-center mb-4">

                <Link
                    to="/my-orders"
                    className="btn btn-success"
                >
                    ← Back to My Orders
                </Link>

            </div>

        </div>
    );
}

export default OrderDetails;
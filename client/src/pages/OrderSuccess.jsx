import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const savedOrder =
            JSON.parse(
                localStorage.getItem("latestOrder")
            );

        if (savedOrder) {
            setOrder(savedOrder);
        }
    }, []);

    // =====================================================
    // NO ORDER DATA
    // =====================================================

    if (!order) {
        return (
            <div className="container py-5">
                <div className="text-center">

                    <div className="display-1 mb-3">
                        📦
                    </div>

                    <h2 className="fw-bold">
                        Order Information Not Found
                    </h2>

                    <p className="text-muted">
                        We could not find your recent order.
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

    return (
        <div className="container py-5">

            <div className="order-success-card">

                {/* SUCCESS ICON */}

                <div className="success-icon">
                    ✓
                </div>

                <h1 className="text-success fw-bold">
                    Order Placed Successfully!
                </h1>

                <p className="text-muted">
                    Thank you for shopping with Agri-Tech.
                </p>

                {/* ORDER ID */}

                <div className="order-id-box">

                    <span>
                        Order ID
                    </span>

                    <strong>
                        {order._id}
                    </strong>

                </div>

                {/* ORDER DETAILS */}

                <div className="row g-3 mt-4">

                    <div className="col-md-4">

                        <div className="info-box">

                            <small>
                                Total Items
                            </small>

                            <h5>
                                {order.totalItems}
                            </h5>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="info-box">

                            <small>
                                Total Amount
                            </small>

                            <h5 className="text-success">
                                ₹{order.totalAmount}
                            </h5>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="info-box">

                            <small>
                                Payment
                            </small>

                            <h5>
                                {order.paymentMethod}
                            </h5>

                        </div>

                    </div>

                </div>

                {/* STATUS */}

                <div className="status-box mt-4">

                    <span>
                        Order Status
                    </span>

                    <strong>
                        {order.orderStatus}
                    </strong>

                </div>

                {/* PRODUCTS */}

                <div className="text-start mt-4">

                    <h4 className="fw-bold mb-3">
                        Ordered Products
                    </h4>

                    {order.orderItems?.map(
                        (item, index) => (
                            <div
                                className="ordered-item"
                                key={index}
                            >

                                <div>
                                    <strong>
                                        {item.name}
                                    </strong>

                                    <small>
                                        Quantity:{" "}
                                        {item.quantity}
                                    </small>
                                </div>

                                <strong>
                                    ₹
                                    {Number(item.price) *
                                        Number(
                                            item.quantity
                                        )}
                                </strong>

                            </div>
                        )
                    )}

                </div>

                {/* DELIVERY ADDRESS */}

                {order.deliveryAddress && (
                    <div className="text-start mt-4">

                        <h4 className="fw-bold mb-3">
                            Delivery Address
                        </h4>

                        <div className="address-box">

                            <strong>
                                {
                                    order
                                        .deliveryAddress
                                        .fullName
                                }
                            </strong>

                            <p className="mb-1">
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
                                }{" "}
                                -{" "}
                                {
                                    order
                                        .deliveryAddress
                                        .pincode
                                }
                            </p>

                        </div>

                    </div>
                )}

                {/* BUTTONS */}

                <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">

                    <Link
                        to="/products"
                        className="btn btn-success"
                    >
                        🛍️ Continue Shopping
                    </Link>

                    <Link
                        to="/my-orders"
                        className="btn btn-outline-success"
                    >
                        📦 My Orders
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default OrderSuccess;
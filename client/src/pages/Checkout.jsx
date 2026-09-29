import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [error, setError] = useState("");

    // =====================================================
    // LOAD CART
    // =====================================================

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (savedCart.length === 0) {
            navigate("/cart");
            return;
        }

        setCart(savedCart);
    }, [navigate]);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    const totalAmount = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 1),
        0
    );

    // =====================================================
    // TOTAL ITEMS
    // =====================================================

    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        setError("");

        // =================================================
        // VALIDATION
        // =================================================

        if (
            !formData.fullName.trim() ||
            !formData.mobile.trim() ||
            !formData.address.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.pincode.trim()
        ) {
            setError(
                "Please fill all delivery details."
            );

            return;
        }

        if (formData.mobile.length !== 10) {
            setError(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }

        if (formData.pincode.length !== 6) {
            setError(
                "Please enter a valid 6-digit PIN code."
            );

            return;
        }

        // =================================================
        // GET TOKEN
        // =================================================

        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                "Authorization token not found. Please login again."
            );

            navigate("/login");

            return;
        }

        // =================================================
        // PREPARE ORDER ITEMS
        // =================================================

        const orderItems = cart.map((item) => ({
            product: item._id,
            name: item.name,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            unit: item.unit || "",
        }));

        // =================================================
        // ORDER DATA
        // =================================================

        const orderData = {
            orderItems,

            totalItems,

            totalAmount,

            deliveryAddress: {
                fullName: formData.fullName,
                mobile: formData.mobile,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
            },

            paymentMethod: "Cash on Delivery",
        };

        try {
            // =================================================
            // SEND ORDER TO BACKEND
            // =================================================

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(orderData),
                }
            );

            const data = await response.json();

            // =================================================
            // ERROR RESPONSE
            // =================================================

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to place order."
                );

                return;
            }

            // =================================================
            // SAVE LATEST ORDER
            // =================================================

            localStorage.setItem(
                "latestOrder",
                JSON.stringify(data.order)
            );

            // =================================================
            // CLEAR CART
            // =================================================

            localStorage.removeItem("cart");

            setCart([]);

            // =================================================
            // SUCCESS
            // =================================================

            navigate("/order-success");

        } catch (error) {
            console.error(
                "Place Order Error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );
        }
    };
    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center">

                <div className="display-1 mb-3">
                    🛒
                </div>

                <h2 className="fw-bold">
                    Your Cart is Empty
                </h2>

                <p className="text-muted">
                    Please add products before checkout.
                </p>

                <Link
                    to="/products"
                    className="btn btn-success"
                >
                    🛍️ Browse Products
                </Link>

            </div>
        );
    }

    // =====================================================
    // CHECKOUT PAGE
    // =====================================================

    return (
        <div className="container py-4 checkout-page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-4">

                <h1 className="fw-bold text-success">
                    💳 Checkout
                </h1>

                <p className="text-muted mb-0">
                    Enter your delivery details and
                    review your order.
                </p>

            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handlePlaceOrder}>

                <div className="row g-4">

                    {/* ================================================= */}
                    {/* DELIVERY DETAILS */}
                    {/* ================================================= */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h4 className="fw-bold mb-4">
                                    📍 Delivery Details
                                </h4>

                                {/* Full Name */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                        value={
                                            formData.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {/* Mobile */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        className="form-control"
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength="10"
                                        value={
                                            formData.mobile
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );

                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    mobile:
                                                        value,
                                                })
                                            );
                                        }}
                                    />

                                </div>

                                {/* Address */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        className="form-control"
                                        rows="3"
                                        placeholder="House / Farm address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    ></textarea>

                                </div>

                                <div className="row">

                                    {/* City */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            City / Village
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            placeholder="City / Village"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                    {/* State */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            placeholder="State"
                                            value={
                                                formData.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                                {/* Pincode */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        PIN Code
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        className="form-control"
                                        placeholder="6-digit PIN code"
                                        maxLength="6"
                                        value={
                                            formData.pincode
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );

                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    pincode:
                                                        value,
                                                })
                                            );
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ORDER SUMMARY */}
                    {/* ================================================= */}

                    <div className="col-lg-5">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h4 className="fw-bold mb-4">
                                    🧾 Order Summary
                                </h4>

                                {/* Products */}

                                <div className="checkout-products">

                                    {cart.map(
                                        (item) => (

                                            <div
                                                key={
                                                    item._id
                                                }
                                                className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3"
                                            >

                                                <div>

                                                    <h6 className="fw-bold mb-1">
                                                        {
                                                            item.name
                                                        }
                                                    </h6>

                                                    <small className="text-muted">
                                                        ₹
                                                        {
                                                            item.price
                                                        }{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </small>

                                                </div>

                                                <span className="fw-semibold">
                                                    ₹
                                                    {
                                                        Number(
                                                            item.price
                                                        ) *
                                                        Number(
                                                            item.quantity
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                                {/* Total Items */}

                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Total Items
                                    </span>

                                    <span className="fw-semibold">
                                        {
                                            totalItems
                                        }
                                    </span>

                                </div>

                                <hr />

                                {/* Total */}

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <span className="fw-bold fs-5">
                                        Total Amount
                                    </span>

                                    <span className="text-success fw-bold fs-3">
                                        ₹
                                        {
                                            totalAmount
                                        }
                                    </span>

                                </div>

                                {/* Payment Method */}

                                <div className="alert alert-success">

                                    <strong>
                                        💵 Payment Method
                                    </strong>

                                    <br />

                                    <small>
                                        Cash on Delivery
                                        will be available
                                        for this order.
                                    </small>

                                </div>

                                {/* Place Order */}

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 py-3 fw-bold"
                                >
                                    📦 Place Order
                                </button>

                                {/* Back Cart */}

                                <Link
                                    to="/cart"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                >
                                    ← Back to Cart
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </form>

        </div>
    );
}

export default Checkout;
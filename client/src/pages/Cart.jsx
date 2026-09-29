import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);

    // =====================================================
    // LOAD CART
    // =====================================================

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);
    }, []);

    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const updateQuantity = (id, change) => {
        const updatedCart = cart
            .map((item) => {
                if (item._id === id) {
                    const currentQuantity =
                        Number(item.quantity) || 1;

                    const newQuantity =
                        currentQuantity + change;

                    if (newQuantity <= 0) {
                        return null;
                    }

                    return {
                        ...item,
                        quantity: newQuantity,
                    };
                }

                return item;
            })
            .filter(Boolean);

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    // =====================================================
    // REMOVE PRODUCT
    // =====================================================

    const removeFromCart = (id) => {
        const updatedCart = cart.filter(
            (item) => item._id !== id
        );

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    // =====================================================
    // CLEAR CART
    // =====================================================

    const clearCart = () => {
        setCart([]);

        localStorage.removeItem("cart");
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
    // EMPTY CART
    // =====================================================

    if (cart.length === 0) {
        return (
            <div className="container py-5">

                <div className="text-center">

                    <div className="display-1 mb-3">
                        🛒
                    </div>

                    <h2 className="fw-bold">
                        Your Cart is Empty
                    </h2>

                    <p className="text-muted">
                        Add some agricultural products
                        to your cart.
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
    // CART PAGE
    // =====================================================

    return (
        <div className="container py-4">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1 className="fw-bold text-success">
                        🛒 Shopping Cart
                    </h1>

                    <p className="text-muted mb-0">
                        Review your selected agricultural
                        products
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={clearCart}
                >
                    🗑️ Clear Cart
                </button>

            </div>

            {/* ================================================= */}
            {/* CART + SUMMARY */}
            {/* ================================================= */}

            <div className="row g-4">

                {/* ================================================= */}
                {/* CART PRODUCTS */}
                {/* ================================================= */}

                <div className="col-lg-8">

                    {cart.map((item) => (

                        <div
                            className="card border-0 shadow-sm mb-3"
                            key={item._id}
                        >

                            <div className="card-body">

                                <div className="row align-items-center g-3">

                                    {/* ================================================= */}
                                    {/* IMAGE */}
                                    {/* ================================================= */}

                                    <div className="col-md-2">

                                        <div className="cart-image-container">

                                            <img
                                                src={`/products/${item.name
                                                    ?.toLowerCase()
                                                    .trim()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )}.jpg`}
                                                alt={item.name}
                                                className="cart-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* ================================================= */}
                                    {/* PRODUCT INFO */}
                                    {/* ================================================= */}

                                    <div className="col-md-4">

                                        <span className="badge bg-success-subtle text-success mb-2">

                                            {item.category}

                                        </span>

                                        <h5 className="fw-bold mb-1">

                                            {item.name}

                                        </h5>

                                        <p className="text-muted small mb-0">

                                            {item.description}

                                        </p>

                                    </div>

                                    {/* ================================================= */}
                                    {/* PRICE */}
                                    {/* ================================================= */}

                                    <div className="col-md-2">

                                        <span className="text-muted small">
                                            Price
                                        </span>

                                        <h5 className="text-success fw-bold mb-0">

                                            ₹{item.price}

                                        </h5>

                                        <small className="text-muted">

                                            / {item.unit}

                                        </small>

                                    </div>

                                    {/* ================================================= */}
                                    {/* QUANTITY */}
                                    {/* ================================================= */}

                                    <div className="col-md-2">

                                        <span className="text-muted small d-block mb-1">

                                            Quantity

                                        </span>

                                        <div className="d-flex align-items-center">

                                            {/* MINUS */}

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item._id,
                                                        -1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            {/* QUANTITY */}

                                            <span className="mx-3 fw-bold">

                                                {item.quantity}

                                            </span>

                                            {/* PLUS */}

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item._id,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    {/* ================================================= */}
                                    {/* REMOVE */}
                                    {/* ================================================= */}

                                    <div className="col-md-2 text-md-end">

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                removeFromCart(
                                                    item._id
                                                )
                                            }
                                        >
                                            🗑️ Remove
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ================================================= */}
                {/* ORDER SUMMARY */}
                {/* ================================================= */}

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                Order Summary
                            </h4>

                            {/* PRODUCTS */}

                            <div className="d-flex justify-content-between mb-3">

                                <span className="text-muted">
                                    Products
                                </span>

                                <span className="fw-semibold">

                                    {cart.length}

                                </span>

                            </div>

                            {/* TOTAL ITEMS */}

                            <div className="d-flex justify-content-between mb-3">

                                <span className="text-muted">
                                    Total Items
                                </span>

                                <span className="fw-semibold">

                                    {totalItems}

                                </span>

                            </div>

                            <hr />

                            {/* TOTAL */}

                            <div className="d-flex justify-content-between mb-4">

                                <span className="fw-bold">
                                    Total Amount
                                </span>

                                <span className="text-success fw-bold fs-4">

                                    ₹{totalAmount}

                                </span>

                            </div>

                            {/* ================================================= */}
                            {/* CHECKOUT */}
                            {/* ================================================= */}

                            <Link
                                to="/checkout"
                                className="btn btn-success w-100"
                            >
                                💳 Proceed to Checkout
                            </Link>

                            {/* ================================================= */}
                            {/* CONTINUE SHOPPING */}
                            {/* ================================================= */}

                            <Link
                                to="/products"
                                className="btn btn-outline-success w-100 mt-2"
                            >
                                ← Continue Shopping
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cart;
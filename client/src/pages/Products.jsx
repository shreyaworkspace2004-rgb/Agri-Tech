import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view products.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const productData =
                response.data.products || [];

            setProducts(productData);
            setFilteredProducts(productData);
        } catch (err) {
            console.error("Products Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {
        fetchProducts();
    }, []);

    // =====================================================
    // SEARCH + CATEGORY FILTER
    // =====================================================

    useEffect(() => {
        let result = [...products];

        // Search filter
        if (search.trim() !== "") {
            result = result.filter((product) =>
                product.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Category filter
        if (category !== "All") {
            result = result.filter(
                (product) =>
                    product.category === category
            );
        }

        setFilteredProducts(result);
    }, [search, category, products]);

    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = (product) => {
        try {
            const existingCart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

            const existingProduct =
                existingCart.find(
                    (item) =>
                        item._id === product._id
                );

            let updatedCart;

            if (existingProduct) {
                updatedCart = existingCart.map(
                    (item) =>
                        item._id === product._id
                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1,
                            }
                            : item
                );
            } else {
                updatedCart = [
                    ...existingCart,
                    {
                        ...product,
                        quantity: 1,
                    },
                ];
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
            );

            alert(
                `${product.name} added to cart 🛒`
            );
        } catch (error) {
            console.error(
                "Add To Cart Error:",
                error
            );
        }
    };

    // =====================================================
    // PRODUCT IMAGE CLASS
    // =====================================================

    const getProductImageClass = (product) => {
        if (!product?.name) {
            return "product-placeholder";
        }

        return `product-placeholder product-image-${product.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    };

    // =====================================================
    // PRODUCT IMAGE PATH
    // =====================================================

    const getProductImagePath = (product) => {
        const imageMap = {
            "Agricultural Water Pump":
                "/products/agricultural-water-pump.jpg",

            "Manual Sprayer":
                "/products/manual-sprayer.jpg",

            "Bio Pesticide":
                "/products/bio-pesticide.jpg",

            "Neem Based Pesticide":
                "/products/neem-based-pesticide.jpg",

            "Organic Pesticide":
                "/products/organic-pesticide.jpg",

            "Potash Fertilizer":
                "/products/potash-fertilizer.jpg",

            "DAP Fertilizer":
                "/products/dap-fertilizer.jpg",

            "Urea Fertilizer":
                "/products/urea-fertilizer.jpg",

            "NPK Fertilizer":
                "/products/npk-fertilizer.jpg",

            "Tomato Seeds":
                "/products/tomato-seeds.jpg",

            "Rice Seeds":
                "/products/rice-seeds.jpg",

            "Soybean Seeds":
                "/products/soybean-seeds.jpg",

            "Cotton Seeds":
                "/products/cotton-seeds.jpg",

            "Wheat Seeds":
                "/products/wheat-seeds.jpg",
        };

        return imageMap[product?.name] || "";
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

                <p className="mt-3">
                    Loading products...
                </p>

            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="container-fluid py-4 products-page">

            <div className="container">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                    <div>

                        <h1 className="fw-bold text-success mb-1">
                            🛒 Agricultural Products
                        </h1>

                        <p className="text-muted mb-0">
                            Seeds, fertilizers, pesticides
                            and farming equipment
                        </p>

                    </div>

                    <Link
                        to="/cart"
                        className="btn btn-success"
                    >
                        🛒 View Cart
                    </Link>

                </div>

                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* ================================================= */}
                {/* SEARCH + FILTER */}
                {/* ================================================= */}

                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-body">

                        <div className="row g-3">

                            {/* Search */}

                            <div className="col-md-7">

                                <label className="form-label fw-semibold">
                                    Search Products
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search seeds, fertilizers, pesticides..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            {/* Category */}

                            <div className="col-md-5">

                                <label className="form-label fw-semibold">
                                    Category
                                </label>

                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="All">
                                        All Categories
                                    </option>

                                    <option value="Seeds">
                                        🌱 Seeds
                                    </option>

                                    <option value="Fertilizers">
                                        🧪 Fertilizers
                                    </option>

                                    <option value="Pesticides">
                                        🐛 Pesticides
                                    </option>

                                    <option value="Equipment">
                                        🚜 Equipment
                                    </option>

                                    <option value="Other">
                                        📦 Other
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================================================= */}
                {/* PRODUCT COUNT */}
                {/* ================================================= */}

                <div className="mb-3">

                    <span className="text-muted">

                        Showing{" "}

                        <strong>
                            {filteredProducts.length}
                        </strong>{" "}

                        products

                    </span>

                </div>

                {/* ================================================= */}
                {/* NO PRODUCTS / PRODUCTS GRID */}
                {/* ================================================= */}

                {filteredProducts.length === 0 ? (

                    <div className="card border-0 shadow-sm text-center py-5">

                        <div className="card-body">

                            <div className="display-4 mb-3">
                                📦
                            </div>

                            <h4>
                                No products found
                            </h4>

                            <p className="text-muted">
                                Try another search or category.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {filteredProducts.map((product) => (

                            <div
                                className="col-sm-6 col-lg-4 col-xl-3"
                                key={product._id}
                            >

                                {/* ================================================= */}
                                {/* PRODUCT CARD */}
                                {/* ================================================= */}

                                <div className="card h-100 shadow-sm border-0 product-card">

                                    {/* ================================================= */}
                                    {/* PRODUCT IMAGE */}
                                    {/* ================================================= */}
                                    <div className="product-image-container">
                                        <img
                                            src={getProductImagePath(product)}
                                            alt={product.name}
                                            className="product-image"
                                            onError={(e) => {
                                                console.log(
                                                    "Image not found:",
                                                    e.currentTarget.src
                                                );
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    </div>

                                    {/* ================================================= */}
                                    {/* PRODUCT BODY */}
                                    {/* ================================================= */}

                                    <div className="card-body d-flex flex-column">

                                        {/* CSS fallback image */}

                                        <div
                                            className={getProductImageClass(product)}
                                            style={{
                                                display: "none",
                                            }}
                                        ></div>

                                        {/* Category */}

                                        <span className="badge bg-success-subtle text-success align-self-start mb-2">

                                            {product.category}

                                        </span>

                                        {/* Product Name */}

                                        <h5 className="card-title fw-bold">

                                            {product.name}

                                        </h5>

                                        {/* Description */}

                                        <p className="card-text text-muted small">

                                            {product.description}

                                        </p>

                                        {/* ================================================= */}
                                        {/* PRICE / STOCK / SUPPLIER */}
                                        {/* ================================================= */}

                                        <div className="mt-auto">

                                            {/* Price */}

                                            <h4 className="text-success fw-bold">

                                                ₹{product.price}

                                                <small className="text-muted fs-6">
                                                    {" "}
                                                    / {product.unit}
                                                </small>

                                            </h4>

                                            {/* Stock */}

                                            <p className="small mb-2">

                                                {product.stock > 0 ? (

                                                    <span className="text-success">

                                                        ✓ {product.stock}{" "}
                                                        {product.unit}{" "}
                                                        available

                                                    </span>

                                                ) : (

                                                    <span className="text-danger">

                                                        Out of Stock

                                                    </span>

                                                )}

                                            </p>

                                            {/* Supplier */}

                                            {product.supplierName && (

                                                <p className="small text-muted mb-3">

                                                    Supplier:{" "}
                                                    {product.supplierName}

                                                </p>

                                            )}

                                            {/* Add To Cart */}

                                            <button
                                                type="button"
                                                className="btn btn-success w-100"
                                                disabled={
                                                    product.stock <= 0
                                                }
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >

                                                🛒 Add to Cart

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Products;
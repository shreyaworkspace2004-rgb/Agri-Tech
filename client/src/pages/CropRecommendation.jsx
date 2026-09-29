import React, { useState } from "react";
import axios from "axios";

function CropRecommendation() {
    const [formData, setFormData] = useState({
        soilType: "Black Soil",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        ph: "",
        temperature: "",
        humidity: "",
        rainfall: "",
    });

    const [recommendation, setRecommendation] = useState(null);
    const [fertilizerRecommendation, setFertilizerRecommendation] =
        useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // GET CROP RECOMMENDATION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setRecommendation(null);
        setFertilizerRecommendation(null);

        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                "Please login again. Authentication token not found."
            );
            return;
        }

        if (!formData.soilType) {
            setError("Please select soil type.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/crop-recommendations",
                {
                    soilType: formData.soilType,
                    nitrogen: Number(formData.nitrogen),
                    phosphorus: Number(formData.phosphorus),
                    potassium: Number(formData.potassium),
                    ph: Number(formData.ph),
                    temperature: Number(formData.temperature),
                    humidity: Number(formData.humidity),
                    rainfall: Number(formData.rainfall),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSuccess(
                    "Crop recommendation generated successfully! 🌱"
                );

                setRecommendation(
                    response.data.recommendations || []
                );

                setFertilizerRecommendation(
                    response.data.fertilizerRecommendation || null
                );
            }
        } catch (err) {
            console.error(
                "Crop Recommendation Error:",
                err
            );

            if (
                err.response?.data?.message ===
                "jwt expired"
            ) {
                setError(
                    "Your session has expired. Please logout and login again."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to generate crop recommendation."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            soilType: "Black Soil",
            nitrogen: "",
            phosphorus: "",
            potassium: "",
            ph: "",
            temperature: "",
            humidity: "",
            rainfall: "",
        });

        setRecommendation(null);
        setFertilizerRecommendation(null);
        setError("");
        setSuccess("");
    };

    // ==========================================
    // FORMAT CROP RECOMMENDATION
    // ==========================================

    const getCropData = (item) => {
        if (typeof item === "string") {
            try {
                return JSON.parse(item);
            } catch {
                return {
                    crop: item,
                    score: null,
                    reason: "",
                };
            }
        }

        return item || {};
    };

    // ==========================================
    // SCORE COLOR / LABEL
    // ==========================================

    const getScoreClass = (score) => {
        if (score >= 80) {
            return "bg-success";
        }

        if (score >= 60) {
            return "bg-primary";
        }

        if (score >= 40) {
            return "bg-warning text-dark";
        }

        return "bg-secondary";
    };

    // ==========================================
    // CROP ICON
    // ==========================================

    const getCropIcon = (cropName) => {
        const crop = String(cropName || "").toLowerCase();

        if (crop.includes("rice")) return "🌾";
        if (crop.includes("wheat")) return "🌾";
        if (crop.includes("cotton")) return "🌱";
        if (crop.includes("soybean")) return "🫘";
        if (crop.includes("tomato")) return "🍅";
        if (crop.includes("potato")) return "🥔";
        if (crop.includes("sugarcane")) return "🎋";
        if (crop.includes("maize")) return "🌽";
        if (crop.includes("corn")) return "🌽";
        if (crop.includes("onion")) return "🧅";
        if (crop.includes("groundnut")) return "🥜";

        return "🌱";
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="container py-4">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className="p-4 rounded-4 shadow-sm mb-4"
                style={{
                    background:
                        "linear-gradient(135deg, #e8f5e9, #ffffff)",
                    borderLeft: "6px solid #198754",
                }}
            >
                <h1 className="fw-bold text-success mb-2">
                    🌱 Crop Recommendation
                </h1>

                <p className="text-muted mb-0">
                    Enter your soil and environmental information
                    to get suitable crop and fertilizer recommendations.
                </p>
            </div>

            {/* ==========================================
                ALERTS
            ========================================== */}

            {error && (
                <div className="alert alert-danger shadow-sm">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success shadow-sm text-center">
                    {success}
                </div>
            )}

            {/* ==========================================
                FORM
            ========================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        🧪 Enter Soil & Weather Details
                    </h3>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* SOIL TYPE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Soil Type *
                                </label>

                                <select
                                    name="soilType"
                                    value={formData.soilType}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="Black Soil">
                                        Black Soil
                                    </option>

                                    <option value="Red Soil">
                                        Red Soil
                                    </option>

                                    <option value="Alluvial Soil">
                                        Alluvial Soil
                                    </option>

                                    <option value="Laterite Soil">
                                        Laterite Soil
                                    </option>

                                    <option value="Sandy Soil">
                                        Sandy Soil
                                    </option>

                                    <option value="Loamy Soil">
                                        Loamy Soil
                                    </option>

                                    <option value="Clay Soil">
                                        Clay Soil
                                    </option>
                                </select>

                            </div>

                            {/* NITROGEN */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Nitrogen (N)
                                </label>

                                <input
                                    type="number"
                                    name="nitrogen"
                                    value={formData.nitrogen}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter nitrogen value"
                                />

                            </div>

                            {/* PHOSPHORUS */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Phosphorus (P)
                                </label>

                                <input
                                    type="number"
                                    name="phosphorus"
                                    value={formData.phosphorus}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter phosphorus value"
                                />

                            </div>

                            {/* POTASSIUM */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Potassium (K)
                                </label>

                                <input
                                    type="number"
                                    name="potassium"
                                    value={formData.potassium}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter potassium value"
                                />

                            </div>

                            {/* SOIL PH */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Soil pH
                                </label>

                                <input
                                    type="number"
                                    name="ph"
                                    value={formData.ph}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    max="14"
                                    step="0.01"
                                    placeholder="Example: 7"
                                />

                            </div>

                            {/* TEMPERATURE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Temperature (°C)
                                </label>

                                <input
                                    type="number"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    className="form-control"
                                    step="0.01"
                                    placeholder="Example: 25"
                                />

                            </div>

                            {/* HUMIDITY */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Humidity (%)
                                </label>

                                <input
                                    type="number"
                                    name="humidity"
                                    value={formData.humidity}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="Example: 70"
                                />

                            </div>

                            {/* RAINFALL */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Rainfall (mm)
                                </label>

                                <input
                                    type="number"
                                    name="rainfall"
                                    value={formData.rainfall}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Example: 100"
                                />

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="mt-4 d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={loading}
                            >
                                {loading
                                    ? "⏳ Generating..."
                                    : "🌱 Get Recommendation"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={resetForm}
                            >
                                Reset
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            {/* ==========================================
                CROP RECOMMENDATION RESULT
            ========================================== */}

            {recommendation &&
                recommendation.length > 0 && (

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div>
                                    <h3 className="fw-bold text-success mb-1">
                                        🌾 Recommended Crops
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Suitable crops based on your
                                        soil and environmental conditions.
                                    </p>
                                </div>

                                <span className="badge bg-success px-3 py-2">
                                    {recommendation.length} Recommendations
                                </span>

                            </div>

                            <div className="row g-3">

                                {recommendation.map(
                                    (item, index) => {

                                        const cropData =
                                            getCropData(item);

                                        const cropName =
                                            cropData.crop ||
                                            cropData.cropName ||
                                            "Recommended Crop";

                                        const score =
                                            cropData.score;

                                        const reason =
                                            cropData.reason ||
                                            "Suitable based on the provided conditions.";

                                        return (

                                            <div
                                                className="col-md-6 col-lg-4"
                                                key={index}
                                            >

                                                <div
                                                    className="card h-100 border-0 shadow-sm"
                                                    style={{
                                                        borderRadius:
                                                            "16px",
                                                        overflow:
                                                            "hidden",
                                                    }}
                                                >

                                                    {/* CARD HEADER */}

                                                    <div
                                                        className="p-3"
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, #e8f5e9, #ffffff)",
                                                            borderBottom:
                                                                "1px solid #d8eadf",
                                                        }}
                                                    >

                                                        <div className="d-flex justify-content-between align-items-center">

                                                            <div className="fs-2">
                                                                {getCropIcon(
                                                                    cropName
                                                                )}
                                                            </div>

                                                            <span className="badge bg-success">
                                                                #{index + 1}
                                                            </span>

                                                        </div>

                                                        <h4 className="fw-bold text-success mt-2 mb-0 text-capitalize">
                                                            {cropName}
                                                        </h4>

                                                    </div>

                                                    {/* CARD BODY */}

                                                    <div className="card-body">

                                                        {/* SCORE */}

                                                        {score !==
                                                            undefined &&
                                                            score !==
                                                            null && (

                                                                <div className="mb-3">

                                                                    <div className="d-flex justify-content-between align-items-center mb-1">

                                                                        <span className="fw-semibold">
                                                                            Suitability
                                                                            Score
                                                                        </span>

                                                                        <span
                                                                            className={`badge ${getScoreClass(
                                                                                Number(
                                                                                    score
                                                                                )
                                                                            )}`}
                                                                        >
                                                                            {score}
                                                                            /100
                                                                        </span>

                                                                    </div>

                                                                    <div
                                                                        className="progress"
                                                                        style={{
                                                                            height:
                                                                                "8px",
                                                                        }}
                                                                    >

                                                                        <div
                                                                            className={`progress-bar ${getScoreClass(
                                                                                Number(
                                                                                    score
                                                                                )
                                                                            )}`}
                                                                            role="progressbar"
                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    Math.max(
                                                                                        Number(
                                                                                            score
                                                                                        ),
                                                                                        0
                                                                                    ),
                                                                                    100
                                                                                )}%`,
                                                                            }}
                                                                        ></div>

                                                                    </div>

                                                                </div>

                                                            )}

                                                        {/* REASON */}

                                                        <div
                                                            className="p-3 rounded-3"
                                                            style={{
                                                                background:
                                                                    "#f8f9fa",
                                                            }}
                                                        >

                                                            <small className="text-muted fw-semibold">
                                                                💡 Why this
                                                                crop?
                                                            </small>

                                                            <p className="mb-0 mt-1">
                                                                {reason}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </div>
                )}

            {/* ==========================================
                FERTILIZER RECOMMENDATION
            ========================================== */}

            {fertilizerRecommendation && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body p-4">

                        <div className="d-flex align-items-center mb-3">

                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#e3f2fd",
                                    fontSize: "24px",
                                }}
                            >
                                🧪
                            </div>

                            <div>
                                <h3 className="fw-bold text-primary mb-0">
                                    Fertilizer Recommendation
                                </h3>

                                <small className="text-muted">
                                    Based on your NPK soil values
                                </small>
                            </div>

                        </div>

                        <div
                            className="p-3 rounded-3"
                            style={{
                                background:
                                    "linear-gradient(135deg, #e3f2fd, #f8fbff)",
                                border:
                                    "1px solid #b6d9f2",
                            }}
                        >

                            {Array.isArray(
                                fertilizerRecommendation
                            ) ? (

                                <ul className="mb-0">

                                    {fertilizerRecommendation.map(
                                        (item, index) => (

                                            <li
                                                key={index}
                                                className="mb-2"
                                            >
                                                {typeof item ===
                                                    "string"
                                                    ? item
                                                    : JSON.stringify(
                                                        item
                                                    )}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : typeof fertilizerRecommendation ===
                                "string" ? (

                                <p className="mb-0">
                                    🌱 {fertilizerRecommendation}
                                </p>

                            ) : (

                                <pre
                                    className="mb-0"
                                    style={{
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {JSON.stringify(
                                        fertilizerRecommendation,
                                        null,
                                        2
                                    )}
                                </pre>

                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default CropRecommendation;
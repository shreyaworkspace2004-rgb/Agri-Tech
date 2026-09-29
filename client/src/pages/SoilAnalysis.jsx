import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function SoilAnalysis() {

    const [searchParams] = useSearchParams();

    const filter = searchParams.get("filter") || "all";

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        fieldName: "",
        soilType: "",
        ph: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        moisture: "",
        temperature: "",
        season: "Kharif",
    });

    // ============================================
    // FILTER SOIL ANALYSIS
    // ============================================

    const filteredAnalyses = analyses.filter((analysis) => {

        if (filter === "good") {
            return (
                analysis.soilHealth === "Good" ||
                analysis.soilHealth === "Excellent"
            );
        }

        if (filter === "poor") {
            return analysis.soilHealth === "Poor";
        }

        return true;
    });

    // ============================================
    // FILTER TITLE
    // ============================================

    const getFilterTitle = () => {

        if (filter === "good") {
            return "🟢 Good / Excellent Soil";
        }

        if (filter === "poor") {
            return "🔴 Poor Soil";
        }

        return "🌱 All Soil Analyses";
    };

    // ============================================
    // FETCH SOIL ANALYSIS
    // ============================================

    const fetchSoilAnalysis = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/soil-analysis",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAnalyses(
                response.data.analyses || []
            );

        } catch (error) {
            console.error(
                "Soil Analysis Error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load soil analysis data."
            );

        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // LOAD SOIL ANALYSIS ON PAGE LOAD
    // ============================================

    useEffect(() => {
        fetchSoilAnalysis();
    }, []);

    // ============================================
    // FORM CHANGE
    // ============================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // ============================================
    // RESET FORM
    // ============================================

    const resetForm = () => {

        setFormData({
            fieldName: "",
            soilType: "",
            ph: "",
            nitrogen: "",
            phosphorus: "",
            potassium: "",
            moisture: "",
            temperature: "",
            season: "Kharif",
        });

        setEditingId(null);
        setShowForm(false);
    };

    // ============================================
    // SMART RECOMMENDATIONS
    // ============================================

    const generateRecommendations = () => {

        const ph = Number(formData.ph);
        const nitrogen = Number(formData.nitrogen);
        const phosphorus = Number(formData.phosphorus);
        const potassium = Number(formData.potassium);

        let score = 0;

        // pH
        if (ph >= 6 && ph <= 7.5) {

            score += 25;

        } else if (ph >= 5.5 && ph <= 8) {

            score += 15;
        }

        // Nitrogen
        if (nitrogen >= 40) {

            score += 20;

        } else if (nitrogen >= 20) {

            score += 12;
        }

        // Phosphorus
        if (phosphorus >= 20) {

            score += 20;

        } else if (phosphorus >= 10) {

            score += 12;
        }

        // Potassium
        if (potassium >= 40) {

            score += 20;

        } else if (potassium >= 20) {

            score += 12;
        }

        let soilHealth = "Poor";

        if (score >= 75) {

            soilHealth = "Excellent";

        } else if (score >= 55) {

            soilHealth = "Good";

        } else if (score >= 35) {

            soilHealth = "Moderate";
        }

        // Fertilizer recommendation
        const fertilizerSuggestions = [];

        if (nitrogen < 20) {

            fertilizerSuggestions.push(
                "Nitrogen-rich fertilizer"
            );
        }

        if (phosphorus < 10) {

            fertilizerSuggestions.push(
                "Phosphorus fertilizer"
            );
        }

        if (potassium < 20) {

            fertilizerSuggestions.push(
                "Potassium fertilizer"
            );
        }

        let fertilizerRecommendation =
            "Maintain balanced fertilizer application and monitor soil regularly.";

        if (fertilizerSuggestions.length > 0) {

            fertilizerRecommendation =
                "Consider: " +
                fertilizerSuggestions.join(", ") +
                ".";
        }

        // Crop recommendation
        let suitableCrops = [];

        if (formData.season === "Kharif") {

            suitableCrops = [
                "Rice",
                "Soybean",
                "Maize",
            ];

        } else if (formData.season === "Rabi") {

            suitableCrops = [
                "Wheat",
                "Gram",
                "Mustard",
            ];

        } else {

            suitableCrops = [
                "Tomato",
                "Cotton",
                "Groundnut",
            ];
        }

        if (ph < 6) {

            suitableCrops.push("Potato");
        }

        if (ph > 7.5) {

            suitableCrops.push("Barley");
        }

        return {
            soilHealth,
            fertilizerRecommendation,
            suitableCrops: [
                ...new Set(suitableCrops),
            ],
        };
    };

    // ============================================
    // SUBMIT - ADD / UPDATE
    // ============================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.fieldName ||
            !formData.soilType ||
            !formData.ph ||
            !formData.nitrogen ||
            !formData.phosphorus ||
            !formData.potassium ||
            !formData.moisture ||
            !formData.temperature
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }

        const ph = Number(formData.ph);
        const moisture = Number(formData.moisture);

        if (ph < 0 || ph > 14) {

            setError(
                "pH must be between 0 and 14."
            );

            return;
        }

        if (moisture < 0 || moisture > 100) {

            setError(
                "Moisture must be between 0% and 100%."
            );

            return;
        }

        try {

            setSaving(true);

            const recommendations =
                generateRecommendations();

            // Get logged-in user
            const storedUser =
                localStorage.getItem("user");

            let farmer = "";

            if (storedUser) {

                try {

                    const user =
                        JSON.parse(storedUser);

                    farmer =
                        user._id ||
                        user.id ||
                        "";

                } catch (error) {

                    console.error(
                        "User parsing error:",
                        error
                    );
                }
            }

            if (!farmer) {

                setError(
                    "User information not found. Please login again."
                );

                setSaving(false);

                return;
            }

            const data = {

                farmer,

                fieldName:
                    formData.fieldName,

                soilType:
                    formData.soilType,

                ph:
                    Number(formData.ph),

                nitrogen:
                    Number(formData.nitrogen),

                phosphorus:
                    Number(formData.phosphorus),

                potassium:
                    Number(formData.potassium),

                moisture:
                    Number(formData.moisture),

                temperature:
                    Number(formData.temperature),

                season:
                    formData.season,

                soilHealth:
                    recommendations.soilHealth,

                fertilizerRecommendation:
                    recommendations.fertilizerRecommendation,

                suitableCrops:
                    recommendations.suitableCrops,
            };

            if (editingId) {

                await axios.put(
                    `http://localhost:5000/api/soil-analysis/${editingId}`,
                    data
                );

                setSuccess(
                    "Soil analysis updated successfully! ✏️"
                );

            } else {

                await axios.post(
                    "http://localhost:5000/api/soil-analysis",
                    data
                );

                setSuccess(
                    "Soil analysis added successfully! 🌱"
                );
            }

            resetForm();

            fetchSoilAnalysis();

        } catch (error) {

            console.error(
                "Save Soil Analysis Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save soil analysis."
            );

        } finally {

            setSaving(false);
        }
    };

    // ============================================
    // EDIT
    // ============================================

    const handleEdit = (analysis) => {

        setEditingId(analysis._id);

        setFormData({

            fieldName:
                analysis.fieldName || "",

            soilType:
                analysis.soilType || "",

            ph:
                analysis.ph ?? "",

            nitrogen:
                analysis.nitrogen ?? "",

            phosphorus:
                analysis.phosphorus ?? "",

            potassium:
                analysis.potassium ?? "",

            moisture:
                analysis.moisture ?? "",

            temperature:
                analysis.temperature ?? "",

            season:
                analysis.season || "Kharif",
        });

        setShowForm(true);

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ============================================
    // DELETE
    // ============================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this soil analysis?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await axios.delete(
                `http://localhost:5000/api/soil-analysis/${id}`
            );

            setSuccess(
                "Soil analysis deleted successfully! 🗑️"
            );

            fetchSoilAnalysis();

        } catch (error) {

            console.error(
                "Delete Soil Analysis Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete soil analysis."
            );
        }
    };

    // ============================================
    // HEALTH BADGE
    // ============================================

    const getHealthBadge = (health) => {

        if (health === "Excellent") {
            return "bg-success";
        }

        if (health === "Good") {
            return "bg-primary";
        }

        if (health === "Moderate") {
            return "bg-warning text-dark";
        }

        return "bg-danger";
    };

    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="container py-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold text-success">
                        🌱 Soil Analysis
                    </h2>

                    <p className="text-muted mb-0">
                        Analyze soil health and get smart
                        farming recommendations.
                    </p>

                </div>

                <button
                    className="btn btn-success"
                    onClick={() => {

                        setEditingId(null);
                        setShowForm(true);
                        setError("");
                        setSuccess("");

                    }}
                >
                    + Add Soil Analysis
                </button>

            </div>


            {/* FILTER INFORMATION */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="fw-bold mb-1">
                                {getFilterTitle()}
                            </h5>

                            <p className="text-muted mb-0">

                                Showing{" "}

                                <strong>
                                    {filteredAnalyses.length}
                                </strong>

                                {" "}soil analysis record(s).

                            </p>

                        </div>

                        {filter !== "all" && (

                            <a
                                href="/soil-analysis?filter=all"
                                className="btn btn-outline-success btn-sm"
                            >
                                View All
                            </a>

                        )}

                    </div>

                </div>

            </div>


            {/* SUCCESS */}

            {success && (

                <div className="alert alert-success">

                    {success}

                </div>
            )}


            {/* ERROR */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>
            )}


            {/* FORM */}

            {showForm && (

                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">

                            {editingId
                                ? "✏️ Edit Soil Analysis"
                                : "🌱 Add Soil Analysis"}

                        </h5>

                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={resetForm}
                        >
                            ✕
                        </button>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">

                                {/* FIELD */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Field Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="fieldName"
                                        className="form-control"
                                        placeholder="Example: Main Farm"
                                        value={formData.fieldName}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* SOIL TYPE */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Soil Type *
                                    </label>

                                    <select
                                        name="soilType"
                                        className="form-select"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Soil Type
                                        </option>

                                        <option value="Black Soil">
                                            Black Soil
                                        </option>

                                        <option value="Red Soil">
                                            Red Soil
                                        </option>

                                        <option value="Alluvial Soil">
                                            Alluvial Soil
                                        </option>

                                        <option value="Loamy Soil">
                                            Loamy Soil
                                        </option>

                                        <option value="Sandy Soil">
                                            Sandy Soil
                                        </option>

                                        <option value="Clay Soil">
                                            Clay Soil
                                        </option>

                                    </select>

                                </div>


                                {/* PH */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Soil pH *
                                    </label>

                                    <input
                                        type="number"
                                        name="ph"
                                        className="form-control"
                                        min="0"
                                        max="14"
                                        step="0.1"
                                        value={formData.ph}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* N */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Nitrogen (N) *
                                    </label>

                                    <input
                                        type="number"
                                        name="nitrogen"
                                        className="form-control"
                                        min="0"
                                        value={formData.nitrogen}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* P */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Phosphorus (P) *
                                    </label>

                                    <input
                                        type="number"
                                        name="phosphorus"
                                        className="form-control"
                                        min="0"
                                        value={formData.phosphorus}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* K */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Potassium (K) *
                                    </label>

                                    <input
                                        type="number"
                                        name="potassium"
                                        className="form-control"
                                        min="0"
                                        value={formData.potassium}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* MOISTURE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Soil Moisture (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="moisture"
                                        className="form-control"
                                        min="0"
                                        max="100"
                                        value={formData.moisture}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* TEMPERATURE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Soil Temperature (°C)
                                    </label>

                                    <input
                                        type="number"
                                        name="temperature"
                                        className="form-control"
                                        value={formData.temperature}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* SEASON */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Season *
                                    </label>

                                    <select
                                        name="season"
                                        className="form-select"
                                        value={formData.season}
                                        onChange={handleChange}
                                    >

                                        <option value="Kharif">
                                            Kharif
                                        </option>

                                        <option value="Rabi">
                                            Rabi
                                        </option>

                                        <option value="Summer">
                                            Summer
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="mt-4">

                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Soil Analysis"
                                            : "Save Soil Analysis"}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="mt-2 text-muted">
                        Loading soil analysis...
                    </p>

                </div>

            ) : filteredAnalyses.length === 0 ? (

                <div className="card shadow-sm border-0">

                    <div className="card-body text-center py-5">

                        <div style={{ fontSize: "60px" }}>
                            🌱
                        </div>

                        <h4 className="fw-bold mt-3">

                            {filter === "all"
                                ? "No Soil Analysis Found"
                                : filter === "good"
                                    ? "No Good / Excellent Soil Found"
                                    : "No Poor Soil Found"}

                        </h4>

                        <p className="text-muted">

                            {filter === "all"
                                ? "Add your first soil analysis to start monitoring soil health."
                                : filter === "good"
                                    ? "There are currently no Good or Excellent soil records."
                                    : "There are currently no Poor soil records."}

                        </p>

                        <button
                            className="btn btn-success"
                            onClick={() => setShowForm(true)}
                        >
                            + Add Soil Analysis
                        </button>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {filteredAnalyses.map((analysis) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={analysis._id}
                        >

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-start">

                                        <div>

                                            <h5 className="fw-bold text-success">
                                                🌾 {analysis.fieldName}
                                            </h5>

                                            <p className="text-muted mb-2">
                                                {analysis.soilType}
                                            </p>

                                        </div>

                                        <span
                                            className={`badge ${getHealthBadge(
                                                analysis.soilHealth
                                            )}`}
                                        >
                                            {analysis.soilHealth}
                                        </span>

                                    </div>


                                    <hr />


                                    {/* PARAMETERS */}

                                    <div className="row text-center g-2">

                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    pH
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.ph}
                                                </div>

                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    N
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.nitrogen}
                                                </div>

                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    P
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.phosphorus}
                                                </div>

                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    K
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.potassium}
                                                </div>

                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    Moisture
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.moisture}%
                                                </div>

                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="border rounded p-2">

                                                <small className="text-muted">
                                                    Temp
                                                </small>

                                                <div className="fw-bold">
                                                    {analysis.temperature}°C
                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* SEASON */}

                                    <div className="mt-3">

                                        <strong>
                                            Season:
                                        </strong>{" "}

                                        {analysis.season}

                                    </div>


                                    {/* FERTILIZER */}

                                    {analysis.fertilizerRecommendation && (

                                        <div className="alert alert-warning mt-3 mb-0">

                                            <strong>
                                                🌿 Fertilizer Recommendation
                                            </strong>

                                            <div className="mt-1">
                                                {analysis.fertilizerRecommendation}
                                            </div>

                                        </div>

                                    )}


                                    {/* CROPS */}

                                    {analysis.suitableCrops &&
                                        analysis.suitableCrops.length > 0 && (

                                            <div className="mt-3">

                                                <strong>
                                                    🌾 Suitable Crops
                                                </strong>

                                                <div className="mt-2">

                                                    {analysis.suitableCrops.map(
                                                        (crop, index) => (

                                                            <span
                                                                key={index}
                                                                className="badge bg-light text-success border me-1 mb-1"
                                                            >
                                                                {crop}
                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}


                                    {/* EDIT DELETE */}

                                    <div className="mt-4 d-flex gap-2">

                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                                handleEdit(analysis)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>


                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                handleDelete(
                                                    analysis._id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default SoilAnalysis;
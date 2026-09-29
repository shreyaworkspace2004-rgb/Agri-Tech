import React, { useEffect, useState } from "react";
import axios from "axios";

function FarmManagement() {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        farmer: "",
        farmName: "",
        village: "",
        district: "",
        state: "Maharashtra",
        pincode: "",
        area: "",
        areaUnit: "Acre",
        farmingType: "Conventional",
        soilType: "Other",
        irrigationSource: "Rainwater",
        waterAvailability: "Moderate",
        description: "",
    });

    const API_URL = "http://localhost:5000/api/farms";

    // ==============================
    // GET CURRENT USER
    // ==============================
    const getFarmerId = () => {
        try {
            const user =
                JSON.parse(localStorage.getItem("user")) ||
                JSON.parse(localStorage.getItem("currentUser"));

            return user?._id || user?.id || "";
        } catch {
            return "";
        }
    };

    // ==============================
    // FETCH FARMS
    // ==============================
    const fetchFarms = async () => {
        try {
            setLoading(true);
            setError("");

            const farmerId = getFarmerId();

            if (!farmerId) {
                setError(
                    "Farmer information not found. Please login again."
                );
                return;
            }

            const response = await axios.get(
                `${API_URL}/farmer/${farmerId}`
            );

            setFarms(response.data.farms || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load farms."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    // ==============================
    // INPUT CHANGE
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==============================
    // RESET FORM
    // ==============================
    const resetForm = () => {
        setFormData({
            farmer: getFarmerId(),
            farmName: "",
            village: "",
            district: "",
            state: "Maharashtra",
            pincode: "",
            area: "",
            areaUnit: "Acre",
            farmingType: "Conventional",
            soilType: "Other",
            irrigationSource: "Rainwater",
            waterAvailability: "Moderate",
            description: "",
        });

        setEditingId(null);
    };

    // ==============================
    // SUBMIT FARM
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const farmerId = getFarmerId();

        if (!farmerId) {
            setError(
                "Farmer information not found. Please login again."
            );
            return;
        }

        if (!formData.farmName.trim()) {
            setError("Please enter farm name.");
            return;
        }

        if (!formData.village.trim()) {
            setError("Please enter village.");
            return;
        }

        if (!formData.district.trim()) {
            setError("Please enter district.");
            return;
        }

        if (!formData.area || Number(formData.area) <= 0) {
            setError("Please enter a valid farm area.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                farmer: farmerId,

                farmName: formData.farmName,

                location: {
                    village: formData.village,
                    district: formData.district,
                    state: formData.state,
                    pincode: formData.pincode,
                },

                area: Number(formData.area),
                areaUnit: formData.areaUnit,
                farmingType: formData.farmingType,
                soilType: formData.soilType,
                irrigationSource: formData.irrigationSource,
                waterAvailability:
                    formData.waterAvailability,
                description: formData.description,
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    payload
                );

                setSuccess(
                    "Farm updated successfully! 🌾"
                );
            } else {
                await axios.post(API_URL, payload);

                setSuccess(
                    "Farm added successfully! 🌾"
                );
            }

            resetForm();
            await fetchFarms();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // EDIT FARM
    // ==============================
    const handleEdit = (farm) => {
        setEditingId(farm._id);

        setFormData({
            farmer: farm.farmer?._id || getFarmerId(),
            farmName: farm.farmName || "",

            village:
                farm.location?.village || "",

            district:
                farm.location?.district || "",

            state:
                farm.location?.state ||
                "Maharashtra",

            pincode:
                farm.location?.pincode || "",

            area:
                farm.area || "",

            areaUnit:
                farm.areaUnit || "Acre",

            farmingType:
                farm.farmingType ||
                "Conventional",

            soilType:
                farm.soilType || "Other",

            irrigationSource:
                farm.irrigationSource ||
                "Rainwater",

            waterAvailability:
                farm.waterAvailability ||
                "Moderate",

            description:
                farm.description || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==============================
    // DELETE FARM
    // ==============================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this farm?"
        );

        if (!confirmDelete) return;

        try {
            setError("");
            setSuccess("");

            await axios.delete(`${API_URL}/${id}`);

            setSuccess(
                "Farm deleted successfully."
            );

            await fetchFarms();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete farm."
            );
        }
    };

    return (
        <div className="container py-4">

            {/* ==============================
                HEADER
            ============================== */}

            <div
                className="p-4 rounded-4 shadow-sm mb-4"
                style={{
                    background:
                        "linear-gradient(135deg, #e8f5e9, #ffffff)",
                    borderLeft:
                        "6px solid #198754",
                }}
            >
                <h1
                    className="fw-bold text-success mb-2"
                >
                    🌾 Farm Management
                </h1>

                <p className="text-muted mb-0">
                    Create and manage your farm profile,
                    activities and agricultural resources.
                </p>
            </div>

            {/* ==============================
                ALERTS
            ============================== */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {/* ==============================
                FARM FORM
            ============================== */}

            <div className="card border-0 shadow-sm mb-5">
                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0">
                            {editingId
                                ? "✏️ Edit Farm"
                                : "➕ Add New Farm"}
                        </h3>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* FARM NAME */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Farm Name *
                                </label>

                                <input
                                    type="text"
                                    name="farmName"
                                    value={formData.farmName}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter farm name"
                                />
                            </div>

                            {/* VILLAGE */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Village *
                                </label>

                                <input
                                    type="text"
                                    name="village"
                                    value={formData.village}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter village"
                                />
                            </div>

                            {/* DISTRICT */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    District *
                                </label>

                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter district"
                                />
                            </div>

                            {/* STATE */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            {/* PINCODE */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter pincode"
                                />
                            </div>

                            {/* AREA */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Farm Area *
                                </label>

                                <input
                                    type="number"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter area"
                                />
                            </div>

                            {/* AREA UNIT */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Area Unit
                                </label>

                                <select
                                    name="areaUnit"
                                    value={formData.areaUnit}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Acre">
                                        Acre
                                    </option>

                                    <option value="Hectare">
                                        Hectare
                                    </option>
                                </select>
                            </div>

                            {/* FARMING TYPE */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Farming Type
                                </label>

                                <select
                                    name="farmingType"
                                    value={formData.farmingType}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Organic">
                                        Organic
                                    </option>

                                    <option value="Conventional">
                                        Conventional
                                    </option>

                                    <option value="Mixed">
                                        Mixed
                                    </option>
                                </select>
                            </div>

                            {/* SOIL TYPE */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Soil Type
                                </label>

                                <select
                                    name="soilType"
                                    value={formData.soilType}
                                    onChange={handleChange}
                                    className="form-select"
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

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* IRRIGATION */}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Irrigation Source
                                </label>

                                <select
                                    name="irrigationSource"
                                    value={
                                        formData.irrigationSource
                                    }
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Rainwater">
                                        Rainwater
                                    </option>

                                    <option value="Borewell">
                                        Borewell
                                    </option>

                                    <option value="Well">
                                        Well
                                    </option>

                                    <option value="Canal">
                                        Canal
                                    </option>

                                    <option value="Drip Irrigation">
                                        Drip Irrigation
                                    </option>

                                    <option value="Sprinkler">
                                        Sprinkler
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* WATER */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Water Availability
                                </label>

                                <select
                                    name="waterAvailability"
                                    value={
                                        formData.waterAvailability
                                    }
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Good">
                                        Good
                                    </option>

                                    <option value="Moderate">
                                        Moderate
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>
                                </select>
                            </div>

                            {/* DESCRIPTION */}

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Farm Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter farm details"
                                ></textarea>
                            </div>

                        </div>

                        {/* SUBMIT */}

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "💾 Update Farm"
                                        : "🌾 Add Farm"}
                            </button>

                        </div>

                    </form>
                </div>
            </div>

            {/* ==============================
                FARM LIST
            ============================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="fw-bold">
                    🌿 My Farms
                </h3>

                <span className="badge bg-success fs-6">
                    {farms.length} Farms
                </span>

            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="mt-2 text-muted">
                        Loading farms...
                    </p>
                </div>
            ) : farms.length === 0 ? (
                <div className="alert alert-info">
                    No farms added yet. Add your first farm
                    using the form above.
                </div>
            ) : (
                <div className="row g-4">

                    {farms.map((farm) => (
                        <div
                            className="col-md-6 col-xl-4"
                            key={farm._id}
                        >

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-start">

                                        <div>
                                            <h4 className="fw-bold text-success">
                                                🌾 {farm.farmName}
                                            </h4>

                                            <p className="text-muted mb-2">
                                                📍{" "}
                                                {farm.location?.village},{" "}
                                                {farm.location?.district}
                                            </p>
                                        </div>

                                        <span className="badge bg-success">
                                            Active
                                        </span>

                                    </div>

                                    <hr />

                                    <div className="row g-2">

                                        <div className="col-6">
                                            <small className="text-muted">
                                                Area
                                            </small>

                                            <div className="fw-semibold">
                                                {farm.area}{" "}
                                                {farm.areaUnit}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <small className="text-muted">
                                                Farming
                                            </small>

                                            <div className="fw-semibold">
                                                {farm.farmingType}
                                            </div>
                                        </div>

                                        <div className="col-6 mt-3">
                                            <small className="text-muted">
                                                Soil
                                            </small>

                                            <div className="fw-semibold">
                                                {farm.soilType}
                                            </div>
                                        </div>

                                        <div className="col-6 mt-3">
                                            <small className="text-muted">
                                                Irrigation
                                            </small>

                                            <div className="fw-semibold">
                                                {farm.irrigationSource}
                                            </div>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <small className="text-muted">
                                                Water Availability
                                            </small>

                                            <div className="fw-semibold">
                                                💧{" "}
                                                {farm.waterAvailability}
                                            </div>
                                        </div>

                                    </div>

                                    {farm.description && (
                                        <p className="text-muted mt-3 mb-0">
                                            {farm.description}
                                        </p>
                                    )}

                                    <div className="d-flex gap-2 mt-4">

                                        <button
                                            className="btn btn-outline-success btn-sm flex-fill"
                                            onClick={() =>
                                                handleEdit(farm)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm flex-fill"
                                            onClick={() =>
                                                handleDelete(
                                                    farm._id
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

export default FarmManagement;
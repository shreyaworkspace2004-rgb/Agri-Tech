import React, { useEffect, useState } from "react";
import axios from "axios";

function FarmActivities() {
    const [activities, setActivities] = useState([]);
    const [farms, setFarms] = useState([]);
    const [crops, setCrops] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const API_URL = "http://localhost:5000/api/farm-activities";
    const FARM_API = "http://localhost:5000/api/farms";
    const CROP_API = "http://localhost:5000/api/crops";

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

    const [formData, setFormData] = useState({
        farm: "",
        crop: "",
        activityType: "Ploughing",
        activityDate: new Date().toISOString().slice(0, 10),
        description: "",
        quantity: "",
        quantityUnit: "Kg",
        cost: "",
        notes: "",
    });

    // ==========================================
    // FETCH FARMS
    // ==========================================
    const fetchFarms = async () => {
        try {
            const farmerId = getFarmerId();

            if (!farmerId) {
                setError("Farmer information not found. Please login again.");
                return;
            }

            const response = await axios.get(
                `${FARM_API}/farmer/${farmerId}`
            );

            setFarms(response.data.farms || []);
        } catch (err) {
            console.error("Fetch Farms Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load farms."
            );
        }
    };

    // ==========================================
    // FETCH CROPS
    // ==========================================
    const fetchCrops = async () => {
        try {
            const farmerId = getFarmerId();

            if (!farmerId) return;

            const response = await axios.get(
                `${CROP_API}/farmer/${farmerId}`
            );

            setCrops(response.data.crops || []);
        } catch (err) {
            console.error("Fetch Crops Error:", err);

            // Crops are optional for an activity
            setCrops([]);
        }
    };

    // ==========================================
    // FETCH ACTIVITIES
    // ==========================================
    const fetchActivities = async () => {
        try {
            setLoading(true);
            setError("");

            const farmerId = getFarmerId();

            if (!farmerId) {
                setError("Farmer information not found. Please login again.");
                return;
            }

            const response = await axios.get(
                `${API_URL}/farmer/${farmerId}`
            );

            setActivities(response.data.activities || []);
        } catch (err) {
            console.error("Fetch Activities Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load farm activities."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    useEffect(() => {
        fetchFarms();
        fetchCrops();
        fetchActivities();
    }, []);

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
    // RESET FORM
    // ==========================================
    const resetForm = () => {
        setFormData({
            farm: "",
            crop: "",
            activityType: "Ploughing",
            activityDate: new Date().toISOString().slice(0, 10),
            description: "",
            quantity: "",
            quantityUnit: "Kg",
            cost: "",
            notes: "",
        });

        setEditingId(null);
    };

    // ==========================================
    // SUBMIT ACTIVITY
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const farmerId = getFarmerId();

        if (!farmerId) {
            setError("Farmer information not found. Please login again.");
            return;
        }

        if (!formData.farm) {
            setError("Please select a farm.");
            return;
        }

        if (!formData.activityType) {
            setError("Please select activity type.");
            return;
        }

        if (!formData.activityDate) {
            setError("Please select activity date.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                farmer: farmerId,
                farm: formData.farm,
                crop: formData.crop || null,
                activityType: formData.activityType,
                activityDate: formData.activityDate,
                description: formData.description,
                quantity: formData.quantity
                    ? Number(formData.quantity)
                    : undefined,
                quantityUnit: formData.quantityUnit,
                cost: formData.cost
                    ? Number(formData.cost)
                    : undefined,
                notes: formData.notes,
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    payload
                );

                setSuccess(
                    "Farm activity updated successfully! 🌾"
                );
            } else {
                await axios.post(API_URL, payload);

                setSuccess(
                    "Farm activity added successfully! 🌾"
                );
            }

            resetForm();

            await fetchActivities();
        } catch (err) {
            console.error("Save Activity Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save farm activity."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // EDIT ACTIVITY
    // ==========================================
    const handleEdit = (activity) => {
        setEditingId(activity._id);

        setFormData({
            farm: activity.farm?._id || "",
            crop: activity.crop?._id || "",
            activityType: activity.activityType || "Ploughing",
            activityDate: activity.activityDate
                ? new Date(activity.activityDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            description: activity.description || "",
            quantity: activity.quantity || "",
            quantityUnit: activity.quantityUnit || "Kg",
            cost: activity.cost || "",
            notes: activity.notes || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // DELETE ACTIVITY
    // ==========================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmDelete) return;

        try {
            setError("");
            setSuccess("");

            await axios.delete(`${API_URL}/${id}`);

            setSuccess(
                "Farm activity deleted successfully."
            );

            await fetchActivities();
        } catch (err) {
            console.error("Delete Activity Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete activity."
            );
        }
    };

    // ==========================================
    // DATE FORMAT
    // ==========================================
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

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
                    🚜 Farm Activity Management
                </h1>

                <p className="text-muted mb-0">
                    Record and manage your farming activities,
                    expenses and agricultural work.
                </p>
            </div>

            {/* ==========================================
                ALERTS
            ========================================== */}

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

            {/* ==========================================
                ACTIVITY FORM
            ========================================== */}

            <div className="card border-0 shadow-sm mb-5">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h3 className="fw-bold mb-0">
                            {editingId
                                ? "✏️ Edit Farm Activity"
                                : "➕ Add Farm Activity"}
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

                            {/* FARM */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Select Farm *
                                </label>

                                <select
                                    name="farm"
                                    value={formData.farm}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >

                                    <option value="">
                                        -- Select Farm --
                                    </option>

                                    {farms.map((farm) => (
                                        <option
                                            key={farm._id}
                                            value={farm._id}
                                        >
                                            {farm.farmName}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* CROP */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Select Crop
                                </label>

                                <select
                                    name="crop"
                                    value={formData.crop}
                                    onChange={handleChange}
                                    className="form-select"
                                >

                                    <option value="">
                                        -- Select Crop (Optional) --
                                    </option>

                                    {crops.map((crop) => (
                                        <option
                                            key={crop._id}
                                            value={crop._id}
                                        >
                                            {crop.cropName}
                                            {crop.cropType
                                                ? ` - ${crop.cropType}`
                                                : ""}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* ACTIVITY TYPE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Activity Type *
                                </label>

                                <select
                                    name="activityType"
                                    value={formData.activityType}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >

                                    <option value="Ploughing">
                                        🚜 Ploughing
                                    </option>

                                    <option value="Sowing">
                                        🌱 Sowing
                                    </option>

                                    <option value="Irrigation">
                                        💧 Irrigation
                                    </option>

                                    <option value="Fertilization">
                                        🧪 Fertilization
                                    </option>

                                    <option value="Pesticide Application">
                                        🐛 Pesticide Application
                                    </option>

                                    <option value="Weeding">
                                        🌿 Weeding
                                    </option>

                                    <option value="Harvesting">
                                        🌾 Harvesting
                                    </option>

                                    <option value="Other">
                                        📋 Other
                                    </option>

                                </select>

                            </div>

                            {/* DATE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Activity Date *
                                </label>

                                <input
                                    type="date"
                                    name="activityDate"
                                    value={formData.activityDate}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />

                            </div>

                            {/* QUANTITY */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter quantity"
                                />

                            </div>

                            {/* QUANTITY UNIT */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Quantity Unit
                                </label>

                                <select
                                    name="quantityUnit"
                                    value={formData.quantityUnit}
                                    onChange={handleChange}
                                    className="form-select"
                                >

                                    <option value="Kg">
                                        Kg
                                    </option>

                                    <option value="Quintal">
                                        Quintal
                                    </option>

                                    <option value="Liter">
                                        Liter
                                    </option>

                                    <option value="Bag">
                                        Bag
                                    </option>

                                    <option value="Ton">
                                        Ton
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                            {/* COST */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Cost (₹)
                                </label>

                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter cost"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Describe the farming activity"
                                ></textarea>

                            </div>

                            {/* NOTES */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Additional notes"
                                ></textarea>

                            </div>

                        </div>

                        {/* SUBMIT BUTTON */}

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "💾 Update Activity"
                                        : "🚜 Add Activity"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

            {/* ==========================================
                ACTIVITY LIST
            ========================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="fw-bold">
                    📋 Farm Activities
                </h3>

                <span className="badge bg-success fs-6">
                    {activities.length} Activities
                </span>

            </div>

            {loading ? (

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="mt-2 text-muted">
                        Loading activities...
                    </p>

                </div>

            ) : activities.length === 0 ? (

                <div className="alert alert-info">
                    No farm activities added yet.
                    Add your first activity using the form above.
                </div>

            ) : (

                <div className="row g-4">

                    {activities.map((activity) => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={activity._id}
                        >

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-start">

                                        <h4 className="fw-bold text-success">
                                            🚜 {activity.activityType}
                                        </h4>

                                        <span className="badge bg-success">
                                            Completed
                                        </span>

                                    </div>

                                    <hr />

                                    <p className="mb-2">
                                        <strong>🌾 Farm:</strong>{" "}
                                        {activity.farm?.farmName ||
                                            "Unknown Farm"}
                                    </p>

                                    <p className="mb-2">
                                        <strong>🌱 Crop:</strong>{" "}
                                        {activity.crop?.cropName ||
                                            "Not specified"}
                                    </p>

                                    <p className="mb-2">
                                        <strong>📅 Date:</strong>{" "}
                                        {formatDate(
                                            activity.activityDate
                                        )}
                                    </p>

                                    {activity.quantity !==
                                        undefined &&
                                        activity.quantity !==
                                        null && (
                                            <p className="mb-2">
                                                <strong>
                                                    📦 Quantity:
                                                </strong>{" "}
                                                {activity.quantity}{" "}
                                                {activity.quantityUnit}
                                            </p>
                                        )}

                                    {activity.cost !==
                                        undefined &&
                                        activity.cost !==
                                        null && (
                                            <p className="mb-2">
                                                <strong>
                                                    💰 Cost:
                                                </strong>{" "}
                                                ₹
                                                {activity.cost}
                                            </p>
                                        )}

                                    {activity.description && (
                                        <p className="text-muted mt-3">
                                            {activity.description}
                                        </p>
                                    )}

                                    {activity.notes && (
                                        <p className="text-muted">
                                            <strong>
                                                Notes:
                                            </strong>{" "}
                                            {activity.notes}
                                        </p>
                                    )}

                                    <div className="d-flex gap-2 mt-4">

                                        <button
                                            className="btn btn-outline-success btn-sm flex-fill"
                                            onClick={() =>
                                                handleEdit(activity)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm flex-fill"
                                            onClick={() =>
                                                handleDelete(
                                                    activity._id
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

export default FarmActivities;
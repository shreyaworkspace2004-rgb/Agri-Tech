import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        farmName: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // FETCH PROFILE
    // =====================================================

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your profile.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/profile",
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
                    "Unable to load profile."
                );
                return;
            }

            setProfile(data.user);

            setFormData({
                name: data.user.name || "",
                email: data.user.email || "",
                mobile: data.user.mobile || "",
                address: data.user.address || "",
                city: data.user.city || "",
                state: data.user.state || "",
                pincode: data.user.pincode || "",
                farmName: data.user.farmName || "",
            });

        } catch (error) {
            console.error(
                "Profile Error:",
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
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {
        fetchProfile();
    }, []);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to update your profile."
                );
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        mobile: formData.mobile,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        farmName: formData.farmName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to update profile."
                );
                return;
            }

            setProfile(data.user);

            setFormData({
                name: data.user.name || "",
                email: data.user.email || "",
                mobile: data.user.mobile || "",
                address: data.user.address || "",
                city: data.user.city || "",
                state: data.user.state || "",
                pincode: data.user.pincode || "",
                farmName: data.user.farmName || "",
            });

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {
            console.error(
                "Update Profile Error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {
            setSaving(false);
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
                    Loading profile...
                </p>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error && !profile) {
        return (
            <div className="container py-5">

                <div className="alert alert-danger text-center">
                    {error}
                </div>

                <div className="text-center">

                    <Link
                        to="/dashboard"
                        className="btn btn-success"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </div>
        );
    }

    // =====================================================
    // PROFILE PAGE
    // =====================================================

    return (
        <div className="container py-4 profile-page">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1 className="fw-bold text-success">
                        👤 My Profile
                    </h1>

                    <p className="text-muted mb-0">
                        View and update your personal information
                    </p>

                </div>

                <Link
                    to="/dashboard"
                    className="btn btn-outline-success"
                >
                    ← Dashboard
                </Link>

            </div>

            {/* SUCCESS MESSAGE */}

            {success && (
                <div className="alert alert-success">
                    ✅ {success}
                </div>
            )}

            {/* ERROR MESSAGE */}

            {error && (
                <div className="alert alert-danger">
                    ❌ {error}
                </div>
            )}

            <div className="row g-4">

                {/* PROFILE SUMMARY */}

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm profile-summary-card">

                        <div className="card-body text-center">

                            <div className="profile-avatar">
                                {formData.name
                                    ? formData.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "👤"}
                            </div>

                            <h3 className="fw-bold mt-3">
                                {formData.name ||
                                    "Farmer"}
                            </h3>

                            <p className="text-muted">
                                {formData.email}
                            </p>

                            <span className="badge bg-success">
                                🌾 {profile?.role || "farmer"}
                            </span>

                            <hr />

                            <div className="text-start">

                                <p className="mb-2">
                                    <strong>
                                        📱 Mobile:
                                    </strong>{" "}
                                    {formData.mobile ||
                                        "Not added"}
                                </p>

                                <p className="mb-2">
                                    <strong>
                                        🌾 Farm:
                                    </strong>{" "}
                                    {formData.farmName ||
                                        "Not added"}
                                </p>

                                <p className="mb-0">
                                    <strong>
                                        📍 City:
                                    </strong>{" "}
                                    {formData.city ||
                                        "Not added"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* PROFILE FORM */}

                <div className="col-lg-8">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            <h4 className="fw-bold mb-4">
                                ✏️ Personal Information
                            </h4>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                {/* NAME + EMAIL */}

                                <div className="row g-3">

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            value={
                                                formData.email
                                            }
                                            disabled
                                        />

                                        <small className="text-muted">
                                            Email cannot be changed here.
                                        </small>

                                    </div>

                                    {/* MOBILE */}

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            className="form-control"
                                            value={
                                                formData.mobile
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter mobile number"
                                        />

                                    </div>

                                    {/* FARM NAME */}

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Farm Name
                                        </label>

                                        <input
                                            type="text"
                                            name="farmName"
                                            className="form-control"
                                            value={
                                                formData.farmName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter farm name"
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="col-12">

                                        <label className="form-label fw-semibold">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your address"
                                        ></textarea>

                                    </div>

                                    {/* CITY */}

                                    <div className="col-md-4">

                                        <label className="form-label fw-semibold">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="City"
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
                                            className="form-control"
                                            value={
                                                formData.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="State"
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
                                            className="form-control"
                                            value={
                                                formData.pincode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Pincode"
                                        />

                                    </div>

                                </div>

                                {/* SAVE BUTTON */}

                                <div className="d-flex justify-content-end mt-4">

                                    <button
                                        type="submit"
                                        className="btn btn-success px-4"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                💾 Save Changes
                                            </>
                                        )}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";

function Settings() {
    // =====================================================
    // SETTINGS STATES
    // =====================================================

    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState("English");
    const [theme, setTheme] = useState("Light");
    const [message, setMessage] = useState("");

    // =====================================================
    // CHANGE PASSWORD STATES
    // =====================================================

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem(
            "settings",
            JSON.stringify({
                notifications,
                emailNotifications,
                language,
                theme,
            })
        );

        setMessage(
            "Settings saved successfully."
        );
    };

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setPasswordError(
                "Please fill all password fields."
            );

            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters."
            );

            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New password and confirm password do not match."
            );

            return;
        }

        // ---------------------------------------------
        // TOKEN
        // ---------------------------------------------

        const token =
            localStorage.getItem("token");

        if (!token) {
            setPasswordError(
                "Please login again."
            );

            return;
        }

        try {
            setPasswordLoading(true);

            // -----------------------------------------
            // CHANGE PASSWORD API
            // -----------------------------------------

            const response = await fetch(
                "http://localhost:5000/api/profile/change-password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        currentPassword:
                            currentPassword,

                        newPassword:
                            newPassword,

                        confirmPassword:
                            confirmPassword,
                    }),
                }
            );

            const data =
                await response.json();

            // -----------------------------------------
            // ERROR RESPONSE
            // -----------------------------------------

            if (!response.ok) {
                setPasswordError(
                    data.message ||
                    "Unable to change password."
                );

                return;
            }

            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            setPasswordMessage(
                data.message ||
                "Password changed successfully."
            );

            // Clear fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error(
                "Change Password Error:",
                error
            );

            setPasswordError(
                "Unable to connect to server."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="container py-4 settings-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1 className="fw-bold text-success">
                        ⚙️ Settings
                    </h1>

                    <p className="text-muted mb-0">
                        Manage your Agri-Tech application settings
                    </p>

                </div>

                <Link
                    to="/dashboard"
                    className="btn btn-outline-success"
                >
                    ← Dashboard
                </Link>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
                <div className="alert alert-success">
                    ✅ {message}
                </div>
            )}

            {/* =================================================
                SETTINGS GRID
            ================================================= */}

            <div className="row g-4">

                {/* =================================================
                    ACCOUNT SETTINGS
                ================================================= */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                👤 Account Settings
                            </h4>

                            {/* PROFILE */}

                            <div className="settings-item">

                                <div>

                                    <strong>
                                        Profile
                                    </strong>

                                    <small className="d-block text-muted">
                                        Update your personal information
                                    </small>

                                </div>

                                <Link
                                    to="/profile"
                                    className="btn btn-outline-success btn-sm"
                                >
                                    Edit Profile
                                </Link>

                            </div>

                            <hr />

                            {/* PASSWORD */}

                            <div className="settings-item">

                                <div>

                                    <strong>
                                        Password
                                    </strong>

                                    <small className="d-block text-muted">
                                        Change your account password
                                    </small>

                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => {

                                        setShowPasswordForm(
                                            !showPasswordForm
                                        );

                                        setPasswordMessage("");
                                        setPasswordError("");
                                    }}
                                >
                                    {showPasswordForm
                                        ? "Close"
                                        : "Change"}
                                </button>

                            </div>

                            {/* =================================================
                                CHANGE PASSWORD FORM
                            ================================================= */}

                            {showPasswordForm && (

                                <div className="mt-4 p-3 border rounded">

                                    <h5 className="fw-bold mb-3">
                                        🔐 Change Password
                                    </h5>

                                    {/* SUCCESS */}

                                    {passwordMessage && (

                                        <div className="alert alert-success">

                                            ✅{" "}
                                            {passwordMessage}

                                        </div>

                                    )}

                                    {/* ERROR */}

                                    {passwordError && (

                                        <div className="alert alert-danger">

                                            ❌{" "}
                                            {passwordError}

                                        </div>

                                    )}

                                    <form
                                        onSubmit={
                                            handleChangePassword
                                        }
                                    >

                                        {/* CURRENT PASSWORD */}

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">

                                                Current Password

                                            </label>

                                            <input
                                                type="password"
                                                className="form-control"
                                                value={
                                                    currentPassword
                                                }
                                                onChange={(e) =>
                                                    setCurrentPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter current password"
                                                autoComplete="current-password"
                                            />

                                        </div>

                                        {/* NEW PASSWORD */}

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">

                                                New Password

                                            </label>

                                            <input
                                                type="password"
                                                className="form-control"
                                                value={
                                                    newPassword
                                                }
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                            />

                                            <small className="text-muted">

                                                Minimum 6 characters

                                            </small>

                                        </div>

                                        {/* CONFIRM PASSWORD */}

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">

                                                Confirm New Password

                                            </label>

                                            <input
                                                type="password"
                                                className="form-control"
                                                value={
                                                    confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                            />

                                        </div>

                                        {/* SUBMIT */}

                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={
                                                passwordLoading
                                            }
                                        >

                                            {passwordLoading
                                                ? "Changing..."
                                                : "🔐 Change Password"}

                                        </button>

                                    </form>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

                {/* =================================================
                    NOTIFICATION SETTINGS
                ================================================= */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                🔔 Notifications
                            </h4>

                            {/* PUSH NOTIFICATIONS */}

                            <div className="settings-toggle">

                                <div>

                                    <strong>
                                        Push Notifications
                                    </strong>

                                    <small className="d-block text-muted">
                                        Receive important alerts
                                    </small>

                                </div>

                                <div className="form-check form-switch">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                            notifications
                                        }
                                        onChange={(e) =>
                                            setNotifications(
                                                e.target.checked
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <hr />

                            {/* EMAIL NOTIFICATIONS */}

                            <div className="settings-toggle">

                                <div>

                                    <strong>
                                        Email Notifications
                                    </strong>

                                    <small className="d-block text-muted">
                                        Receive updates through email
                                    </small>

                                </div>

                                <div className="form-check form-switch">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                            emailNotifications
                                        }
                                        onChange={(e) =>
                                            setEmailNotifications(
                                                e.target.checked
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    APPEARANCE
                ================================================= */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                🎨 Appearance
                            </h4>

                            <label className="form-label fw-semibold">
                                Theme
                            </label>

                            <select
                                className="form-select"
                                value={theme}
                                onChange={(e) =>
                                    setTheme(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Light">
                                    ☀️ Light
                                </option>

                                <option value="Dark">
                                    🌙 Dark
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    LANGUAGE
                ================================================= */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                🌐 Language
                            </h4>

                            <label className="form-label fw-semibold">
                                Select Language
                            </label>

                            <select
                                className="form-select"
                                value={language}
                                onChange={(e) =>
                                    setLanguage(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="English">
                                    English
                                </option>

                                <option value="Marathi">
                                    मराठी
                                </option>

                                <option value="Hindi">
                                    हिन्दी
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                SAVE BUTTON
            ================================================= */}

            <div className="card border-0 shadow-sm mt-4">

                <div className="card-body text-center">

                    <button
                        type="button"
                        className="btn btn-success px-5"
                        onClick={handleSave}
                    >
                        💾 Save Settings
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;
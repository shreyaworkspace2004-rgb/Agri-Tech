import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

function PestAlerts() {
    const { t } = useTranslation();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        cropName: "",
        pestName: "",
        diseaseName: "",
        symptoms: "",
        riskLevel: "Low",
        prevention: "",
        treatment: "",
        affectedSeason: "",
    });

    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    // =====================================================
    // LANGUAGE
    // =====================================================

    const getLanguage = () => {
        if (i18n.language === "mr") return "mr";
        if (i18n.language === "hi") return "hi";
        return "en";
    };

    // =====================================================
    // CROP TRANSLATIONS
    // Database values remain English
    // =====================================================

    const cropTranslations = {
        Wheat: {
            mr: "गहू",
            hi: "गेहूं",
        },
        Rice: {
            mr: "तांदूळ",
            hi: "चावल",
        },
        Onion: {
            mr: "कांदा",
            hi: "प्याज़",
        },
        Tomato: {
            mr: "टोमॅटो",
            hi: "टमाटर",
        },
        Potato: {
            mr: "बटाटा",
            hi: "आलू",
        },
        Sugarcane: {
            mr: "ऊस",
            hi: "गन्ना",
        },
        Soybean: {
            mr: "सोयाबीन",
            hi: "सोयाबीन",
        },
        Cotton: {
            mr: "कापूस",
            hi: "कपास",
        },
        Maize: {
            mr: "मका",
            hi: "मक्का",
        },
        Groundnut: {
            mr: "भुईमूग",
            hi: "मूंगफली",
        },
        Tur: {
            mr: "तूर",
            hi: "अरहर",
        },
        Gram: {
            mr: "हरभरा",
            hi: "चना",
        },
        Jowar: {
            mr: "ज्वारी",
            hi: "ज्वार",
        },
        Bajra: {
            mr: "बाजरी",
            hi: "बाजरा",
        },
        Barley: {
            mr: "जव",
            hi: "जौ",
        },
    };

    // =====================================================
    // PEST TRANSLATIONS
    // =====================================================

    const pestTranslations = {
        Aphids: {
            mr: "मावा",
            hi: "माहू",
        },
        Whitefly: {
            mr: "पांढरी माशी",
            hi: "सफेद मक्खी",
        },
        "Stem Borer": {
            mr: "खोडकिडा",
            hi: "तना छेदक",
        },
        "Fruit Borer": {
            mr: "फळ पोखरणारी अळी",
            hi: "फल छेदक",
        },
        "Leaf Miner": {
            mr: "पान पोखरणारी अळी",
            hi: "पत्ती सुरंगक",
        },
        "Thrips": {
            mr: "फुलकिडे",
            hi: "थ्रिप्स",
        },
        "Bollworm": {
            mr: "बोंडअळी",
            hi: "बॉलवर्म",
        },
        "Fall Armyworm": {
            mr: "लष्करी अळी",
            hi: "फॉल आर्मीवर्म",
        },
        "Red Spider Mite": {
            mr: "लाल कोळी",
            hi: "लाल मकड़ी",
        },
        "Mealybug": {
            mr: "पिठ्या ढेकूण",
            hi: "मिलीबग",
        },
        "White Grub": {
            mr: "हुमणी",
            hi: "सफेद गिडार",
        },
        "Termite": {
            mr: "वाळवी",
            hi: "दीमक",
        },
        "Cutworm": {
            mr: "तुडतुडा अळी",
            hi: "कटवर्म",
        },
        "Pod Borer": {
            mr: "शेंगा पोखरणारी अळी",
            hi: "फली छेदक",
        },
    };

    // =====================================================
    // DISEASE TRANSLATIONS
    // =====================================================

    const diseaseTranslations = {
        "Powdery Mildew": {
            mr: "भुरी रोग",
            hi: "चूर्णी फफूंदी",
        },
        "Downy Mildew": {
            mr: "केवडा रोग",
            hi: "मृदुरोमिल फफूंदी",
        },
        "Leaf Blight": {
            mr: "पान करपा",
            hi: "पत्ती झुलसा रोग",
        },
        "Early Blight": {
            mr: "अर्ली ब्लाइट",
            hi: "अर्ली ब्लाइट",
        },
        "Late Blight": {
            mr: "लेट ब्लाइट",
            hi: "लेट ब्लाइट",
        },
        "Bacterial Wilt": {
            mr: "जिवाणूजन्य मर",
            hi: "जीवाणु मुरझान",
        },
        "Fungal Wilt": {
            mr: "बुरशीजन्य मर",
            hi: "फफूंद जनित मुरझान",
        },
        "Root Rot": {
            mr: "मुळकूज",
            hi: "जड़ सड़न",
        },
        "Anthracnose": {
            mr: "करपा रोग",
            hi: "एन्थ्रेक्नोज",
        },
        "Rust": {
            mr: "तांबेरा",
            hi: "रस्ट रोग",
        },
        "Mosaic Virus": {
            mr: "मोझॅक विषाणू रोग",
            hi: "मोज़ेक वायरस रोग",
        },
    };

    // =====================================================
    // SEASON TRANSLATIONS
    // =====================================================

    const seasonTranslations = {
        Kharif: {
            mr: "खरीप",
            hi: "खरीफ",
        },
        Rabi: {
            mr: "रब्बी",
            hi: "रबी",
        },
        Summer: {
            mr: "उन्हाळी",
            hi: "गर्मी",
        },
        Monsoon: {
            mr: "पावसाळा",
            hi: "मानसून",
        },
        Winter: {
            mr: "हिवाळा",
            hi: "सर्दी",
        },
        Rainy: {
            mr: "पावसाळी",
            hi: "बरसात",
        },
    };

    // =====================================================
    // LOCALIZED VALUE FUNCTION
    // =====================================================

    const getLocalizedValue = (value, dictionary) => {
        if (!value) return "";

        const language = getLanguage();

        if (language === "en") {
            return value;
        }

        return dictionary[value]?.[language] || value;
    };

    // =====================================================
    // LOCALIZED CROP
    // =====================================================

    const getLocalizedCrop = (cropName) => {
        return getLocalizedValue(cropName, cropTranslations);
    };

    // =====================================================
    // LOCALIZED PEST
    // =====================================================

    const getLocalizedPest = (pestName) => {
        return getLocalizedValue(pestName, pestTranslations);
    };

    // =====================================================
    // LOCALIZED DISEASE
    // =====================================================

    const getLocalizedDisease = (diseaseName) => {
        return getLocalizedValue(
            diseaseName,
            diseaseTranslations
        );
    };

    // =====================================================
    // LOCALIZED SEASON
    // =====================================================

    const getLocalizedSeason = (season) => {
        return getLocalizedValue(
            season,
            seasonTranslations
        );
    };

    // =====================================================
    // LOCALIZED RISK
    // =====================================================

    const translateRiskLevel = (risk) => {
        const language = getLanguage();

        if (language === "mr") {
            const values = {
                Low: "कमी",
                Medium: "मध्यम",
                High: "जास्त",
                Critical: "गंभीर",
            };

            return values[risk] || risk;
        }

        if (language === "hi") {
            const values = {
                Low: "कम",
                Medium: "मध्यम",
                High: "अधिक",
                Critical: "गंभीर",
            };

            return values[risk] || risk;
        }

        return risk;
    };

    // =====================================================
    // FETCH PEST ALERTS
    // =====================================================

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/pest-alerts",
                getAuthConfig()
            );

            setAlerts(response.data.alerts || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                t("pestAlerts.unableToFetch")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            cropName: "",
            pestName: "",
            diseaseName: "",
            symptoms: "",
            riskLevel: "Low",
            prevention: "",
            treatment: "",
            affectedSeason: "",
        });

        setEditingId(null);
    };

    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const handleAddClick = () => {
        resetForm();

        setSuccessMessage("");
        setError("");
        setShowForm(true);
    };

    // =====================================================
    // EDIT ALERT
    // =====================================================

    const handleEdit = (alert) => {
        setEditingId(alert._id);

        setFormData({
            cropName: alert.cropName || "",
            pestName: alert.pestName || "",
            diseaseName: alert.diseaseName || "",
            symptoms: alert.symptoms || "",
            riskLevel: alert.riskLevel || "Low",
            prevention: alert.prevention || "",
            treatment: alert.treatment || "",
            affectedSeason: alert.affectedSeason || "",
        });

        setSuccessMessage("");
        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // ADD / UPDATE ALERT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccessMessage("");

            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/pest-alerts/${editingId}`,
                    formData,
                    getAuthConfig()
                );

                setSuccessMessage(
                    t("pestAlerts.alertUpdated")
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/pest-alerts",
                    formData,
                    getAuthConfig()
                );

                setSuccessMessage(
                    t("pestAlerts.alertAdded")
                );
            }

            await fetchAlerts();

            resetForm();

            setTimeout(() => {
                setShowForm(false);
                setSuccessMessage("");
            }, 1500);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                t("pestAlerts.saveFailed")
            );
        } finally {
            setFormLoading(false);
        }
    };

    // =====================================================
    // DELETE ALERT
    // =====================================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            t("pestAlerts.confirmDelete")
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            await axios.delete(
                `http://localhost:5000/api/pest-alerts/${id}`,
                getAuthConfig()
            );

            setSuccessMessage(
                t("pestAlerts.alertDeleted")
            );

            await fetchAlerts();

            setTimeout(() => {
                setSuccessMessage("");
            }, 2000);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                t("pestAlerts.deleteFailed")
            );
        }
    };

    // =====================================================
    // CANCEL FORM
    // =====================================================

    const handleCancel = () => {
        setShowForm(false);

        resetForm();

        setSuccessMessage("");
        setError("");
    };

    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredAlerts = alerts.filter((alert) => {
        const searchText = search.toLowerCase().trim();

        const cropEnglish =
            alert.cropName?.toLowerCase() || "";

        const pestEnglish =
            alert.pestName?.toLowerCase() || "";

        const diseaseEnglish =
            alert.diseaseName?.toLowerCase() || "";

        const cropLocal =
            getLocalizedCrop(alert.cropName)
                .toLowerCase();

        const pestLocal =
            getLocalizedPest(alert.pestName)
                .toLowerCase();

        const diseaseLocal =
            getLocalizedDisease(alert.diseaseName)
                .toLowerCase();

        const matchesSearch =
            cropEnglish.includes(searchText) ||
            pestEnglish.includes(searchText) ||
            diseaseEnglish.includes(searchText) ||
            cropLocal.includes(searchText) ||
            pestLocal.includes(searchText) ||
            diseaseLocal.includes(searchText);

        const matchesRisk =
            riskFilter === "All" ||
            alert.riskLevel === riskFilter;

        return matchesSearch && matchesRisk;
    });

    // =====================================================
    // RISK BADGE
    // =====================================================

    const getRiskBadge = (risk) => {
        switch (risk) {
            case "Critical":
                return "bg-danger";

            case "High":
                return "bg-warning text-dark";

            case "Medium":
                return "bg-info text-dark";

            default:
                return "bg-success";
        }
    };

    // =====================================================
    // RETURN UI
    // =====================================================

    return (
        <div className="container py-4">

            {/* PAGE HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold text-success">
                        🐛 {t("pestAlerts.title")}
                    </h2>

                    <p className="text-muted mb-0">
                        {t("pestAlerts.description")}
                    </p>

                </div>

                <button
                    className="btn btn-success"
                    onClick={handleAddClick}
                >
                    ➕ {t("pestAlerts.addAlert")}
                </button>

            </div>

            {/* SUCCESS MESSAGE */}

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {/* ERROR MESSAGE */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ADD / EDIT FORM */}

            {showForm && (
                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-success text-white">

                        <h5 className="mb-0">

                            {editingId
                                ? `✏️ ${t("pestAlerts.editAlert")}`
                                : `➕ ${t("pestAlerts.addAlert")}`}

                        </h5>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                {/* CROP NAME */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.cropName")}
                                    </label>

                                    <input
                                        type="text"
                                        name="cropName"
                                        className="form-control"
                                        placeholder={t(
                                            "pestAlerts.cropNamePlaceholder"
                                        )}
                                        value={formData.cropName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* PEST NAME */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.pestName")}
                                    </label>

                                    <input
                                        type="text"
                                        name="pestName"
                                        className="form-control"
                                        placeholder={t(
                                            "pestAlerts.pestNamePlaceholder"
                                        )}
                                        value={formData.pestName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* DISEASE */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.diseaseName")}
                                    </label>

                                    <input
                                        type="text"
                                        name="diseaseName"
                                        className="form-control"
                                        placeholder={t(
                                            "pestAlerts.diseasePlaceholder"
                                        )}
                                        value={formData.diseaseName}
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* RISK */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.riskLevel")}
                                    </label>

                                    <select
                                        name="riskLevel"
                                        className="form-select"
                                        value={formData.riskLevel}
                                        onChange={handleChange}
                                    >

                                        <option value="Low">
                                            {t("pestAlerts.low")}
                                        </option>

                                        <option value="Medium">
                                            {t("pestAlerts.medium")}
                                        </option>

                                        <option value="High">
                                            {t("pestAlerts.high")}
                                        </option>

                                        <option value="Critical">
                                            {t("pestAlerts.critical")}
                                        </option>

                                    </select>

                                </div>

                                {/* SYMPTOMS */}

                                <div className="col-12 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.symptoms")}
                                    </label>

                                    <textarea
                                        name="symptoms"
                                        className="form-control"
                                        rows="3"
                                        placeholder={t(
                                            "pestAlerts.symptomsPlaceholder"
                                        )}
                                        value={formData.symptoms}
                                        onChange={handleChange}
                                        required
                                    ></textarea>

                                </div>

                                {/* PREVENTION */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.prevention")}
                                    </label>

                                    <textarea
                                        name="prevention"
                                        className="form-control"
                                        rows="3"
                                        placeholder={t(
                                            "pestAlerts.preventionPlaceholder"
                                        )}
                                        value={formData.prevention}
                                        onChange={handleChange}
                                        required
                                    ></textarea>

                                </div>

                                {/* TREATMENT */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.treatment")}
                                    </label>

                                    <textarea
                                        name="treatment"
                                        className="form-control"
                                        rows="3"
                                        placeholder={t(
                                            "pestAlerts.treatmentPlaceholder"
                                        )}
                                        value={formData.treatment}
                                        onChange={handleChange}
                                        required
                                    ></textarea>

                                </div>

                                {/* SEASON */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label fw-semibold">
                                        {t("pestAlerts.affectedSeason")}
                                    </label>

                                    <input
                                        type="text"
                                        name="affectedSeason"
                                        className="form-control"
                                        placeholder={t(
                                            "pestAlerts.seasonPlaceholder"
                                        )}
                                        value={formData.affectedSeason}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="mt-3">

                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={formLoading}
                                >

                                    {formLoading
                                        ? `⏳ ${t("pestAlerts.saving")}`
                                        : editingId
                                            ? `💾 ${t("pestAlerts.updateAlert")}`
                                            : `💾 ${t("pestAlerts.saveAlert")}`}

                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                    disabled={formLoading}
                                >
                                    {t("pestAlerts.cancel")}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* SEARCH + FILTER */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-8 mb-2 mb-md-0">

                            <input
                                type="text"
                                className="form-control"
                                placeholder={`🔍 ${t(
                                    "pestAlerts.searchPlaceholder"
                                )}`}
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <select
                                className="form-select"
                                value={riskFilter}
                                onChange={(e) =>
                                    setRiskFilter(e.target.value)
                                }
                            >

                                <option value="All">
                                    {t("pestAlerts.allRiskLevels")}
                                </option>

                                <option value="Low">
                                    {t("pestAlerts.low")}
                                </option>

                                <option value="Medium">
                                    {t("pestAlerts.medium")}
                                </option>

                                <option value="High">
                                    {t("pestAlerts.high")}
                                </option>

                                <option value="Critical">
                                    {t("pestAlerts.critical")}
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* LOADING */}

            {loading && (
                <div className="text-center py-5">

                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="mt-2">
                        {t("pestAlerts.loading")}
                    </p>

                </div>
            )}

            {/* NO DATA */}

            {!loading && filteredAlerts.length === 0 && (
                <div className="alert alert-info text-center">

                    {t("pestAlerts.noAlerts")}

                </div>
            )}

            {/* ALERT CARDS */}

            {!loading && filteredAlerts.length > 0 && (

                <div className="row">

                    {filteredAlerts.map((alert) => (

                        <div
                            className="col-md-6 col-lg-4 mb-4"
                            key={alert._id}
                        >

                            <div className="card h-100 shadow-sm">

                                {/* CARD HEADER */}

                                <div className="card-header d-flex justify-content-between align-items-center">

                                    <strong>
                                        🌱{" "}
                                        {getLocalizedCrop(
                                            alert.cropName
                                        )}
                                    </strong>

                                    <span
                                        className={`badge ${getRiskBadge(
                                            alert.riskLevel
                                        )}`}
                                    >
                                        {translateRiskLevel(
                                            alert.riskLevel
                                        )}
                                    </span>

                                </div>

                                <div className="card-body">

                                    {/* PEST */}

                                    <h5 className="text-danger">

                                        🐛{" "}
                                        {getLocalizedPest(
                                            alert.pestName
                                        )}

                                    </h5>

                                    {/* DISEASE */}

                                    {alert.diseaseName && (

                                        <p className="mb-2">

                                            <strong>
                                                {t(
                                                    "pestAlerts.disease"
                                                )}
                                                :
                                            </strong>{" "}

                                            {getLocalizedDisease(
                                                alert.diseaseName
                                            )}

                                        </p>

                                    )}

                                    {/* SYMPTOMS */}

                                    <p>

                                        <strong>
                                            {t(
                                                "pestAlerts.symptoms"
                                            )}
                                            :
                                        </strong>

                                        <br />

                                        {alert.symptoms}

                                    </p>

                                    {/* PREVENTION */}

                                    <p>

                                        <strong>
                                            {t(
                                                "pestAlerts.prevention"
                                            )}
                                            :
                                        </strong>

                                        <br />

                                        {alert.prevention}

                                    </p>

                                    {/* TREATMENT */}

                                    <p>

                                        <strong>
                                            {t(
                                                "pestAlerts.treatment"
                                            )}
                                            :
                                        </strong>

                                        <br />

                                        {alert.treatment}

                                    </p>

                                    {/* SEASON */}

                                    {alert.affectedSeason && (

                                        <p className="mb-0">

                                            <strong>
                                                {t(
                                                    "pestAlerts.season"
                                                )}
                                                :
                                            </strong>{" "}

                                            {getLocalizedSeason(
                                                alert.affectedSeason
                                            )}

                                        </p>

                                    )}

                                </div>

                                {/* EDIT / DELETE */}

                                <div className="card-footer bg-white">

                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() =>
                                            handleEdit(alert)
                                        }
                                    >
                                        ✏️{" "}
                                        {t(
                                            "pestAlerts.edit"
                                        )}
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(
                                                alert._id
                                            )
                                        }
                                    >
                                        🗑️{" "}
                                        {t(
                                            "pestAlerts.delete"
                                        )}
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default PestAlerts;
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

function MarketPrices() {
    const { t } = useTranslation();

    const [prices, setPrices] = useState([]);

    const [formData, setFormData] = useState({
        cropName: "",
        marketName: "",
        district: "",
        state: "Maharashtra",
        minPrice: "",
        maxPrice: "",
        modalPrice: "",
        priceUnit: "₹ / Quintal",
        date: "",
    });

    const [editingId, setEditingId] = useState(null);

    // Search & Filter
    const [searchCrop, setSearchCrop] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // GET JWT TOKEN
    // =====================================================
    const getToken = () => {
        return localStorage.getItem("token");
    };

    // =====================================================
    // AUTHORIZATION HEADER
    // =====================================================
    const getAuthConfig = () => {
        return {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };
    };

    // =====================================================
    // CROP TRANSLATIONS
    // Database value remains English
    // =====================================================
    const cropTranslations = {
        Wheat: {
            en: "Wheat",
            mr: "गहू",
            hi: "गेहूं",
        },
        Rice: {
            en: "Rice",
            mr: "तांदूळ",
            hi: "चावल",
        },
        Onion: {
            en: "Onion",
            mr: "कांदा",
            hi: "प्याज़",
        },
        Tomato: {
            en: "Tomato",
            mr: "टोमॅटो",
            hi: "टमाटर",
        },
        Potato: {
            en: "Potato",
            mr: "बटाटा",
            hi: "आलू",
        },
        Sugarcane: {
            en: "Sugarcane",
            mr: "ऊस",
            hi: "गन्ना",
        },
        Soybean: {
            en: "Soybean",
            mr: "सोयाबीन",
            hi: "सोयाबीन",
        },
        Cotton: {
            en: "Cotton",
            mr: "कापूस",
            hi: "कपास",
        },
        Maize: {
            en: "Maize",
            mr: "मका",
            hi: "मक्का",
        },
        Groundnut: {
            en: "Groundnut",
            mr: "भुईमूग",
            hi: "मूंगफली",
        },
        Tur: {
            en: "Tur",
            mr: "तूर",
            hi: "अरहर",
        },
        Gram: {
            en: "Gram",
            mr: "हरभरा",
            hi: "चना",
        },
        Jowar: {
            en: "Jowar",
            mr: "ज्वारी",
            hi: "ज्वार",
        },
        Bajra: {
            en: "Bajra",
            mr: "बाजरी",
            hi: "बाजरा",
        },
        Barley: {
            en: "Barley",
            mr: "जव",
            hi: "जौ",
        },
    };

    // =====================================================
    // DISTRICT TRANSLATIONS
    // =====================================================
    const districtTranslations = {
        Pune: {
            en: "Pune",
            mr: "पुणे",
            hi: "पुणे",
        },
        Kolhapur: {
            en: "Kolhapur",
            mr: "कोल्हापूर",
            hi: "कोल्हापुर",
        },
        Sangli: {
            en: "Sangli",
            mr: "सांगली",
            hi: "सांगली",
        },
        Satara: {
            en: "Satara",
            mr: "सातारा",
            hi: "सातारा",
        },
        Solapur: {
            en: "Solapur",
            mr: "सोलापूर",
            hi: "सोलापुर",
        },
        Nashik: {
            en: "Nashik",
            mr: "नाशिक",
            hi: "नासिक",
        },
        Mumbai: {
            en: "Mumbai",
            mr: "मुंबई",
            hi: "मुंबई",
        },
        Nagpur: {
            en: "Nagpur",
            mr: "नागपूर",
            hi: "नागपुर",
        },
        Ahmednagar: {
            en: "Ahmednagar",
            mr: "अहिल्यानगर",
            hi: "अहमदनगर",
        },
        Aurangabad: {
            en: "Aurangabad",
            mr: "छत्रपती संभाजीनगर",
            hi: "छत्रपति संभाजीनगर",
        },
        "Chhatrapati Sambhajinagar": {
            en: "Chhatrapati Sambhajinagar",
            mr: "छत्रपती संभाजीनगर",
            hi: "छत्रपति संभाजीनगर",
        },
        Jalgaon: {
            en: "Jalgaon",
            mr: "जळगाव",
            hi: "जलगांव",
        },
        Dhule: {
            en: "Dhule",
            mr: "धुळे",
            hi: "धुले",
        },
        Nandurbar: {
            en: "Nandurbar",
            mr: "नंदुरबार",
            hi: "नंदुरबार",
        },
        Nashik: {
            en: "Nashik",
            mr: "नाशिक",
            hi: "नासिक",
        },
        Beed: {
            en: "Beed",
            mr: "बीड",
            hi: "बीड",
        },
        Latur: {
            en: "Latur",
            mr: "लातूर",
            hi: "लातूर",
        },
        Osmanabad: {
            en: "Osmanabad",
            mr: "धाराशिव",
            hi: "धाराशिव",
        },
        Dharashiv: {
            en: "Dharashiv",
            mr: "धाराशिव",
            hi: "धाराशिव",
        },
        Nanded: {
            en: "Nanded",
            mr: "नांदेड",
            hi: "नांदेड",
        },
        Parbhani: {
            en: "Parbhani",
            mr: "परभणी",
            hi: "परभणी",
        },
        Hingoli: {
            en: "Hingoli",
            mr: "हिंगोली",
            hi: "हिंगोली",
        },
        Akola: {
            en: "Akola",
            mr: "अकोला",
            hi: "अकोला",
        },
        Amravati: {
            en: "Amravati",
            mr: "अमरावती",
            hi: "अमरावती",
        },
        Buldhana: {
            en: "Buldhana",
            mr: "बुलढाणा",
            hi: "बुलढाणा",
        },
        Washim: {
            en: "Washim",
            mr: "वाशिम",
            hi: "वाशिम",
        },
        Yavatmal: {
            en: "Yavatmal",
            mr: "यवतमाळ",
            hi: "यवतमाल",
        },
        Wardha: {
            en: "Wardha",
            mr: "वर्धा",
            hi: "वर्धा",
        },
        Bhandara: {
            en: "Bhandara",
            mr: "भंडारा",
            hi: "भंडारा",
        },
        Gondia: {
            en: "Gondia",
            mr: "गोंदिया",
            hi: "गोंदिया",
        },
        Chandrapur: {
            en: "Chandrapur",
            mr: "चंद्रपूर",
            hi: "चंद्रपुर",
        },
        Gadchiroli: {
            en: "Gadchiroli",
            mr: "गडचिरोली",
            hi: "गडचिरोली",
        },
        Raigad: {
            en: "Raigad",
            mr: "रायगड",
            hi: "रायगढ़",
        },
        Ratnagiri: {
            en: "Ratnagiri",
            mr: "रत्नागिरी",
            hi: "रत्नागिरी",
        },
        Sindhudurg: {
            en: "Sindhudurg",
            mr: "सिंधुदुर्ग",
            hi: "सिंधुदुर्ग",
        },
        Thane: {
            en: "Thane",
            mr: "ठाणे",
            hi: "ठाणे",
        },
        Palghar: {
            en: "Palghar",
            mr: "पालघर",
            hi: "पालघर",
        },
    };

    // =====================================================
    // STATE TRANSLATIONS
    // =====================================================
    const stateTranslations = {
        Maharashtra: {
            en: "Maharashtra",
            mr: "महाराष्ट्र",
            hi: "महाराष्ट्र",
        },
        Karnataka: {
            en: "Karnataka",
            mr: "कर्नाटक",
            hi: "कर्नाटक",
        },
        Goa: {
            en: "Goa",
            mr: "गोवा",
            hi: "गोवा",
        },
        Gujarat: {
            en: "Gujarat",
            mr: "गुजरात",
            hi: "गुजरात",
        },
        MadhyaPradesh: {
            en: "Madhya Pradesh",
            mr: "मध्य प्रदेश",
            hi: "मध्य प्रदेश",
        },
    };

    // =====================================================
    // MARKET NAME TRANSLATIONS
    // =====================================================
    const marketTranslations = {
        "Pune Mandai": {
            en: "Pune Mandai",
            mr: "पुणे मंडई",
            hi: "पुणे मंडी",
        },
        "Kolhapur Market": {
            en: "Kolhapur Market",
            mr: "कोल्हापूर बाजार",
            hi: "कोल्हापुर बाजार",
        },
        "Sangli Market": {
            en: "Sangli Market",
            mr: "सांगली बाजार",
            hi: "सांगली बाजार",
        },
        "APMC Market": {
            en: "APMC Market",
            mr: "APMC बाजार",
            hi: "APMC बाजार",
        },
        "Market Yard": {
            en: "Market Yard",
            mr: "मार्केट यार्ड",
            hi: "मार्केट यार्ड",
        },
    };

    // =====================================================
    // LOCALIZED VALUE HELPER
    // =====================================================
    const getLocalizedValue = (value, dictionary) => {
        if (!value) {
            return "";
        }

        const language = i18n.language || "en";

        const exactMatch = dictionary[value];

        if (exactMatch) {
            return exactMatch[language] || exactMatch.en || value;
        }

        return value;
    };

    // =====================================================
    // LOCALIZED CROP
    // =====================================================
    const getCropName = (cropName) => {
        return getLocalizedValue(cropName, cropTranslations);
    };

    // =====================================================
    // LOCALIZED DISTRICT
    // =====================================================
    const getDistrictName = (district) => {
        return getLocalizedValue(
            district,
            districtTranslations
        );
    };

    // =====================================================
    // LOCALIZED STATE
    // =====================================================
    const getStateName = (state) => {
        return getLocalizedValue(
            state,
            stateTranslations
        );
    };

    // =====================================================
    // LOCALIZED MARKET
    // =====================================================
    const getMarketName = (marketName) => {
        return getLocalizedValue(
            marketName,
            marketTranslations
        );
    };

    // =====================================================
    // LOCALIZED PRICE UNIT
    // =====================================================
    const getPriceUnit = (unit) => {
        if (i18n.language === "mr") {
            if (unit === "₹ / Quintal") {
                return "₹ / क्विंटल";
            }

            if (unit === "₹ / Kg") {
                return "₹ / किलो";
            }

            if (unit === "₹ / Ton") {
                return "₹ / टन";
            }
        }

        if (i18n.language === "hi") {
            if (unit === "₹ / Quintal") {
                return "₹ / क्विंटल";
            }

            if (unit === "₹ / Kg") {
                return "₹ / किलो";
            }

            if (unit === "₹ / Ton") {
                return "₹ / टन";
            }
        }

        return unit;
    };

    // =====================================================
    // FETCH MARKET PRICES
    // =====================================================
    useEffect(() => {
        fetchMarketPrices();
    }, []);

    const fetchMarketPrices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/market-prices",
                getAuthConfig()
            );

            /*
             Backend response can be:
             1. Array
             2. { success: true, data: [...] }
             */

            if (Array.isArray(response.data)) {
                setPrices(response.data);
            } else if (Array.isArray(response.data?.data)) {
                setPrices(response.data.data);
            } else {
                setPrices([]);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);

            setError(
                t(
                    "marketPrices.unableToFetch",
                    "Unable to fetch market prices"
                )
            );

            setLoading(false);
        }
    };

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =====================================================
    // ADD / UPDATE MARKET PRICE
    // =====================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const minPrice = Number(formData.minPrice);
            const modalPrice = Number(formData.modalPrice);
            const maxPrice = Number(formData.maxPrice);

            // Minimum price validation
            if (minPrice > modalPrice) {
                setError(
                    t(
                        "marketPrices.minPriceError",
                        "Minimum price cannot be greater than modal price."
                    )
                );

                setSaving(false);
                return;
            }

            // Maximum price validation
            if (modalPrice > maxPrice) {
                setError(
                    t(
                        "marketPrices.modalPriceError",
                        "Modal price cannot be greater than maximum price."
                    )
                );

                setSaving(false);
                return;
            }

            // Data stored in database remains English/original
            const data = {
                ...formData,
                minPrice,
                maxPrice,
                modalPrice,
            };

            // =================================================
            // UPDATE
            // =================================================
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/market-prices/${editingId}`,
                    data,
                    getAuthConfig()
                );

                setSuccess(
                    t(
                        "marketPrices.priceUpdated",
                        "Market price updated successfully! ✏️"
                    )
                );
            }

            // =================================================
            // ADD
            // =================================================
            else {
                await axios.post(
                    "http://localhost:5000/api/market-prices",
                    data,
                    getAuthConfig()
                );

                setSuccess(
                    t(
                        "marketPrices.priceAdded",
                        "Market price added successfully! 🌾"
                    )
                );
            }

            resetForm();
            await fetchMarketPrices();

        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                t(
                    "marketPrices.saveFailed",
                    "Failed to save market price"
                )
            );
        }

        setSaving(false);
    };

    // =====================================================
    // EDIT
    // =====================================================
    const handleEdit = (price) => {
        setEditingId(price._id);

        setFormData({
            cropName: price.cropName || "",
            marketName: price.marketName || "",
            district: price.district || "",
            state: price.state || "Maharashtra",
            minPrice:
                price.minPrice !== undefined
                    ? price.minPrice
                    : "",
            maxPrice:
                price.maxPrice !== undefined
                    ? price.maxPrice
                    : "",
            modalPrice:
                price.modalPrice !== undefined
                    ? price.modalPrice
                    : "",
            priceUnit:
                price.priceUnit || "₹ / Quintal",
            date: price.date
                ? new Date(price.date)
                    .toISOString()
                    .split("T")[0]
                : "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            t(
                "marketPrices.confirmDelete",
                "Are you sure you want to delete this market price?"
            )
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await axios.delete(
                `http://localhost:5000/api/market-prices/${id}`,
                getAuthConfig()
            );

            setSuccess(
                t(
                    "marketPrices.priceDeleted",
                    "Market price deleted successfully! 🗑️"
                )
            );

            await fetchMarketPrices();
        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                t(
                    "marketPrices.deleteFailed",
                    "Failed to delete market price"
                )
            );
        }
    };

    // =====================================================
    // RESET FORM
    // =====================================================
    const resetForm = () => {
        setEditingId(null);

        setFormData({
            cropName: "",
            marketName: "",
            district: "",
            state: "Maharashtra",
            minPrice: "",
            maxPrice: "",
            modalPrice: "",
            priceUnit: "₹ / Quintal",
            date: "",
        });
    };

    // =====================================================
    // UNIQUE CROPS
    // =====================================================
    const uniqueCrops = [
        ...new Set(
            prices
                .map((price) => price.cropName)
                .filter(Boolean)
        ),
    ];

    // =====================================================
    // UNIQUE DISTRICTS
    // =====================================================
    const uniqueDistricts = [
        ...new Set(
            prices
                .map((price) => price.district)
                .filter(Boolean)
        ),
    ];

    // =====================================================
    // SEARCH + FILTER
    // =====================================================
    const filteredPrices = prices.filter((price) => {
        const cropName =
            price.cropName?.toLowerCase() || "";

        const district =
            price.district?.toLowerCase() || "";

        const searchMatch = cropName.includes(
            searchCrop.toLowerCase()
        );

        const districtMatch =
            selectedDistrict === "" ||
            district === selectedDistrict.toLowerCase();

        const cropMatch =
            selectedCrop === "" ||
            cropName === selectedCrop.toLowerCase();

        return (
            searchMatch &&
            districtMatch &&
            cropMatch
        );
    });

    // =====================================================
    // CLEAR FILTERS
    // =====================================================
    const clearFilters = () => {
        setSearchCrop("");
        setSelectedDistrict("");
        setSelectedCrop("");
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================
    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const locale =
            i18n.language === "mr"
                ? "mr-IN"
                : i18n.language === "hi"
                    ? "hi-IN"
                    : "en-IN";

        return new Date(date).toLocaleDateString(
            locale,
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <div className="container py-5">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="mb-4">

                <h1 className="text-success fw-bold">
                    🌾{" "}
                    {t(
                        "marketPrices.title",
                        "Market Prices"
                    )}
                </h1>

                <p className="text-muted">
                    {t(
                        "marketPrices.description",
                        "Check latest crop market prices and make better selling decisions."
                    )}
                </p>

            </div>

            {/* =================================================
                ADD / EDIT FORM
            ================================================= */}
            <div className="card shadow-sm mb-5">

                <div className="card-header bg-success text-white">

                    <h4 className="mb-0">

                        {editingId
                            ? `✏️ ${t(
                                "marketPrices.editMarketPrice",
                                "Edit Market Price"
                            )}`
                            : `➕ ${t(
                                "marketPrices.addMarketPrice",
                                "Add Market Price"
                            )}`}

                    </h4>

                </div>

                <div className="card-body">

                    {/* SUCCESS */}
                    {success && (
                        <div className="alert alert-success">
                            ✅ {success}
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div className="alert alert-danger">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Crop + Market */}
                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.cropName",
                                        "Crop Name"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    name="cropName"
                                    className="form-control"
                                    placeholder={t(
                                        "marketPrices.cropNamePlaceholder",
                                        "Example: Wheat"
                                    )}
                                    value={formData.cropName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.marketName",
                                        "Market Name"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    name="marketName"
                                    className="form-control"
                                    placeholder={t(
                                        "marketPrices.marketNamePlaceholder",
                                        "Example: Pune Mandai"
                                    )}
                                    value={formData.marketName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* District + State */}
                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.district",
                                        "District"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    name="district"
                                    className="form-control"
                                    placeholder={t(
                                        "marketPrices.districtPlaceholder",
                                        "Example: Pune"
                                    )}
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.state",
                                        "State"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    value={formData.state}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Prices */}
                        <div className="row">

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.minimumPrice",
                                        "Minimum Price"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    name="minPrice"
                                    className="form-control"
                                    placeholder="Example: 1500"
                                    value={formData.minPrice}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.modalPrice",
                                        "Modal Price"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    name="modalPrice"
                                    className="form-control"
                                    placeholder="Example: 2000"
                                    value={formData.modalPrice}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.maximumPrice",
                                        "Maximum Price"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    name="maxPrice"
                                    className="form-control"
                                    placeholder="Example: 3000"
                                    value={formData.maxPrice}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* Unit + Date */}
                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.priceUnit",
                                        "Price Unit"
                                    )}
                                </label>

                                <select
                                    name="priceUnit"
                                    className="form-select"
                                    value={formData.priceUnit}
                                    onChange={handleChange}
                                >

                                    <option value="₹ / Quintal">
                                        ₹ / Quintal
                                    </option>

                                    <option value="₹ / Kg">
                                        ₹ / Kg
                                    </option>

                                    <option value="₹ / Ton">
                                        ₹ / Ton
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-bold">
                                    {t(
                                        "marketPrices.date",
                                        "Date"
                                    )}
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="mt-3">

                            <button
                                type="submit"
                                className="btn btn-success px-4 me-2"
                                disabled={saving}
                            >

                                {saving
                                    ? `⏳ ${t(
                                        "marketPrices.saving",
                                        "Saving..."
                                    )}`
                                    : editingId
                                        ? `✏️ ${t(
                                            "marketPrices.updateMarketPrice",
                                            "Update Market Price"
                                        )}`
                                        : `➕ ${t(
                                            "marketPrices.addMarketPrice",
                                            "Add Market Price"
                                        )}`}

                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary px-4"
                                    onClick={resetForm}
                                >
                                    ❌{" "}
                                    {t(
                                        "marketPrices.cancelEdit",
                                        "Cancel Edit"
                                    )}
                                </button>
                            )}

                        </div>

                    </form>

                </div>
            </div>

            {/* =================================================
                SEARCH & FILTER
            ================================================= */}
            <div className="card shadow-sm mb-5">

                <div className="card-header bg-light">

                    <h4 className="text-success fw-bold mb-0">
                        🔍{" "}
                        {t(
                            "marketPrices.searchFilterTitle",
                            "Search & Filter Market Prices"
                        )}
                    </h4>

                </div>

                <div className="card-body">

                    <div className="row">

                        {/* Search Crop */}
                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-bold">
                                🔍{" "}
                                {t(
                                    "marketPrices.searchCrop",
                                    "Search Crop"
                                )}
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder={t(
                                    "marketPrices.searchPlaceholder",
                                    "Search wheat, rice, onion..."
                                )}
                                value={searchCrop}
                                onChange={(e) =>
                                    setSearchCrop(e.target.value)
                                }
                            />

                        </div>

                        {/* Crop Filter */}
                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-bold">
                                🌾{" "}
                                {t(
                                    "marketPrices.filterByCrop",
                                    "Filter by Crop"
                                )}
                            </label>

                            <select
                                className="form-select"
                                value={selectedCrop}
                                onChange={(e) =>
                                    setSelectedCrop(e.target.value)
                                }
                            >

                                <option value="">
                                    {t(
                                        "marketPrices.allCrops",
                                        "All Crops"
                                    )}
                                </option>

                                {uniqueCrops.map(
                                    (crop, index) => (
                                        <option
                                            key={index}
                                            value={crop}
                                        >
                                            {getCropName(crop)}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* District Filter */}
                        <div className="col-md-4 mb-3">

                            <label className="form-label fw-bold">
                                📍{" "}
                                {t(
                                    "marketPrices.filterByDistrict",
                                    "Filter by District"
                                )}
                            </label>

                            <select
                                className="form-select"
                                value={selectedDistrict}
                                onChange={(e) =>
                                    setSelectedDistrict(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    {t(
                                        "marketPrices.allDistricts",
                                        "All Districts"
                                    )}
                                </option>

                                {uniqueDistricts.map(
                                    (district, index) => (
                                        <option
                                            key={index}
                                            value={district}
                                        >
                                            {getDistrictName(
                                                district
                                            )}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {/* Clear Filters */}
                    <div className="mt-2">

                        <button
                            className="btn btn-outline-secondary"
                            onClick={clearFilters}
                        >
                            🔄{" "}
                            {t(
                                "marketPrices.clearFilters",
                                "Clear Filters"
                            )}
                        </button>

                    </div>

                </div>
            </div>

            {/* =================================================
                RESULT COUNT
            ================================================= */}
            {!loading && (
                <div className="mb-4">

                    <h5 className="text-muted">

                        {t(
                            "marketPrices.showing",
                            "Showing"
                        )}{" "}

                        <strong>
                            {filteredPrices.length}
                        </strong>{" "}

                        {t(
                            "marketPrices.results",
                            "market price result(s)"
                        )}

                    </h5>

                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}
            {loading && (
                <div className="text-center py-5">

                    <div className="spinner-border text-success"></div>

                    <p className="mt-3">
                        {t(
                            "marketPrices.loading",
                            "Loading market prices..."
                        )}
                    </p>

                </div>
            )}

            {/* =================================================
                NO RESULTS
            ================================================= */}
            {!loading &&
                filteredPrices.length === 0 && (

                    <div className="alert alert-info">

                        ℹ️{" "}
                        {t(
                            "marketPrices.noResults",
                            "No market prices found."
                        )}

                        <br />

                        {t(
                            "marketPrices.tryFilters",
                            "Try changing your search or filters."
                        )}

                    </div>
                )}

            {/* =================================================
                MARKET PRICE CARDS
            ================================================= */}
            {!loading &&
                filteredPrices.length > 0 && (

                    <div className="row">

                        {filteredPrices.map((price) => (

                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={price._id}
                            >

                                <div className="card shadow-sm h-100">

                                    <div className="card-body">

                                        {/* Crop */}
                                        <h4 className="text-success fw-bold text-center">

                                            🌾{" "}

                                            {getCropName(
                                                price.cropName
                                            )}

                                        </h4>

                                        <hr />

                                        {/* Market */}
                                        <p>
                                            <strong>
                                                🏪{" "}
                                                {t(
                                                    "marketPrices.market",
                                                    "Market"
                                                )}:
                                            </strong>{" "}

                                            {getMarketName(
                                                price.marketName
                                            )}
                                        </p>

                                        {/* District */}
                                        <p>
                                            <strong>
                                                📍{" "}
                                                {t(
                                                    "marketPrices.district",
                                                    "District"
                                                )}:
                                            </strong>{" "}

                                            {getDistrictName(
                                                price.district
                                            )}
                                        </p>

                                        {/* State */}
                                        <p>
                                            <strong>
                                                🗺️{" "}
                                                {t(
                                                    "marketPrices.state",
                                                    "State"
                                                )}:
                                            </strong>{" "}

                                            {getStateName(
                                                price.state
                                            )}
                                        </p>

                                        {/* Prices */}
                                        <div className="row text-center mt-4">

                                            {/* Min */}
                                            <div className="col-4">

                                                <small className="text-muted">
                                                    {t(
                                                        "marketPrices.minPrice",
                                                        "Min Price"
                                                    )}
                                                </small>

                                                <h5 className="text-success">
                                                    ₹{price.minPrice}
                                                </h5>

                                            </div>

                                            {/* Modal */}
                                            <div className="col-4">

                                                <small className="text-muted">
                                                    {t(
                                                        "marketPrices.modalPrice",
                                                        "Modal Price"
                                                    )}
                                                </small>

                                                <h5 className="text-success fw-bold">
                                                    ₹{price.modalPrice}
                                                </h5>

                                            </div>

                                            {/* Max */}
                                            <div className="col-4">

                                                <small className="text-muted">
                                                    {t(
                                                        "marketPrices.maxPrice",
                                                        "Max Price"
                                                    )}
                                                </small>

                                                <h5 className="text-success">
                                                    ₹{price.maxPrice}
                                                </h5>

                                            </div>

                                        </div>

                                        {/* Price Unit */}
                                        <div className="text-center mt-3">

                                            <span className="badge bg-success">
                                                {getPriceUnit(
                                                    price.priceUnit
                                                )}
                                            </span>

                                        </div>

                                        {/* Date */}
                                        <div className="text-center mt-3">

                                            <small className="text-muted">

                                                📅{" "}

                                                {t(
                                                    "marketPrices.date",
                                                    "Date"
                                                )}:{" "}

                                                {formatDate(
                                                    price.date
                                                )}

                                            </small>

                                        </div>

                                        {/* Edit + Delete */}
                                        <div className="d-flex justify-content-center gap-2 mt-4">

                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() =>
                                                    handleEdit(price)
                                                }
                                            >
                                                ✏️{" "}
                                                {t(
                                                    "common.edit",
                                                    "Edit"
                                                )}
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        price._id
                                                    )
                                                }
                                            >
                                                🗑️{" "}
                                                {t(
                                                    "common.delete",
                                                    "Delete"
                                                )}
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

export default MarketPrices;
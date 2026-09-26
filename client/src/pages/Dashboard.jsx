import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import "./Dashboard.css";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function Dashboard() {
    const { t } = useTranslation();

    const [stats, setStats] = useState({
        totalCrops: 0,
        totalMarketPrices: 0,
        recentMarketPrices: [],
        upcomingActivities: [],
        totalPestAlerts: 0,
        highRiskAlerts: 0,
        criticalAlerts: 0,
        recentPestAlerts: [],
        totalSoilAnalyses: 0,
        goodSoils: 0,
        poorSoils: 0,
        recentSoilAnalyses: [],
    });

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [weatherError, setWeatherError] = useState("");
    const [notifications, setNotifications] = useState([]);

    // ==========================================
    // DATE LOCALE
    // ==========================================

    const getDateLocale = () => {
        if (i18n.language === "mr") {
            return "mr-IN";
        }

        if (i18n.language === "hi") {
            return "hi-IN";
        }

        return "en-IN";
    };

    // ==========================================
    // TRANSLATION HELPERS
    // ==========================================

    const translateWeatherCondition = (condition) => {
        if (!condition) return "";

        const value = condition.toLowerCase();

        if (value.includes("rain")) {
            return t("weather.rain", {
                defaultValue:
                    i18n.language === "mr"
                        ? "पाऊस"
                        : i18n.language === "hi"
                            ? "बारिश"
                            : "Rain",
            });
        }

        if (value.includes("cloud")) {
            return t("dashboard.cloudy", {
                defaultValue:
                    i18n.language === "mr"
                        ? "ढगाळ"
                        : i18n.language === "hi"
                            ? "बादल"
                            : "Cloudy",
            });
        }

        if (value.includes("clear")) {
            return t("dashboard.clear", {
                defaultValue:
                    i18n.language === "mr"
                        ? "स्वच्छ आकाश"
                        : i18n.language === "hi"
                            ? "साफ आकाश"
                            : "Clear",
            });
        }

        if (value.includes("thunder")) {
            return t("dashboard.thunderstorm", {
                defaultValue:
                    i18n.language === "mr"
                        ? "मेघगर्जनेसह पाऊस"
                        : i18n.language === "hi"
                            ? "गरज के साथ बारिश"
                            : "Thunderstorm",
            });
        }

        if (value.includes("snow")) {
            return t("dashboard.snow", {
                defaultValue:
                    i18n.language === "mr"
                        ? "बर्फवृष्टी"
                        : i18n.language === "hi"
                            ? "बर्फबारी"
                            : "Snow",
            });
        }

        if (value.includes("mist")) {
            return t("dashboard.mist", {
                defaultValue:
                    i18n.language === "mr"
                        ? "धुके"
                        : i18n.language === "hi"
                            ? "कोहरा"
                            : "Mist",
            });
        }

        if (value.includes("fog")) {
            return t("dashboard.fog", {
                defaultValue:
                    i18n.language === "mr"
                        ? "धुके"
                        : i18n.language === "hi"
                            ? "कोहरा"
                            : "Fog",
            });
        }

        if (value.includes("haze")) {
            return t("dashboard.haze", {
                defaultValue:
                    i18n.language === "mr"
                        ? "धुरकट वातावरण"
                        : i18n.language === "hi"
                            ? "धुंध"
                            : "Haze",
            });
        }

        if (value.includes("drizzle")) {
            return t("dashboard.drizzle", {
                defaultValue:
                    i18n.language === "mr"
                        ? "रिमझिम पाऊस"
                        : i18n.language === "hi"
                            ? "बूंदाबांदी"
                            : "Drizzle",
            });
        }

        return condition;
    };

    const translateStatus = (status) => {
        if (status === "Growing") {
            return t("dashboard.growing", {
                defaultValue:
                    i18n.language === "mr"
                        ? "पिकाची वाढ सुरू आहे"
                        : i18n.language === "hi"
                            ? "फसल बढ़ रही है"
                            : "Growing",
            });
        }

        if (status === "Planned") {
            return t("dashboard.planned", {
                defaultValue:
                    i18n.language === "mr"
                        ? "नियोजित"
                        : i18n.language === "hi"
                            ? "नियोजित"
                            : "Planned",
            });
        }

        if (status === "Harvested") {
            return t("dashboard.harvested", {
                defaultValue:
                    i18n.language === "mr"
                        ? "कापणी पूर्ण"
                        : i18n.language === "hi"
                            ? "कटाई पूरी"
                            : "Harvested",
            });
        }

        return status;
    };

    const translateRiskLevel = (riskLevel) => {
        if (riskLevel === "Critical") {
            return t("dashboard.critical", {
                defaultValue:
                    i18n.language === "mr"
                        ? "गंभीर"
                        : i18n.language === "hi"
                            ? "गंभीर"
                            : "Critical",
            });
        }

        if (riskLevel === "High") {
            return t("dashboard.high", {
                defaultValue:
                    i18n.language === "mr"
                        ? "उच्च"
                        : i18n.language === "hi"
                            ? "उच्च"
                            : "High",
            });
        }

        if (riskLevel === "Medium") {
            return t("dashboard.medium", {
                defaultValue:
                    i18n.language === "mr"
                        ? "मध्यम"
                        : i18n.language === "hi"
                            ? "मध्यम"
                            : "Medium",
            });
        }

        if (riskLevel === "Low") {
            return t("dashboard.low", {
                defaultValue:
                    i18n.language === "mr"
                        ? "कमी"
                        : i18n.language === "hi"
                            ? "कम"
                            : "Low",
            });
        }

        return riskLevel;
    };

    const translateSoilHealth = (health) => {
        if (health === "Excellent") {
            return t("dashboard.excellent", {
                defaultValue:
                    i18n.language === "mr"
                        ? "उत्कृष्ट"
                        : i18n.language === "hi"
                            ? "उत्कृष्ट"
                            : "Excellent",
            });
        }

        if (health === "Good") {
            return t("dashboard.good", {
                defaultValue:
                    i18n.language === "mr"
                        ? "चांगली"
                        : i18n.language === "hi"
                            ? "अच्छी"
                            : "Good",
            });
        }

        if (health === "Moderate") {
            return t("dashboard.moderate", {
                defaultValue:
                    i18n.language === "mr"
                        ? "मध्यम"
                        : i18n.language === "hi"
                            ? "मध्यम"
                            : "Moderate",
            });
        }

        if (health === "Poor") {
            return t("dashboard.poor", {
                defaultValue:
                    i18n.language === "mr"
                        ? "खराब"
                        : i18n.language === "hi"
                            ? "खराब"
                            : "Poor",
            });
        }

        return t("dashboard.notAvailable", {
            defaultValue:
                i18n.language === "mr"
                    ? "उपलब्ध नाही"
                    : i18n.language === "hi"
                        ? "उपलब्ध नहीं"
                        : "N/A",
        });
    };

    // ==========================================
    // SOIL CHART DATA
    // ==========================================

    const soilChartData = [
        {
            name: t("dashboard.goodExcellent", {
                defaultValue:
                    i18n.language === "mr"
                        ? "चांगली / उत्कृष्ट"
                        : i18n.language === "hi"
                            ? "अच्छी / उत्कृष्ट"
                            : "Good / Excellent",
            }),
            value: stats.goodSoils,
        },
        {
            name: t("dashboard.poor", {
                defaultValue:
                    i18n.language === "mr"
                        ? "खराब"
                        : i18n.language === "hi"
                            ? "खराब"
                            : "Poor",
            }),
            value: stats.poorSoils,
        },
        {
            name: t("dashboard.other", {
                defaultValue:
                    i18n.language === "mr"
                        ? "इतर"
                        : i18n.language === "hi"
                            ? "अन्य"
                            : "Other",
            }),
            value: Math.max(
                0,
                stats.totalSoilAnalyses -
                stats.goodSoils -
                stats.poorSoils
            ),
        },
    ];

    // ==========================================
    // MARKET CHART DATA
    // ==========================================

    const marketChartData =
        stats.recentMarketPrices.map((item) => ({
            cropName: item.cropName,
            minPrice: Number(item.minPrice) || 0,
            modalPrice: Number(item.modalPrice) || 0,
            maxPrice: Number(item.maxPrice) || 0,
        }));

    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    useEffect(() => {
        fetchDashboardStats();
        fetchDashboardWeather();
        fetchNotifications();
    }, []);

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStats({
                totalCrops:
                    response.data.totalCrops || 0,

                totalMarketPrices:
                    response.data.totalMarketPrices || 0,

                recentMarketPrices:
                    response.data.recentMarketPrices || [],

                upcomingActivities:
                    response.data.upcomingActivities || [],

                totalPestAlerts:
                    response.data.totalPestAlerts || 0,

                highRiskAlerts:
                    response.data.highRiskAlerts || 0,

                criticalAlerts:
                    response.data.criticalAlerts || 0,

                recentPestAlerts:
                    response.data.recentPestAlerts || [],

                totalSoilAnalyses:
                    response.data.totalSoilAnalyses || 0,

                goodSoils:
                    response.data.goodSoils || 0,

                poorSoils:
                    response.data.poorSoils || 0,

                recentSoilAnalyses:
                    response.data.recentSoilAnalyses || [],
            });
        } catch (err) {
            console.error(
                "Dashboard Error:",
                err
            );

            setError(
                t("dashboard.unableToLoad", {
                    defaultValue:
                        i18n.language === "mr"
                            ? "डॅशबोर्डची माहिती लोड करता आली नाही."
                            : i18n.language === "hi"
                                ? "डैशबोर्ड डेटा लोड नहीं हो सका।"
                                : "Unable to load dashboard data.",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SMART NOTIFICATIONS
    // ==========================================

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setNotifications(
                    response.data.notifications || []
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );
        }
    };

    // ==========================================
    // LIVE WEATHER
    // ==========================================

    const fetchDashboardWeather = async () => {
        try {
            const apiKey =
                import.meta.env
                    .VITE_WEATHER_API_KEY;

            if (!apiKey) {
                setWeatherError(
                    t("dashboard.weatherApiKeyMissing", {
                        defaultValue:
                            i18n.language === "mr"
                                ? "हवामान API key सापडली नाही."
                                : i18n.language === "hi"
                                    ? "Weather API key नहीं मिली।"
                                    : "Weather API key not found.",
                    })
                );

                return;
            }

            const response = await axios.get(
                "https://api.openweathermap.org/data/2.5/weather",
                {
                    params: {
                        q: "Pune,IN",
                        appid: apiKey,
                        units: "metric",
                    },
                }
            );

            setWeather(response.data);
        } catch (err) {
            console.error(
                "Weather Error:",
                err
            );

            setWeatherError(
                t("dashboard.unableToLoadWeather", {
                    defaultValue:
                        i18n.language === "mr"
                            ? "हवामान लोड करता आले नाही."
                            : i18n.language === "hi"
                                ? "मौसम लोड नहीं हो सका।"
                                : "Unable to load weather.",
                })
            );
        }
    };

    // ==========================================
    // WEATHER ICON
    // ==========================================

    const getWeatherIcon = (condition) => {
        if (!condition) return "🌦️";

        const value =
            condition.toLowerCase();

        if (value.includes("rain"))
            return "🌧️";

        if (value.includes("cloud"))
            return "☁️";

        if (value.includes("clear"))
            return "☀️";

        if (value.includes("thunder"))
            return "⛈️";

        if (value.includes("snow"))
            return "❄️";

        if (value.includes("mist"))
            return "🌫️";

        if (value.includes("fog"))
            return "🌫️";

        return "🌦️";
    };

    // ==========================================
    // FARMING ADVICE
    // ==========================================

    const getFarmingAdvice = () => {
        if (!weather) {
            return t(
                "dashboard.weatherUnavailable",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "हवामानाची माहिती सध्या उपलब्ध नाही."
                            : i18n.language === "hi"
                                ? "मौसम की जानकारी वर्तमान में उपलब्ध नहीं है।"
                                : "Weather information is currently unavailable.",
                }
            );
        }

        const temp = weather.main.temp;

        const humidity =
            weather.main.humidity;

        const rain =
            weather.rain?.["1h"] || 0;

        if (rain > 5) {
            return `🌧️ ${t(
                "dashboard.heavyRainAdvice",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "मुसळधार पाऊस आढळला. सिंचन टाळा आणि शेतातील पाण्याचा निचरा तपासा."
                            : i18n.language === "hi"
                                ? "भारी बारिश का पता चला है। सिंचाई से बचें और खेत की जल निकासी की जाँच करें।"
                                : "Heavy rain detected. Avoid irrigation and check field drainage.",
                }
            )}`;
        }

        if (rain > 0) {
            return `🌦️ ${t(
                "dashboard.rainAdvice",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "पावसाची शक्यता आहे. अनावश्यक सिंचन टाळा आणि पिकांचे निरीक्षण करा."
                            : i18n.language === "hi"
                                ? "बारिश की संभावना है। अनावश्यक सिंचाई से बचें और फसलों की निगरानी करें।"
                                : "Rain is expected. Avoid unnecessary irrigation and monitor crops.",
                }
            )}`;
        }

        if (temp >= 35) {
            return `☀️ ${t(
                "dashboard.highTemperatureAdvice",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "तापमान जास्त आहे. योग्य सिंचन करा आणि पिकांचे उष्णतेपासून संरक्षण करा."
                            : i18n.language === "hi"
                                ? "तापमान अधिक है। उचित सिंचाई करें और फसलों को गर्मी से बचाएं।"
                                : "High temperature. Provide adequate irrigation and protect crops from heat.",
                }
            )}`;
        }

        if (humidity >= 80) {
            return `💧 ${t(
                "dashboard.highHumidityAdvice",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "आर्द्रता जास्त आहे. पिकांमध्ये बुरशीजन्य रोगांवर लक्ष ठेवा."
                            : i18n.language === "hi"
                                ? "नमी अधिक है। फसलों में फंगल रोगों पर नजर रखें।"
                                : "High humidity. Monitor crops for fungal diseases.",
                }
            )}`;
        }

        if (
            temp >= 20 &&
            temp <= 32 &&
            humidity >= 40 &&
            humidity <= 75
        ) {
            return `🌱 ${t(
                "dashboard.favorableWeatherAdvice",
                {
                    defaultValue:
                        i18n.language === "mr"
                            ? "हवामानाची परिस्थिती सामान्य शेतीच्या कामांसाठी अनुकूल आहे."
                            : i18n.language === "hi"
                                ? "मौसम की स्थिति सामान्य कृषि गतिविधियों के लिए अनुकूल है।"
                                : "Weather conditions are generally favorable for farming activities.",
                }
            )}`;
        }

        return `🌾 ${t(
            "dashboard.generalWeatherAdvice",
            {
                defaultValue:
                    i18n.language === "mr"
                        ? "महत्त्वाच्या शेतीच्या कामांपूर्वी मातीतील ओलावा आणि हवामानाची स्थिती तपासा."
                        : i18n.language === "hi"
                            ? "महत्वपूर्ण कृषि गतिविधियों से पहले मिट्टी की नमी और मौसम की स्थिति की जाँच करें।"
                            : "Monitor soil moisture and weather conditions before major farming activities.",
            }
        )}`;
    };

    // ==========================================
    // SOIL HEALTH BADGE
    // ==========================================

    const getSoilHealthBadge = (health) => {
        if (health === "Excellent") {
            return (
                <span className="badge bg-success">
                    {translateSoilHealth(health)}
                </span>
            );
        }

        if (health === "Good") {
            return (
                <span className="badge bg-primary">
                    {translateSoilHealth(health)}
                </span>
            );
        }

        if (health === "Moderate") {
            return (
                <span className="badge bg-warning text-dark">
                    {translateSoilHealth(health)}
                </span>
            );
        }

        if (health === "Poor") {
            return (
                <span className="badge bg-danger">
                    {translateSoilHealth(health)}
                </span>
            );
        }

        return (
            <span className="badge bg-secondary">
                {translateSoilHealth(health)}
            </span>
        );
    };

    // ==========================================
    // NOTIFICATION ICON
    // ==========================================

    const getNotificationIcon = (type) => {
        if (type === "crop") {
            return "🌾";
        }

        if (type === "pest") {
            return "🐛";
        }

        if (type === "soil") {
            return "🌱";
        }

        if (type === "market") {
            return "📈";
        }

        return "🔔";
    };

    // ==========================================
    // NOTIFICATION BACKGROUND
    // ==========================================

    const getNotificationBackground = (
        level
    ) => {
        if (level === "danger") {
            return "bg-danger-subtle";
        }

        if (level === "warning") {
            return "bg-warning-subtle";
        }

        return "bg-info-subtle";
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div className="spinner-border text-success"></div>

                <p className="mt-3">
                    {t(
                        "dashboard.loadingDashboard",
                        {
                            defaultValue:
                                i18n.language === "mr"
                                    ? "डॅशबोर्ड लोड होत आहे..."
                                    : i18n.language === "hi"
                                        ? "डैशबोर्ड लोड हो रहा है..."
                                        : "Loading Dashboard...",
                        }
                    )}
                </p>

            </div>
        );
    }

    return (
        <div className="dashboard-page dashboard-main">

            <div className="dashboard-container">

                {/* AGRI-TECH HEADER */}
                <div
                    className="dashboard-welcome dashboard-hero mb-4"

                >
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                        <div>
                            <h1
                                className="fw-bold mb-2"
                            >
                                🌾 Agri-Tech
                            </h1>

                            <h4 className="fw-semibold mb-2 text-dark">
                                {t(
                                    "dashboard.title",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "स्मार्ट शेती डॅशबोर्ड"
                                                : i18n.language === "hi"
                                                    ? "स्मार्ट कृषि डैशबोर्ड"
                                                    : "Smart Farming Dashboard",
                                    }
                                )}
                            </h4>

                            <p className="text-muted mb-0">
                                {t(
                                    "dashboard.subtitle",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "तुमच्या बोटांच्या टोकावर स्मार्ट शेतीची माहिती"
                                                : i18n.language === "hi"
                                                    ? "आपकी उंगलियों पर स्मार्ट कृषि की जानकारी"
                                                    : "Smart farming information at your fingertips",
                                    }
                                )}
                            </p>
                        </div>

                        <div className="dashboard-hero-art" aria-hidden="true">🌱</div>

                    </div>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* SMART NOTIFICATIONS */}

                <div className="card dashboard-notifications shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">
                                🔔{" "}
                                {t(
                                    "dashboard.smartNotifications",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "स्मार्ट सूचना"
                                                : i18n.language === "hi"
                                                    ? "स्मार्ट सूचनाएँ"
                                                    : "Smart Notifications",
                                    }
                                )}
                            </h4>

                            <span className="badge bg-success">
                                {notifications.length}{" "}
                                {t(
                                    "dashboard.alerts",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "सूचना"
                                                : i18n.language === "hi"
                                                    ? "अलर्ट"
                                                    : "Alerts",
                                    }
                                )}
                            </span>

                        </div>

                        {notifications.length > 0 ? (

                            <div className="list-group">

                                {notifications.map(
                                    (notification, index) => (

                                        <div
                                            key={`${notification.type}-${index}`}
                                            className={`list-group-item border-0 mb-2 rounded ${getNotificationBackground(
                                                notification.level
                                            )}`}
                                        >

                                            <div className="d-flex align-items-start">

                                                <div
                                                    className="me-3"
                                                    style={{
                                                        fontSize:
                                                            "28px",
                                                    }}
                                                >
                                                    {getNotificationIcon(
                                                        notification.type
                                                    )}
                                                </div>

                                                <div className="flex-grow-1">

                                                    <h6 className="fw-bold mb-1">
                                                        {
                                                            notification.title
                                                        }
                                                    </h6>

                                                    <p className="mb-1">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <small className="text-muted">

                                                        {notification.date
                                                            ? new Date(
                                                                notification.date
                                                            ).toLocaleDateString(
                                                                getDateLocale(),
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )
                                                            : ""}

                                                    </small>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        ) : (

                            <div className="text-center text-muted py-4">

                                <div
                                    style={{
                                        fontSize: "45px",
                                    }}
                                >
                                    🔔
                                </div>

                                <p className="mb-0">
                                    {t(
                                        "dashboard.noNewNotifications",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "नवीन सूचना नाहीत."
                                                    : i18n.language === "hi"
                                                        ? "कोई नई सूचना नहीं है।"
                                                        : "No new notifications.",
                                        }
                                    )}
                                </p>

                            </div>

                        )}

                    </div>

                </div>

                {/* STATISTICS CARDS */}

                <div className="row g-4 mb-4 dashboard-overview-grid">

                    {/* TOTAL CROPS */}

                    <div className="col-md-4 dashboard-overview-item">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.totalCrops",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "एकूण पिके"
                                                            : i18n.language === "hi"
                                                                ? "कुल फसलें"
                                                                : "Total Crops",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-success">
                                            {stats.totalCrops}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🌱
                                    </div>

                                </div>

                                <Link
                                    to="/crops"
                                    className="btn btn-outline-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.manageCrops",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "पिके व्यवस्थापित करा"
                                                    : i18n.language === "hi"
                                                        ? "फसलें प्रबंधित करें"
                                                        : "Manage Crops",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    {/* MARKET PRICES */}

                    <div className="col-md-4 dashboard-overview-item">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.marketPriceRecords",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "बाजार भाव नोंदी"
                                                            : i18n.language === "hi"
                                                                ? "बाजार भाव रिकॉर्ड"
                                                                : "Market Price Records",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-success">
                                            {stats.totalMarketPrices}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        💰
                                    </div>

                                </div>

                                <Link
                                    to="/market-prices"
                                    className="btn btn-outline-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.viewMarketPrices",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "बाजार भाव पहा"
                                                    : i18n.language === "hi"
                                                        ? "बाजार भाव देखें"
                                                        : "View Market Prices",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    {/* WEATHER */}

                    <div className="col-md-4 dashboard-overview-item">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.puneWeather",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "पुण्याचे हवामान"
                                                            : i18n.language === "hi"
                                                                ? "पुणे का मौसम"
                                                                : "Pune Weather",
                                                }
                                            )}
                                        </p>

                                        {weather ? (

                                            <>

                                                <h2 className="fw-bold text-success">

                                                    {Math.round(
                                                        weather.main.temp
                                                    )}
                                                    °C

                                                </h2>

                                                <p className="mb-1">
                                                    {translateWeatherCondition(
                                                        weather
                                                            .weather[0]
                                                            .main
                                                    )}
                                                </p>

                                                <small className="text-muted">

                                                    💧{" "}
                                                    {t(
                                                        "dashboard.humidity",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "आर्द्रता"
                                                                    : i18n.language === "hi"
                                                                        ? "नमी"
                                                                        : "Humidity",
                                                        }
                                                    )}
                                                    :{" "}
                                                    {
                                                        weather.main
                                                            .humidity
                                                    }
                                                    %

                                                </small>

                                            </>

                                        ) : (

                                            <h4 className="fw-bold text-success">

                                                🌦️{" "}
                                                {t(
                                                    "common.loading",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "लोड होत आहे..."
                                                                : i18n.language === "hi"
                                                                    ? "लोड हो रहा है..."
                                                                    : "Loading...",
                                                    }
                                                )}

                                            </h4>

                                        )}

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        {getWeatherIcon(
                                            weather?.weather?.[0]?.main
                                        )}
                                    </div>

                                </div>

                                <Link
                                    to="/weather"
                                    className="btn btn-outline-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.checkWeather",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "हवामान तपासा"
                                                    : i18n.language === "hi"
                                                        ? "मौसम देखें"
                                                        : "Check Weather",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* PEST ALERT STATISTICS */}

                <div className="row g-4 mb-4">

                    <div className="col-md-4">

                        <div className="dashboard-stat-card dashboard-stat-card-modern dashboard-stat-danger">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.totalPestAlerts",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "एकूण किडीच्या सूचना"
                                                            : i18n.language === "hi"
                                                                ? "कुल कीट अलर्ट"
                                                                : "Total Pest Alerts",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-danger">
                                            {stats.totalPestAlerts}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🐛
                                    </div>

                                </div>

                                <Link
                                    to="/pest-alerts"
                                    className="btn btn-outline-danger btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.viewPestAlerts",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "किडीच्या सूचना पहा"
                                                    : i18n.language === "hi"
                                                        ? "कीट अलर्ट देखें"
                                                        : "View Pest Alerts",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.highRiskAlerts",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "उच्च जोखीम सूचना"
                                                            : i18n.language === "hi"
                                                                ? "उच्च जोखिम अलर्ट"
                                                                : "High Risk Alerts",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-warning">
                                            {stats.highRiskAlerts}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        ⚠️
                                    </div>

                                </div>

                                <Link
                                    to="/pest-alerts"
                                    className="btn btn-outline-warning btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.checkAlerts",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "सूचना तपासा"
                                                    : i18n.language === "hi"
                                                        ? "अलर्ट देखें"
                                                        : "Check Alerts",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.criticalAlerts",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "गंभीर सूचना"
                                                            : i18n.language === "hi"
                                                                ? "गंभीर अलर्ट"
                                                                : "Critical Alerts",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-danger">
                                            {stats.criticalAlerts}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🚨
                                    </div>

                                </div>

                                <Link
                                    to="/pest-alerts"
                                    className="btn btn-outline-danger btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.checkCriticalAlerts",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "गंभीर सूचना तपासा"
                                                    : i18n.language === "hi"
                                                        ? "गंभीर अलर्ट देखें"
                                                        : "Check Critical Alerts",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* SOIL ANALYSIS STATISTICS */}

                <div className="row g-4 mb-4">

                    <div className="col-md-4">

                        <div className="dashboard-stat-card dashboard-stat-card-modern">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.totalSoilAnalyses",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "एकूण माती विश्लेषणे"
                                                            : i18n.language === "hi"
                                                                ? "कुल मिट्टी विश्लेषण"
                                                                : "Total Soil Analyses",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-success">
                                            {stats.totalSoilAnalyses}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🌱
                                    </div>

                                </div>

                                <Link
                                    to="/soil-analysis?filter=all"
                                    className="btn btn-outline-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.viewSoilAnalysis",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "माती विश्लेषण पहा"
                                                    : i18n.language === "hi"
                                                        ? "मिट्टी विश्लेषण देखें"
                                                        : "View Soil Analysis",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow-sm border-0 h-100 dashboard-inner-card">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.goodExcellentSoil",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "चांगली / उत्कृष्ट माती"
                                                            : i18n.language === "hi"
                                                                ? "अच्छी / उत्कृष्ट मिट्टी"
                                                                : "Good / Excellent Soil",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-primary">
                                            {stats.goodSoils}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🌱
                                    </div>

                                </div>

                                <Link
                                    to="/soil-analysis?filter=good"
                                    className="btn btn-outline-primary btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.checkSoilHealth",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "मातीची गुणवत्ता तपासा"
                                                    : i18n.language === "hi"
                                                        ? "मिट्टी की गुणवत्ता देखें"
                                                        : "Check Soil Health",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow-sm border-0 h-100 dashboard-inner-card">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            {t(
                                                "dashboard.poorSoil",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "खराब माती"
                                                            : i18n.language === "hi"
                                                                ? "खराब मिट्टी"
                                                                : "Poor Soil",
                                                }
                                            )}
                                        </p>

                                        <h2 className="fw-bold text-danger">
                                            {stats.poorSoils}
                                        </h2>

                                    </div>

                                    <div className="dashboard-stat-icon">
                                        🔴
                                    </div>

                                </div>

                                <Link
                                    to="/soil-analysis?filter=poor"
                                    className="btn btn-outline-danger btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.improveSoil",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "माती सुधारणा करा"
                                                    : i18n.language === "hi"
                                                        ? "मिट्टी सुधारें"
                                                        : "Improve Soil",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* SOIL ANALYSIS CHART */}

                <div className="card dashboard-soil-chart shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">

                            🌱{" "}
                            {t(
                                "dashboard.soilHealthOverview",
                                {
                                    defaultValue:
                                        i18n.language === "mr"
                                            ? "मातीच्या गुणवत्तेचा आढावा"
                                            : i18n.language === "hi"
                                                ? "मिट्टी की गुणवत्ता का अवलोकन"
                                                : "Soil Health Overview",
                                }
                            )}

                        </h5>

                        {stats.totalSoilAnalyses > 0 ? (

                            <div
                                style={{
                                    width: "100%",
                                    height: 320,
                                }}
                            >

                                <ResponsiveContainer>

                                    <PieChart>

                                        <Pie
                                            data={soilChartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="value"
                                            nameKey="name"
                                            label
                                        >

                                            {soilChartData.map(
                                                (entry, index) => (

                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            index === 0
                                                                ? "#198754"
                                                                : index === 1
                                                                    ? "#dc3545"
                                                                    : "#ffc107"
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        ) : (

                            <div className="text-center text-muted py-5">

                                {t(
                                    "dashboard.noSoilAnalysisData",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "माती विश्लेषणाची माहिती उपलब्ध नाही."
                                                : i18n.language === "hi"
                                                    ? "मिट्टी विश्लेषण डेटा उपलब्ध नहीं है।"
                                                    : "No soil analysis data available.",
                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

                {/* MARKET PRICE ANALYTICS */}

                <div className="card dashboard-market-chart shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <h4 className="fw-bold mb-3">

                            📈{" "}
                            {t(
                                "dashboard.marketPriceAnalytics",
                                {
                                    defaultValue:
                                        i18n.language === "mr"
                                            ? "बाजार भाव विश्लेषण"
                                            : i18n.language === "hi"
                                                ? "बाजार भाव विश्लेषण"
                                                : "Market Price Analytics",
                                }
                            )}

                        </h4>

                        {marketChartData.length > 0 ? (

                            <div
                                style={{
                                    width: "100%",
                                    height: 350,
                                }}
                            >

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <BarChart
                                        data={marketChartData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="cropName"
                                            tick={{
                                                fontSize: 12,
                                            }}
                                        />

                                        <YAxis
                                            tick={{
                                                fontSize: 12,
                                            }}
                                        />

                                        <Tooltip
                                            formatter={(value) => [
                                                `₹${value}`,
                                                t(
                                                    "dashboard.price",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "भाव"
                                                                : i18n.language === "hi"
                                                                    ? "भाव"
                                                                    : "Price",
                                                    }
                                                ),
                                            ]}
                                        />

                                        <Legend />

                                        <Bar
                                            dataKey="minPrice"
                                            name={t(
                                                "dashboard.minimumPrice",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "किमान भाव"
                                                            : i18n.language === "hi"
                                                                ? "न्यूनतम भाव"
                                                                : "Minimum Price",
                                                }
                                            )}
                                            fill="#0d6efd"
                                            radius={[
                                                4,
                                                4,
                                                0,
                                                0,
                                            ]}
                                        />

                                        <Bar
                                            dataKey="modalPrice"
                                            name={t(
                                                "dashboard.modalPrice",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "प्रचलित भाव"
                                                            : i18n.language === "hi"
                                                                ? "मॉडल भाव"
                                                                : "Modal Price",
                                                }
                                            )}
                                            fill="#198754"
                                            radius={[
                                                4,
                                                4,
                                                0,
                                                0,
                                            ]}
                                        />

                                        <Bar
                                            dataKey="maxPrice"
                                            name={t(
                                                "dashboard.maximumPrice",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "कमाल भाव"
                                                            : i18n.language === "hi"
                                                                ? "अधिकतम भाव"
                                                                : "Maximum Price",
                                                }
                                            )}
                                            fill="#dc3545"
                                            radius={[
                                                4,
                                                4,
                                                0,
                                                0,
                                            ]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        ) : (

                            <div className="text-center text-muted py-5">

                                <div
                                    style={{
                                        fontSize: "45px",
                                    }}
                                >
                                    📊
                                </div>

                                <p className="mb-0">

                                    {t(
                                        "dashboard.noMarketPriceData",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "बाजार भावाची माहिती उपलब्ध नाही."
                                                    : i18n.language === "hi"
                                                        ? "बाजार भाव का डेटा उपलब्ध नहीं है।"
                                                        : "No market price data available.",
                                        }
                                    )}

                                </p>

                                <Link
                                    to="/market-prices"
                                    className="btn btn-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.addMarketPrice",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "बाजार भाव जोडा"
                                                    : i18n.language === "hi"
                                                        ? "बाजार भाव जोड़ें"
                                                        : "Add Market Price",
                                        }
                                    )}
                                </Link>

                            </div>

                        )}

                    </div>

                </div>

                {/* WEATHER DETAILS */}

                <div className="row g-4 mb-4 dashboard-weather-grid">

                    <div className="col-lg-6">

                        <div className="card shadow-sm border-0 h-100 dashboard-inner-card">

                            <div className="card-body">

                                <h4 className="fw-bold mb-3">

                                    🌦️{" "}
                                    {t(
                                        "dashboard.currentWeather",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "सध्याचे हवामान"
                                                    : i18n.language === "hi"
                                                        ? "वर्तमान मौसम"
                                                        : "Current Weather",
                                        }
                                    )}

                                </h4>

                                {weather ? (

                                    <div className="row g-3">

                                        <div className="col-6">

                                            <div className="p-3 bg-light rounded">

                                                <small className="text-muted">
                                                    {t(
                                                        "dashboard.temperature",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "तापमान"
                                                                    : i18n.language === "hi"
                                                                        ? "तापमान"
                                                                        : "Temperature",
                                                        }
                                                    )}
                                                </small>

                                                <h5 className="fw-bold mt-1">

                                                    {Math.round(
                                                        weather
                                                            .main
                                                            .temp
                                                    )}
                                                    °C

                                                </h5>

                                            </div>

                                        </div>

                                        <div className="col-6">

                                            <div className="p-3 bg-light rounded">

                                                <small className="text-muted">
                                                    {t(
                                                        "dashboard.feelsLike",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "जाणवणारे तापमान"
                                                                    : i18n.language === "hi"
                                                                        ? "महसूस होने वाला तापमान"
                                                                        : "Feels Like",
                                                        }
                                                    )}
                                                </small>

                                                <h5 className="fw-bold mt-1">

                                                    {Math.round(
                                                        weather
                                                            .main
                                                            .feels_like
                                                    )}
                                                    °C

                                                </h5>

                                            </div>

                                        </div>

                                        <div className="col-6">

                                            <div className="p-3 bg-light rounded">

                                                <small className="text-muted">
                                                    {t(
                                                        "dashboard.humidity",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "आर्द्रता"
                                                                    : i18n.language === "hi"
                                                                        ? "नमी"
                                                                        : "Humidity",
                                                        }
                                                    )}
                                                </small>

                                                <h5 className="fw-bold mt-1">

                                                    {
                                                        weather
                                                            .main
                                                            .humidity
                                                    }
                                                    %

                                                </h5>

                                            </div>

                                        </div>

                                        <div className="col-6">

                                            <div className="p-3 bg-light rounded">

                                                <small className="text-muted">
                                                    {t(
                                                        "dashboard.windSpeed",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "वाऱ्याचा वेग"
                                                                    : i18n.language === "hi"
                                                                        ? "हवा की गति"
                                                                        : "Wind Speed",
                                                        }
                                                    )}
                                                </small>

                                                <h5 className="fw-bold mt-1">

                                                    {
                                                        weather
                                                            .wind
                                                            .speed
                                                    }{" "}
                                                    m/s

                                                </h5>

                                            </div>

                                        </div>

                                    </div>

                                ) : (

                                    <p className="text-muted">

                                        {weatherError ||
                                            t(
                                                "dashboard.weatherDataUnavailable",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "हवामानाची माहिती उपलब्ध नाही."
                                                            : i18n.language === "hi"
                                                                ? "मौसम डेटा उपलब्ध नहीं है।"
                                                                : "Weather data unavailable.",
                                                }
                                            )}

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* FARMING ADVICE */}

                    <div className="col-lg-6">

                        <div className="card shadow-sm border-0 h-100 dashboard-inner-card">

                            <div className="card-body">

                                <h4 className="fw-bold mb-3">

                                    👨‍🌾{" "}
                                    {t(
                                        "dashboard.smartFarmingAdvice",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "स्मार्ट शेती सल्ला"
                                                    : i18n.language === "hi"
                                                        ? "स्मार्ट कृषि सलाह"
                                                        : "Smart Farming Advice",
                                        }
                                    )}

                                </h4>

                                <div className="alert alert-success mb-0">
                                    {getFarmingAdvice()}
                                </div>

                                <Link
                                    to="/weather"
                                    className="btn btn-outline-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.viewFullWeatherForecast",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "संपूर्ण हवामान अंदाज पहा"
                                                    : i18n.language === "hi"
                                                        ? "पूरा मौसम पूर्वानुमान देखें"
                                                        : "View Full Weather Forecast",
                                        }
                                    )}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="card dashboard-quick-actions shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <h4 className="fw-bold mb-3">

                            ⚡{" "}
                            {t(
                                "dashboard.quickActions",
                                {
                                    defaultValue:
                                        i18n.language === "mr"
                                            ? "जलद कृती"
                                            : i18n.language === "hi"
                                                ? "त्वरित कार्य"
                                                : "Quick Actions",
                                }
                            )}

                        </h4>

                        <div className="d-flex flex-wrap gap-2">

                            <Link
                                to="/crops"
                                className="btn btn-success"
                            >
                                ➕{" "}
                                {t(
                                    "dashboard.addCrop",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "पीक जोडा"
                                                : i18n.language === "hi"
                                                    ? "फसल जोड़ें"
                                                    : "Add Crop",
                                    }
                                )}
                            </Link>

                            <Link
                                to="/weather"
                                className="btn btn-primary"
                            >
                                🌦️{" "}
                                {t(
                                    "dashboard.checkWeather",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "हवामान तपासा"
                                                : i18n.language === "hi"
                                                    ? "मौसम देखें"
                                                    : "Check Weather",
                                    }
                                )}
                            </Link>

                            <Link
                                to="/market-prices"
                                className="btn btn-warning"
                            >
                                💰{" "}
                                {t(
                                    "common.marketPrices",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "बाजार भाव"
                                                : i18n.language === "hi"
                                                    ? "बाजार भाव"
                                                    : "Market Prices",
                                    }
                                )}
                            </Link>

                            <Link
                                to="/soil-analysis"
                                className="btn btn-outline-success"
                            >
                                🌱{" "}
                                {t(
                                    "common.soilAnalysis",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "माती विश्लेषण"
                                                : i18n.language === "hi"
                                                    ? "मिट्टी विश्लेषण"
                                                    : "Soil Analysis",
                                    }
                                )}
                            </Link>

                            <Link
                                to="/pest-alerts"
                                className="btn btn-outline-danger"
                            >
                                🐛{" "}
                                {t(
                                    "common.pestAlerts",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "किडीच्या सूचना"
                                                : i18n.language === "hi"
                                                    ? "कीट अलर्ट"
                                                    : "Pest Alerts",
                                    }
                                )}
                            </Link>

                        </div>

                    </div>

                </div>

                {/* UPCOMING CROP ACTIVITIES */}

                <div className="card dashboard-activities shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">

                                🌱{" "}
                                {t(
                                    "dashboard.upcomingCropActivities",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "आगामी पीक कामे"
                                                : i18n.language === "hi"
                                                    ? "आगामी फसल गतिविधियाँ"
                                                    : "Upcoming Crop Activities",
                                    }
                                )}

                            </h4>

                            <Link
                                to="/crops"
                                className="btn btn-outline-success btn-sm"
                            >
                                {t(
                                    "dashboard.viewCrops",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "पिके पहा"
                                                : i18n.language === "hi"
                                                    ? "फसलें देखें"
                                                    : "View Crops",
                                    }
                                )}
                            </Link>

                        </div>

                        {!stats.upcomingActivities ||
                            stats.upcomingActivities.length ===
                            0 ? (

                            <div className="alert alert-info mb-0">

                                {t(
                                    "dashboard.noUpcomingActivities",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "आगामी पीक कामांची माहिती उपलब्ध नाही."
                                                : i18n.language === "hi"
                                                    ? "आगामी फसल गतिविधियों की जानकारी उपलब्ध नहीं है।"
                                                    : "No upcoming crop activities available.",
                                    }
                                )}

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-success">

                                        <tr>

                                            <th>
                                                {t(
                                                    "dashboard.crop",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "पीक"
                                                                : i18n.language === "hi"
                                                                    ? "फसल"
                                                                    : "Crop",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.cropType",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "पिकाचा प्रकार"
                                                                : i18n.language === "hi"
                                                                    ? "फसल का प्रकार"
                                                                    : "Crop Type",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.area",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "क्षेत्रफळ"
                                                                : i18n.language === "hi"
                                                                    ? "क्षेत्रफल"
                                                                    : "Area",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.soilType",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "मातीचा प्रकार"
                                                                : i18n.language === "hi"
                                                                    ? "मिट्टी का प्रकार"
                                                                    : "Soil Type",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.expectedHarvest",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "अपेक्षित कापणी"
                                                                : i18n.language === "hi"
                                                                    ? "अपेक्षित कटाई"
                                                                    : "Expected Harvest",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.countdown",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "काउंटडाउन"
                                                                : i18n.language === "hi"
                                                                    ? "काउंटडाउन"
                                                                    : "Countdown",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.status",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "स्थिती"
                                                                : i18n.language === "hi"
                                                                    ? "स्थिति"
                                                                    : "Status",
                                                    }
                                                )}
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {stats.upcomingActivities.map(
                                            (crop) => {

                                                const harvestDate =
                                                    new Date(
                                                        crop.expectedHarvestDate
                                                    );

                                                const today =
                                                    new Date();

                                                const difference =
                                                    Math.ceil(
                                                        (harvestDate -
                                                            today) /
                                                        (1000 *
                                                            60 *
                                                            60 *
                                                            24)
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            crop._id
                                                        }
                                                    >

                                                        <td className="fw-semibold">

                                                            🌾{" "}
                                                            {
                                                                crop.cropName
                                                            }

                                                        </td>

                                                        <td>
                                                            {
                                                                crop.cropType
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                crop.area
                                                            }{" "}
                                                            {t(
                                                                "dashboard.acre",
                                                                {
                                                                    defaultValue:
                                                                        i18n.language === "mr"
                                                                            ? "एकर"
                                                                            : i18n.language === "hi"
                                                                                ? "एकड़"
                                                                                : "acre",
                                                                }
                                                            )}
                                                        </td>

                                                        <td>
                                                            {
                                                                crop.soilType
                                                            }
                                                        </td>

                                                        <td>

                                                            {harvestDate.toLocaleDateString(
                                                                getDateLocale(),
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}

                                                        </td>

                                                        <td>

                                                            {difference <=
                                                                0 ? (

                                                                <span className="badge bg-danger">

                                                                    🚨{" "}
                                                                    {t(
                                                                        "dashboard.today",
                                                                        {
                                                                            defaultValue:
                                                                                i18n.language === "mr"
                                                                                    ? "आज"
                                                                                    : i18n.language === "hi"
                                                                                        ? "आज"
                                                                                        : "Today",
                                                                        }
                                                                    )}

                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-info text-dark">

                                                                    ⏳{" "}
                                                                    {
                                                                        difference
                                                                    }{" "}
                                                                    {t(
                                                                        "dashboard.days",
                                                                        {
                                                                            defaultValue:
                                                                                i18n.language === "mr"
                                                                                    ? "दिवस"
                                                                                    : i18n.language === "hi"
                                                                                        ? "दिन"
                                                                                        : "days",
                                                                        }
                                                                    )}

                                                                </span>

                                                            )}

                                                        </td>

                                                        <td>

                                                            {crop.status ===
                                                                "Growing" && (
                                                                    <span className="badge bg-success">
                                                                        {translateStatus(
                                                                            crop.status
                                                                        )}
                                                                    </span>
                                                                )}

                                                            {crop.status ===
                                                                "Planned" && (
                                                                    <span className="badge bg-warning text-dark">
                                                                        {translateStatus(
                                                                            crop.status
                                                                        )}
                                                                    </span>
                                                                )}

                                                            {crop.status ===
                                                                "Harvested" && (
                                                                    <span className="badge bg-primary">
                                                                        {translateStatus(
                                                                            crop.status
                                                                        )}
                                                                    </span>
                                                                )}

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

                {/* FARMING ALERTS */}

                <div className="card shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <h4 className="fw-bold mb-3">

                            🚨{" "}
                            {t(
                                "dashboard.smartFarmingAlerts",
                                {
                                    defaultValue:
                                        i18n.language === "mr"
                                            ? "स्मार्ट शेती सूचना"
                                            : i18n.language === "hi"
                                                ? "स्मार्ट कृषि चेतावनियाँ"
                                                : "Smart Farming Alerts",
                                }
                            )}

                        </h4>

                        {/* HIGH TEMPERATURE */}

                        {weather &&
                            weather.main.temp >= 35 && (

                                <div className="alert alert-warning">

                                    ☀️{" "}

                                    <strong>

                                        {t(
                                            "dashboard.highTemperatureAlert",
                                            {
                                                defaultValue:
                                                    i18n.language === "mr"
                                                        ? "उच्च तापमान सूचना"
                                                        : i18n.language === "hi"
                                                            ? "उच्च तापमान चेतावनी"
                                                            : "High Temperature Alert",
                                            }
                                        )}
                                        :

                                    </strong>{" "}

                                    {t(
                                        "dashboard.highTemperatureMessage",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "तापमान जास्त आहे. योग्य सिंचन करा आणि पिकांचे उष्णतेपासून संरक्षण करा."
                                                    : i18n.language === "hi"
                                                        ? "तापमान अधिक है। उचित सिंचाई करें और फसलों को गर्मी से बचाएं।"
                                                        : "Temperature is high. Provide adequate irrigation and protect crops from heat.",
                                        }
                                    )}

                                </div>

                            )}

                        {/* HIGH HUMIDITY */}

                        {weather &&
                            weather.main.humidity >= 80 && (

                                <div className="alert alert-warning">

                                    💧{" "}

                                    <strong>

                                        {t(
                                            "dashboard.highHumidityAlert",
                                            {
                                                defaultValue:
                                                    i18n.language === "mr"
                                                        ? "जास्त आर्द्रता सूचना"
                                                        : i18n.language === "hi"
                                                            ? "अधिक नमी चेतावनी"
                                                            : "High Humidity Alert",
                                            }
                                        )}
                                        :

                                    </strong>{" "}

                                    {t(
                                        "dashboard.highHumidityMessage",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "जास्त आर्द्रतेमुळे बुरशीजन्य रोगांचा धोका वाढू शकतो. पिकांचे नियमित निरीक्षण करा."
                                                    : i18n.language === "hi"
                                                        ? "अधिक नमी से फंगल रोगों का खतरा बढ़ सकता है। अपनी फसलों की नियमित निगरानी करें।"
                                                        : "High humidity may increase the risk of fungal diseases. Monitor your crops regularly.",
                                        }
                                    )}

                                </div>

                            )}

                        {/* HEAVY RAIN */}

                        {weather &&
                            weather.rain &&
                            weather.rain["1h"] > 5 && (

                                <div className="alert alert-danger">

                                    🌧️{" "}

                                    <strong>

                                        {t(
                                            "dashboard.heavyRainAlert",
                                            {
                                                defaultValue:
                                                    i18n.language === "mr"
                                                        ? "मुसळधार पावसाची सूचना"
                                                        : i18n.language === "hi"
                                                            ? "भारी बारिश की चेतावनी"
                                                            : "Heavy Rain Alert",
                                            }
                                        )}
                                        :

                                    </strong>{" "}

                                    {t(
                                        "dashboard.heavyRainMessage",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "अनावश्यक सिंचन टाळा आणि शेतातील पाण्याचा निचरा तपासा."
                                                    : i18n.language === "hi"
                                                        ? "अनावश्यक सिंचाई से बचें और खेत में जल निकासी की जाँच करें।"
                                                        : "Avoid unnecessary irrigation and check field drainage.",
                                        }
                                    )}

                                </div>

                            )}

                        {/* CROP HARVEST ALERT */}

                        {stats.upcomingActivities &&
                            stats.upcomingActivities.map(
                                (crop) => {

                                    const harvestDate =
                                        new Date(
                                            crop.expectedHarvestDate
                                        );

                                    const today =
                                        new Date();

                                    const difference =
                                        Math.ceil(
                                            (harvestDate -
                                                today) /
                                            (1000 *
                                                60 *
                                                60 *
                                                24)
                                        );

                                    if (
                                        difference <= 30 &&
                                        difference >= 0
                                    ) {

                                        return (

                                            <div
                                                className="alert alert-info"
                                                key={`harvest-${crop._id}`}
                                            >

                                                🌾{" "}

                                                <strong>

                                                    {t(
                                                        "dashboard.harvestAlert",
                                                        {
                                                            defaultValue:
                                                                i18n.language === "mr"
                                                                    ? "कापणी सूचना"
                                                                    : i18n.language === "hi"
                                                                        ? "कटाई चेतावनी"
                                                                        : "Harvest Alert",
                                                        }
                                                    )}
                                                    :

                                                </strong>{" "}

                                                {crop.cropName}{" "}

                                                {t(
                                                    "dashboard.harvestExpected",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "ची कापणी अपेक्षित आहे"
                                                                : i18n.language === "hi"
                                                                    ? "की कटाई अपेक्षित है"
                                                                    : "harvest is expected within",
                                                    }
                                                )}{" "}

                                                {
                                                    difference
                                                }{" "}

                                                {t(
                                                    "dashboard.days",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "दिवसांत"
                                                                : i18n.language === "hi"
                                                                    ? "दिनों में"
                                                                    : "days",
                                                    }
                                                )}

                                            </div>

                                        );
                                    }

                                    return null;
                                }
                            )}

                        {/* PLANNED CROP ALERT */}

                        {stats.upcomingActivities &&
                            stats.upcomingActivities
                                .filter(
                                    (crop) =>
                                        crop.status ===
                                        "Planned"
                                )
                                .map((crop) => (

                                    <div
                                        className="alert alert-success"
                                        key={`planned-${crop._id}`}
                                    >

                                        🌱{" "}

                                        <strong>

                                            {t(
                                                "dashboard.cropPlanning",
                                                {
                                                    defaultValue:
                                                        i18n.language === "mr"
                                                            ? "पीक नियोजन"
                                                            : i18n.language === "hi"
                                                                ? "फसल योजना"
                                                                : "Crop Planning",
                                                }
                                            )}
                                            :

                                        </strong>{" "}

                                        {crop.cropName}{" "}

                                        {t(
                                            "dashboard.currentlyPlanned",
                                            {
                                                defaultValue:
                                                    i18n.language === "mr"
                                                        ? "सध्या नियोजित आहे."
                                                        : i18n.language === "hi"
                                                            ? "वर्तमान में नियोजित है।"
                                                            : "is currently planned.",
                                            }
                                        )}{" "}

                                        {t(
                                            "dashboard.prepareResources",
                                            {
                                                defaultValue:
                                                    i18n.language === "mr"
                                                        ? "माती, बियाणे आणि आवश्यक साधने तयार ठेवा."
                                                        : i18n.language === "hi"
                                                            ? "मिट्टी, बीज और आवश्यक संसाधन तैयार रखें।"
                                                            : "Prepare soil, seeds and required resources.",
                                            }
                                        )}

                                    </div>

                                ))}

                        {/* CRITICAL PEST ALERT */}

                        {stats.criticalAlerts > 0 && (

                            <div className="alert alert-danger">

                                🚨{" "}

                                <strong>

                                    {t(
                                        "dashboard.criticalPestAlert",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "गंभीर किडीची सूचना"
                                                    : i18n.language === "hi"
                                                        ? "गंभीर कीट अलर्ट"
                                                        : "Critical Pest Alert",
                                        }
                                    )}
                                    :

                                </strong>{" "}

                                {stats.criticalAlerts}{" "}

                                {t(
                                    "dashboard.criticalPestMessage",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "गंभीर किडीच्या सूचना आढळल्या असून तातडीने लक्ष देणे आवश्यक आहे."
                                                : i18n.language === "hi"
                                                    ? "गंभीर कीट अलर्ट पाए गए हैं और तत्काल ध्यान आवश्यक है।"
                                                    : "critical pest alert(s) require immediate attention.",
                                    }
                                )}

                                <br />

                                <Link
                                    to="/pest-alerts"
                                    className="btn btn-sm btn-danger mt-2"
                                >
                                    {t(
                                        "dashboard.viewCriticalAlerts",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "गंभीर सूचना पहा"
                                                    : i18n.language === "hi"
                                                        ? "गंभीर अलर्ट देखें"
                                                        : "View Critical Alerts",
                                        }
                                    )}
                                </Link>

                            </div>

                        )}

                        {/* HIGH RISK PEST ALERT */}

                        {stats.highRiskAlerts > 0 && (

                            <div className="alert alert-warning">

                                ⚠️{" "}

                                <strong>

                                    {t(
                                        "dashboard.highRiskPestAlert",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "उच्च जोखीम किडीची सूचना"
                                                    : i18n.language === "hi"
                                                        ? "उच्च जोखिम कीट अलर्ट"
                                                        : "High Risk Pest Alert",
                                        }
                                    )}
                                    :

                                </strong>{" "}

                                {stats.highRiskAlerts}{" "}

                                {t(
                                    "dashboard.highRiskPestMessage",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "उच्च जोखमीच्या किडीच्या सूचना आढळल्या."
                                                : i18n.language === "hi"
                                                    ? "उच्च जोखिम वाले कीट अलर्ट पाए गए हैं।"
                                                    : "high-risk pest alert(s) found.",
                                    }
                                )}

                            </div>

                        )}

                        {/* POOR SOIL */}

                        {stats.poorSoils > 0 && (

                            <div className="alert alert-danger">

                                🌱{" "}

                                <strong>

                                    {t(
                                        "dashboard.poorSoilHealth",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "खराब मातीची गुणवत्ता"
                                                    : i18n.language === "hi"
                                                        ? "खराब मिट्टी की गुणवत्ता"
                                                        : "Poor Soil Health",
                                        }
                                    )}
                                    :

                                </strong>{" "}

                                {stats.poorSoils}{" "}

                                {t(
                                    "dashboard.poorSoilMessage",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "शेतांमध्ये मातीची गुणवत्ता खराब आहे."
                                                : i18n.language === "hi"
                                                    ? "खेतों में मिट्टी की गुणवत्ता खराब है।"
                                                    : "field(s) have poor soil health.",
                                    }
                                )}

                                <br />

                                <Link
                                    to="/soil-analysis?filter=poor"
                                    className="btn btn-sm btn-danger mt-2"
                                >
                                    {t(
                                        "dashboard.checkPoorSoil",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "खराब माती तपासा"
                                                    : i18n.language === "hi"
                                                        ? "खराब मिट्टी देखें"
                                                        : "Check Poor Soil",
                                        }
                                    )}
                                </Link>

                            </div>

                        )}

                        {/* DEFAULT MESSAGE */}

                        {weather &&
                            weather.main.temp < 35 &&
                            weather.main.humidity < 80 &&
                            (!weather.rain ||
                                !weather.rain["1h"] ||
                                weather.rain["1h"] <= 5) &&
                            (!stats.upcomingActivities ||
                                stats.upcomingActivities
                                    .length === 0) &&
                            stats.criticalAlerts === 0 &&
                            stats.highRiskAlerts === 0 &&
                            stats.poorSoils === 0 && (

                                <div className="alert alert-success mb-0">

                                    ✅{" "}

                                    {t(
                                        "dashboard.noMajorAlerts",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "सध्या कोणत्याही मोठ्या शेती सूचना नाहीत."
                                                    : i18n.language === "hi"
                                                        ? "फिलहाल कोई बड़ी कृषि चेतावनी नहीं है।"
                                                        : "No major farming alerts at the moment.",
                                        }
                                    )}

                                </div>

                            )}

                    </div>

                </div>

                {/* RECENT PEST ALERTS */}

                <div className="card dashboard-recent-alerts shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">

                                🐛{" "}
                                {t(
                                    "dashboard.recentPestAlerts",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "अलीकडील किडीच्या सूचना"
                                                : i18n.language === "hi"
                                                    ? "हाल के कीट अलर्ट"
                                                    : "Recent Pest Alerts",
                                    }
                                )}

                            </h4>

                            <Link
                                to="/pest-alerts"
                                className="btn btn-outline-danger btn-sm"
                            >
                                {t(
                                    "dashboard.viewAll",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "सर्व पहा"
                                                : i18n.language === "hi"
                                                    ? "सभी देखें"
                                                    : "View All",
                                    }
                                )}
                            </Link>

                        </div>

                        {!stats.recentPestAlerts ||
                            stats.recentPestAlerts.length ===
                            0 ? (

                            <div className="alert alert-info mb-0">

                                {t(
                                    "dashboard.noPestAlerts",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "किडीच्या सूचना उपलब्ध नाहीत."
                                                : i18n.language === "hi"
                                                    ? "कोई कीट अलर्ट उपलब्ध नहीं है।"
                                                    : "No pest alerts available.",
                                    }
                                )}

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-danger">

                                        <tr>

                                            <th>
                                                {t(
                                                    "dashboard.crop",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "पीक"
                                                                : i18n.language === "hi"
                                                                    ? "फसल"
                                                                    : "Crop",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.pest",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "कीड"
                                                                : i18n.language === "hi"
                                                                    ? "कीट"
                                                                    : "Pest",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.disease",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "रोग"
                                                                : i18n.language === "hi"
                                                                    ? "रोग"
                                                                    : "Disease",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.riskLevel",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "जोखीम पातळी"
                                                                : i18n.language === "hi"
                                                                    ? "जोखिम स्तर"
                                                                    : "Risk Level",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.season",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "हंगाम"
                                                                : i18n.language === "hi"
                                                                    ? "मौसम"
                                                                    : "Season",
                                                    }
                                                )}
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {stats.recentPestAlerts.map(
                                            (alert) => (

                                                <tr
                                                    key={
                                                        alert._id
                                                    }
                                                >

                                                    <td className="fw-semibold">

                                                        🌱{" "}
                                                        {
                                                            alert.cropName
                                                        }

                                                    </td>

                                                    <td>

                                                        🐛{" "}
                                                        {
                                                            alert.pestName
                                                        }

                                                    </td>

                                                    <td>

                                                        {
                                                            alert.diseaseName ||
                                                            t(
                                                                "dashboard.notAvailable",
                                                                {
                                                                    defaultValue:
                                                                        i18n.language === "mr"
                                                                            ? "उपलब्ध नाही"
                                                                            : i18n.language === "hi"
                                                                                ? "उपलब्ध नहीं"
                                                                                : "N/A",
                                                                }
                                                            )
                                                        }

                                                    </td>

                                                    <td>

                                                        {alert.riskLevel ===
                                                            "Critical" && (

                                                                <span className="badge bg-danger">

                                                                    🚨{" "}
                                                                    {translateRiskLevel(
                                                                        alert.riskLevel
                                                                    )}

                                                                </span>

                                                            )}

                                                        {alert.riskLevel ===
                                                            "High" && (

                                                                <span className="badge bg-warning text-dark">

                                                                    ⚠️{" "}
                                                                    {translateRiskLevel(
                                                                        alert.riskLevel
                                                                    )}

                                                                </span>

                                                            )}

                                                        {alert.riskLevel ===
                                                            "Medium" && (

                                                                <span className="badge bg-info text-dark">

                                                                    ℹ️{" "}
                                                                    {translateRiskLevel(
                                                                        alert.riskLevel
                                                                    )}

                                                                </span>

                                                            )}

                                                        {alert.riskLevel ===
                                                            "Low" && (

                                                                <span className="badge bg-success">

                                                                    ✅{" "}
                                                                    {translateRiskLevel(
                                                                        alert.riskLevel
                                                                    )}

                                                                </span>

                                                            )}

                                                    </td>

                                                    <td>

                                                        {
                                                            alert.affectedSeason ||
                                                            t(
                                                                "dashboard.notAvailable",
                                                                {
                                                                    defaultValue:
                                                                        i18n.language === "mr"
                                                                            ? "उपलब्ध नाही"
                                                                            : i18n.language === "hi"
                                                                                ? "उपलब्ध नहीं"
                                                                                : "N/A",
                                                                }
                                                            )
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

                {/* RECENT SOIL ANALYSIS */}

                <div className="card dashboard-recent-soil shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-header bg-white border-0 pt-4 px-4">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h4 className="fw-bold mb-1">

                                    🌱{" "}
                                    {t(
                                        "dashboard.recentSoilAnalysis",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "अलीकडील माती विश्लेषण"
                                                    : i18n.language === "hi"
                                                        ? "हाल के मिट्टी विश्लेषण"
                                                        : "Recent Soil Analysis",
                                        }
                                    )}

                                </h4>

                                <p className="text-muted mb-0">

                                    {t(
                                        "dashboard.latestSoilRecords",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "नवीनतम माती गुणवत्तेच्या नोंदी"
                                                    : i18n.language === "hi"
                                                        ? "नवीनतम मिट्टी गुणवत्ता रिकॉर्ड"
                                                        : "Latest soil health records",
                                        }
                                    )}

                                </p>

                            </div>

                            <Link
                                to="/soil-analysis"
                                className="btn btn-outline-success btn-sm"
                            >
                                {t(
                                    "dashboard.viewAll",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "सर्व पहा"
                                                : i18n.language === "hi"
                                                    ? "सभी देखें"
                                                    : "View All",
                                    }
                                )}
                            </Link>

                        </div>

                    </div>

                    <div className="card-body px-4">

                        {stats.recentSoilAnalyses &&
                            stats.recentSoilAnalyses.length >
                            0 ? (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-success">

                                        <tr>

                                            <th>
                                                {t(
                                                    "dashboard.field",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "शेत"
                                                                : i18n.language === "hi"
                                                                    ? "खेत"
                                                                    : "Field",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.soilType",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "मातीचा प्रकार"
                                                                : i18n.language === "hi"
                                                                    ? "मिट्टी का प्रकार"
                                                                    : "Soil Type",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                pH
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.nitrogen",
                                                    {
                                                        defaultValue:
                                                            "Nitrogen",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.phosphorus",
                                                    {
                                                        defaultValue:
                                                            "Phosphorus",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.potassium",
                                                    {
                                                        defaultValue:
                                                            "Potassium",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.health",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "गुणवत्ता"
                                                                : i18n.language === "hi"
                                                                    ? "गुणवत्ता"
                                                                    : "Health",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.season",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "हंगाम"
                                                                : i18n.language === "hi"
                                                                    ? "मौसम"
                                                                    : "Season",
                                                    }
                                                )}
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {stats.recentSoilAnalyses.map(
                                            (soil) => (

                                                <tr
                                                    key={
                                                        soil._id
                                                    }
                                                >

                                                    <td className="fw-semibold">

                                                        🌱{" "}
                                                        {
                                                            soil.fieldName
                                                        }

                                                    </td>

                                                    <td>
                                                        {
                                                            soil.soilType
                                                        }
                                                    </td>

                                                    <td>

                                                        <span className="badge bg-info text-dark">

                                                            {
                                                                soil.ph
                                                            }

                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            soil.nitrogen
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            soil.phosphorus
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            soil.potassium
                                                        }
                                                    </td>

                                                    <td>

                                                        {getSoilHealthBadge(
                                                            soil.soilHealth
                                                        )}

                                                    </td>

                                                    <td>

                                                        <span className="badge bg-secondary">

                                                            {
                                                                soil.season ||
                                                                t(
                                                                    "dashboard.notAvailable",
                                                                    {
                                                                        defaultValue:
                                                                            i18n.language === "mr"
                                                                                ? "उपलब्ध नाही"
                                                                                : i18n.language === "hi"
                                                                                    ? "उपलब्ध नहीं"
                                                                                    : "N/A",
                                                                    }
                                                                )
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="text-center py-4">

                                <div
                                    style={{
                                        fontSize: "45px",
                                    }}
                                >
                                    🌱
                                </div>

                                <p className="text-muted mb-0">

                                    {t(
                                        "dashboard.noSoilRecords",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "माती विश्लेषणाच्या नोंदी उपलब्ध नाहीत."
                                                    : i18n.language === "hi"
                                                        ? "मिट्टी विश्लेषण के रिकॉर्ड उपलब्ध नहीं हैं।"
                                                        : "No soil analysis records available.",
                                        }
                                    )}

                                </p>

                                <Link
                                    to="/soil-analysis"
                                    className="btn btn-success btn-sm mt-3"
                                >
                                    {t(
                                        "dashboard.addSoilAnalysis",
                                        {
                                            defaultValue:
                                                i18n.language === "mr"
                                                    ? "माती विश्लेषण जोडा"
                                                    : i18n.language === "hi"
                                                        ? "मिट्टी विश्लेषण जोड़ें"
                                                        : "Add Soil Analysis",
                                        }
                                    )}
                                </Link>

                            </div>

                        )}

                    </div>

                </div>

                {/* RECENT MARKET PRICES */}

                <div className="card dashboard-recent-market shadow-sm border-0 mb-4 dashboard-section-card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">

                                📈{" "}
                                {t(
                                    "dashboard.recentMarketPrices",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "अलीकडील बाजार भाव"
                                                : i18n.language === "hi"
                                                    ? "हाल के बाजार भाव"
                                                    : "Recent Market Prices",
                                    }
                                )}

                            </h4>

                            <Link
                                to="/market-prices"
                                className="btn btn-outline-success btn-sm"
                            >
                                {t(
                                    "dashboard.viewAll",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "सर्व पहा"
                                                : i18n.language === "hi"
                                                    ? "सभी देखें"
                                                    : "View All",
                                    }
                                )}
                            </Link>

                        </div>

                        {stats.recentMarketPrices &&
                            stats.recentMarketPrices.length >
                            0 ? (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-success">

                                        <tr>

                                            <th>
                                                {t(
                                                    "dashboard.crop",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "पीक"
                                                                : i18n.language === "hi"
                                                                    ? "फसल"
                                                                    : "Crop",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.market",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "बाजार"
                                                                : i18n.language === "hi"
                                                                    ? "बाजार"
                                                                    : "Market",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.district",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "जिल्हा"
                                                                : i18n.language === "hi"
                                                                    ? "जिला"
                                                                    : "District",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.minPrice",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "किमान भाव"
                                                                : i18n.language === "hi"
                                                                    ? "न्यूनतम भाव"
                                                                    : "Min Price",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.modalPrice",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "प्रचलित भाव"
                                                                : i18n.language === "hi"
                                                                    ? "मॉडल भाव"
                                                                    : "Modal Price",
                                                    }
                                                )}
                                            </th>

                                            <th>
                                                {t(
                                                    "dashboard.maxPrice",
                                                    {
                                                        defaultValue:
                                                            i18n.language === "mr"
                                                                ? "कमाल भाव"
                                                                : i18n.language === "hi"
                                                                    ? "अधिकतम भाव"
                                                                    : "Max Price",
                                                    }
                                                )}
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {stats.recentMarketPrices.map(
                                            (item) => (

                                                <tr
                                                    key={
                                                        item._id
                                                    }
                                                >

                                                    <td className="fw-semibold">
                                                        {
                                                            item.cropName
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.marketName
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.district
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {
                                                            item.minPrice
                                                        }
                                                    </td>

                                                    <td className="fw-bold text-success">
                                                        ₹
                                                        {
                                                            item.modalPrice
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {
                                                            item.maxPrice
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <p className="text-muted mb-0">

                                {t(
                                    "dashboard.noMarketRecords",
                                    {
                                        defaultValue:
                                            i18n.language === "mr"
                                                ? "बाजार भावाच्या नोंदी उपलब्ध नाहीत."
                                                : i18n.language === "hi"
                                                    ? "बाजार भाव के रिकॉर्ड उपलब्ध नहीं हैं।"
                                                    : "No market price records available.",
                                    }
                                )}

                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

function Weather() {
    const { t } = useTranslation();

    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // GET CURRENT LANGUAGE LOCALE
    // ==========================================
    const getLocale = () => {
        if (i18n.language === "mr") return "mr-IN";
        if (i18n.language === "hi") return "hi-IN";
        return "en-IN";
    };

    // ==========================================
    // TRANSLATE WEATHER CONDITION
    // ==========================================
    const translateCondition = (condition) => {
        if (!condition) return "";

        const value = condition.toLowerCase();

        if (value.includes("clear")) {
            return t("weather.conditions.clear", {
                defaultValue: "Clear Sky",
            });
        }

        if (value.includes("few clouds")) {
            return t("weather.conditions.fewClouds", {
                defaultValue: "Few Clouds",
            });
        }

        if (value.includes("scattered clouds")) {
            return t("weather.conditions.scatteredClouds", {
                defaultValue: "Scattered Clouds",
            });
        }

        if (value.includes("broken clouds")) {
            return t("weather.conditions.brokenClouds", {
                defaultValue: "Broken Clouds",
            });
        }

        if (value.includes("overcast clouds")) {
            return t("weather.conditions.overcastClouds", {
                defaultValue: "Overcast Clouds",
            });
        }

        if (value.includes("cloud")) {
            return t("weather.conditions.cloudy", {
                defaultValue: "Cloudy",
            });
        }

        if (
            value.includes("light rain") ||
            value.includes("drizzle")
        ) {
            return t("weather.conditions.lightRain", {
                defaultValue: "Light Rain",
            });
        }

        if (value.includes("moderate rain")) {
            return t("weather.conditions.moderateRain", {
                defaultValue: "Moderate Rain",
            });
        }

        if (
            value.includes("heavy rain") ||
            value.includes("extreme rain")
        ) {
            return t("weather.conditions.heavyRain", {
                defaultValue: "Heavy Rain",
            });
        }

        if (value.includes("rain")) {
            return t("weather.conditions.rain", {
                defaultValue: "Rain",
            });
        }

        if (value.includes("thunderstorm")) {
            return t("weather.conditions.thunderstorm", {
                defaultValue: "Thunderstorm",
            });
        }

        if (value.includes("snow")) {
            return t("weather.conditions.snow", {
                defaultValue: "Snow",
            });
        }

        if (
            value.includes("mist") ||
            value.includes("fog") ||
            value.includes("haze")
        ) {
            return t("weather.conditions.mist", {
                defaultValue: "Mist / Haze",
            });
        }

        return condition;
    };

    // ==========================================
    // WEATHER SEARCH
    // ==========================================
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!city.trim()) {
            setError(
                t("weather.enterLocation", {
                    defaultValue:
                        "Please enter a city or village name",
                })
            );
            return;
        }

        setError("");
        setWeather(null);
        setForecast([]);
        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

            if (!apiKey) {
                setError(
                    t("weather.apiKeyMissing", {
                        defaultValue:
                            "Weather API key is missing.",
                    })
                );

                setLoading(false);
                return;
            }

            // ==========================================
            // STEP 1: FIND LOCATION
            // ==========================================
            const geoResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
                    city
                )},IN&limit=5&appid=${apiKey}`
            );

            const locations = await geoResponse.json();

            if (!locations || locations.length === 0) {
                setError(
                    t("weather.locationNotFound", {
                        defaultValue:
                            "Location not found. Try village name, nearby city or district name.",
                    })
                );

                setLoading(false);
                return;
            }

            const location = locations[0];

            // ==========================================
            // STEP 2: CURRENT WEATHER
            // ==========================================
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
            );

            const data = await weatherResponse.json();

            if (data.cod !== 200) {
                setError(
                    data.message ||
                    t("weather.unableToFetch", {
                        defaultValue:
                            "Unable to fetch weather data",
                    })
                );

                setLoading(false);
                return;
            }

            setWeather({
                city: location.name,
                state: location.state || "",
                country: location.country || "IN",
                temperature: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                condition: data.weather[0].description,
                rainfall: data.rain?.["1h"] || 0,
                pressure: data.main.pressure,
                latitude: location.lat,
                longitude: location.lon,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
            });

            // ==========================================
            // STEP 3: 5-DAY FORECAST
            // ==========================================
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
            );

            const forecastData = await forecastResponse.json();

            if (forecastData.cod === "200") {
                const dailyForecast = [];

                forecastData.list.forEach((item) => {
                    const date = new Date(item.dt * 1000);

                    const day = date.toLocaleDateString(
                        getLocale(),
                        {
                            weekday: "short",
                        }
                    );

                    const existingDay = dailyForecast.find(
                        (item) => item.dayKey === date.toDateString()
                    );

                    if (!existingDay) {
                        dailyForecast.push({
                            day,
                            dayKey: date.toDateString(),

                            date: date.toLocaleDateString(
                                getLocale(),
                                {
                                    day: "numeric",
                                    month: "short",
                                }
                            ),

                            temperature: Math.round(
                                item.main.temp
                            ),

                            feelsLike: Math.round(
                                item.main.feels_like
                            ),

                            humidity: item.main.humidity,

                            condition:
                                item.weather[0].description,

                            icon: item.weather[0].icon,

                            windSpeed: item.wind.speed,

                            rainfall:
                                item.rain?.["3h"] || 0,
                        });
                    }
                });

                setForecast(
                    dailyForecast
                        .slice(0, 5)
                        .map((item) => ({
                            ...item,
                            dayKey: undefined,
                        }))
                );
            }
        } catch (error) {
            console.error(error);

            setError(
                t("weather.fetchError", {
                    defaultValue:
                        "Unable to fetch weather data. Please try again.",
                })
            );
        }

        setLoading(false);
    };

    // ==========================================
    // DATE / TIME FORMAT
    // ==========================================
    const formatTime = (timestamp) => {
        if (!timestamp) return "--";

        return new Date(timestamp * 1000).toLocaleTimeString(
            getLocale(),
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // ==========================================
    // FARMING ADVICE
    // ==========================================
    const getFarmingAdvice = () => {
        if (!weather) return [];

        const advice = [];

        const temp = weather.temperature;
        const humidity = weather.humidity;
        const condition = weather.condition.toLowerCase();
        const rainfall = weather.rainfall;

        // Rainfall Advice
        if (
            rainfall > 0 ||
            condition.includes("rain")
        ) {
            advice.push(
                t("weather.advice.rainPresent", {
                    defaultValue:
                        "🌧️ Rain is present. Avoid unnecessary irrigation and protect harvested crops from moisture.",
                })
            );
        } else {
            advice.push(
                t("weather.advice.noRain", {
                    defaultValue:
                        "💧 No significant rainfall detected. Check soil moisture before irrigation.",
                })
            );
        }

        // Humidity Advice
        if (humidity >= 80) {
            advice.push(
                t("weather.advice.highHumidity", {
                    defaultValue:
                        "💧 High humidity detected. Monitor crops for fungal diseases and improve field ventilation.",
                })
            );
        } else if (humidity <= 40) {
            advice.push(
                t("weather.advice.lowHumidity", {
                    defaultValue:
                        "🏜️ Humidity is low. Monitor soil moisture and irrigation requirements carefully.",
                })
            );
        } else {
            advice.push(
                t("weather.advice.moderateHumidity", {
                    defaultValue:
                        "🌱 Humidity is in a moderate range. Continue regular crop monitoring.",
                })
            );
        }

        // Temperature Advice
        if (temp >= 35) {
            advice.push(
                t("weather.advice.highTemperature", {
                    defaultValue:
                        "🌡️ High temperature detected. Provide adequate irrigation and protect sensitive crops from heat stress.",
                })
            );
        } else if (temp <= 15) {
            advice.push(
                t("weather.advice.lowTemperature", {
                    defaultValue:
                        "❄️ Low temperature detected. Monitor temperature-sensitive crops for cold stress.",
                })
            );
        } else {
            advice.push(
                t("weather.advice.normalTemperature", {
                    defaultValue:
                        "🌾 Temperature is generally suitable for normal crop monitoring.",
                })
            );
        }

        // Wind Advice
        if (weather.windSpeed >= 8) {
            advice.push(
                t("weather.advice.strongWind", {
                    defaultValue:
                        "💨 Strong winds detected. Secure farm structures and monitor tall or weak crops.",
                })
            );
        }

        return advice;
    };

    return (
        <div className="container py-5">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-4">

                <h1 className="text-success fw-bold">
                    🌦️{" "}
                    {t("weather.title", {
                        defaultValue:
                            "Weather Information",
                    })}
                </h1>

                <p className="text-muted">
                    {t("weather.subtitle", {
                        defaultValue:
                            "Get current weather, 5-day forecast and farmer-friendly agricultural advice.",
                    })}
                </p>

            </div>

            {/* ==========================================
                SEARCH
            ========================================== */}

            <div className="card shadow-sm p-4 mb-4">

                <h4 className="text-success mb-3">
                    🔍{" "}
                    {t("weather.searchTitle", {
                        defaultValue:
                            "Search City / Village / Area",
                    })}
                </h4>

                <form onSubmit={handleSearch}>

                    <div className="row">

                        <div className="col-md-8 mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder={t(
                                    "weather.searchPlaceholder",
                                    {
                                        defaultValue:
                                            "Example: Pune, Kolhapur, Ichalkaranji, Kagal",
                                    }
                                )}
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="col-md-4 mb-3">

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? `⏳ ${t(
                                        "weather.searching",
                                        {
                                            defaultValue:
                                                "Searching...",
                                        }
                                    )}`
                                    : `🌤️ ${t(
                                        "weather.checkWeather",
                                        {
                                            defaultValue:
                                                "Check Weather",
                                        }
                                    )}`}
                            </button>

                        </div>

                    </div>

                </form>

                <small className="text-muted">
                    💡{" "}
                    {t("weather.searchHelp", {
                        defaultValue:
                            "You can search for cities, towns, villages or areas.",
                    })}
                </small>

            </div>

            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (
                <div className="alert alert-danger">
                    ❌ {error}
                </div>
            )}

            {/* ==========================================
                CURRENT WEATHER
            ========================================== */}

            {weather && (
                <>

                    <div className="mb-4">

                        <h3 className="text-success fw-bold">
                            🌍{" "}
                            {t("weather.weatherIn", {
                                defaultValue:
                                    "Weather in",
                            })}{" "}
                            {weather.city}
                        </h3>

                        {weather.state && (
                            <p className="text-muted mb-1">
                                📍 {weather.state}, India
                            </p>
                        )}

                        <small className="text-muted">
                            {t("weather.coordinates", {
                                defaultValue:
                                    "Coordinates",
                            })}
                            :{" "}
                            {weather.latitude.toFixed(4)},{" "}
                            {weather.longitude.toFixed(4)}
                        </small>

                    </div>

                    <div className="row">

                        {/* Temperature */}
                        <div className="col-md-4 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    🌡️
                                </div>

                                <h5>
                                    {t("weather.temperature", {
                                        defaultValue:
                                            "Temperature",
                                    })}
                                </h5>

                                <h2 className="text-success">
                                    {weather.temperature}°C
                                </h2>

                                <p className="text-muted">
                                    {t("weather.feelsLike", {
                                        defaultValue:
                                            "Feels like",
                                    })}{" "}
                                    {weather.feelsLike}°C
                                </p>

                            </div>

                        </div>

                        {/* Humidity */}
                        <div className="col-md-4 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    💧
                                </div>

                                <h5>
                                    {t("weather.humidity", {
                                        defaultValue:
                                            "Humidity",
                                    })}
                                </h5>

                                <h2 className="text-success">
                                    {weather.humidity}%
                                </h2>

                            </div>

                        </div>

                        {/* Wind */}
                        <div className="col-md-4 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    💨
                                </div>

                                <h5>
                                    {t("weather.windSpeed", {
                                        defaultValue:
                                            "Wind Speed",
                                    })}
                                </h5>

                                <h2 className="text-success">
                                    {weather.windSpeed} m/s
                                </h2>

                            </div>

                        </div>

                        {/* Condition */}
                        <div className="col-md-6 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    ☁️
                                </div>

                                <h5>
                                    {t(
                                        "weather.weatherCondition",
                                        {
                                            defaultValue:
                                                "Weather Condition",
                                        }
                                    )}
                                </h5>

                                <h3 className="text-success text-capitalize">
                                    {translateCondition(
                                        weather.condition
                                    )}
                                </h3>

                            </div>

                        </div>

                        {/* Rainfall */}
                        <div className="col-md-6 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    🌧️
                                </div>

                                <h5>
                                    {t("weather.rainfall", {
                                        defaultValue:
                                            "Rainfall (Last 1 Hour)",
                                    })}
                                </h5>

                                <h3 className="text-success">
                                    {weather.rainfall} mm
                                </h3>

                            </div>

                        </div>

                        {/* Pressure */}
                        <div className="col-md-6 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    🌬️
                                </div>

                                <h5>
                                    {t(
                                        "weather.atmosphericPressure",
                                        {
                                            defaultValue:
                                                "Atmospheric Pressure",
                                        }
                                    )}
                                </h5>

                                <h3 className="text-success">
                                    {weather.pressure} hPa
                                </h3>

                            </div>

                        </div>

                        {/* Sunrise / Sunset */}
                        <div className="col-md-6 mb-4">

                            <div className="card shadow-sm text-center p-4 h-100">

                                <div className="fs-1">
                                    🌅
                                </div>

                                <h5>
                                    {t("weather.sunriseSunset", {
                                        defaultValue:
                                            "Sunrise & Sunset",
                                    })}
                                </h5>

                                <p className="mb-1">
                                    🌅{" "}
                                    {t("weather.sunrise", {
                                        defaultValue:
                                            "Sunrise",
                                    })}
                                    :{" "}
                                    <strong>
                                        {formatTime(
                                            weather.sunrise
                                        )}
                                    </strong>
                                </p>

                                <p className="mb-0">
                                    🌇{" "}
                                    {t("weather.sunset", {
                                        defaultValue:
                                            "Sunset",
                                    })}
                                    :{" "}
                                    <strong>
                                        {formatTime(
                                            weather.sunset
                                        )}
                                    </strong>
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                        5-DAY FORECAST
                    ========================================== */}

                    {forecast.length > 0 && (

                        <div className="mt-4">

                            <h2 className="text-success fw-bold mb-4">
                                📅{" "}
                                {t("weather.fiveDayForecast", {
                                    defaultValue:
                                        "5-Day Weather Forecast",
                                })}
                            </h2>

                            <div className="row">

                                {forecast.map(
                                    (day, index) => (

                                        <div
                                            className="col-md-6 col-lg mb-4"
                                            key={index}
                                        >

                                            <div className="card shadow-sm text-center h-100">

                                                <div className="card-body">

                                                    <h5 className="text-success fw-bold">
                                                        {day.day}
                                                    </h5>

                                                    <small className="text-muted">
                                                        {day.date}
                                                    </small>

                                                    <div className="my-3">

                                                        <img
                                                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                            alt={translateCondition(
                                                                day.condition
                                                            )}
                                                        />

                                                    </div>

                                                    <h3 className="text-success">
                                                        {
                                                            day.temperature
                                                        }°C
                                                    </h3>

                                                    <p className="text-capitalize">
                                                        {translateCondition(
                                                            day.condition
                                                        )}
                                                    </p>

                                                    <hr />

                                                    <small>
                                                        💧{" "}
                                                        {t(
                                                            "weather.humidity",
                                                            {
                                                                defaultValue:
                                                                    "Humidity",
                                                            }
                                                        )}
                                                        :{" "}
                                                        {
                                                            day.humidity
                                                        }%
                                                    </small>

                                                    <br />

                                                    <small>
                                                        💨{" "}
                                                        {t(
                                                            "weather.windSpeed",
                                                            {
                                                                defaultValue:
                                                                    "Wind",
                                                            }
                                                        )}
                                                        :{" "}
                                                        {
                                                            day.windSpeed
                                                        }{" "}
                                                        m/s
                                                    </small>

                                                    <br />

                                                    <small>
                                                        🌧️{" "}
                                                        {t(
                                                            "weather.rain",
                                                            {
                                                                defaultValue:
                                                                    "Rain",
                                                            }
                                                        )}
                                                        :{" "}
                                                        {
                                                            day.rainfall
                                                        }{" "}
                                                        mm
                                                    </small>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                    {/* ==========================================
                        FARMING ADVICE
                    ========================================== */}

                    <div className="card shadow-sm mt-4 mb-5">

                        <div className="card-header bg-success text-white">

                            <h3 className="mb-0">
                                🌾{" "}
                                {t(
                                    "weather.smartFarmingAdvice",
                                    {
                                        defaultValue:
                                            "Smart Farming Advice",
                                    }
                                )}
                            </h3>

                        </div>

                        <div className="card-body">

                            <p className="text-muted">
                                {t(
                                    "weather.adviceBasedOnWeather",
                                    {
                                        defaultValue:
                                            "Based on the current weather conditions:",
                                    }
                                )}
                            </p>

                            {getFarmingAdvice().map(
                                (advice, index) => (

                                    <div
                                        className="alert alert-light border mb-3"
                                        key={index}
                                    >
                                        {advice}
                                    </div>

                                )
                            )}

                            <small className="text-muted">
                                ⚠️{" "}
                                {t(
                                    "weather.generalAdviceWarning",
                                    {
                                        defaultValue:
                                            "This is general weather-based guidance. Farmers should also consider crop type, soil condition and local agricultural advice.",
                                    }
                                )}
                            </small>

                        </div>

                    </div>

                </>
            )}

        </div>
    );
}

export default Weather;
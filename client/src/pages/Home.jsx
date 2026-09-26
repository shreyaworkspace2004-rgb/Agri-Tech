import { Link } from "react-router-dom";

function Home() {
    return (
        <div>

            {/* =========================
                HERO SECTION
            ========================= */}

            <section
                style={{
                    minHeight: "580px",
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.40)), url('/image/farm-hero.png.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <div className="container py-5">
                    <div className="text-center">

                        {/* BADGE */}
                        <div className="mb-4">
                            <span
                                className="badge rounded-pill px-4 py-2"
                                style={{
                                    backgroundColor:
                                        "rgba(232, 245, 233, 0.95)",
                                    color: "#198754",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                }}
                            >
                                🌱 Smart Agriculture Technology
                            </span>
                        </div>

                        {/* MAIN HEADING */}
                        <h1
                            className="fw-bold mb-3"
                            style={{
                                fontSize: "clamp(55px, 8vw, 100px)",
                                color: "#087f4f",
                                letterSpacing: "-3px",
                                lineHeight: "1",
                                textShadow:
                                    "0 3px 10px rgba(255, 255, 255, 0.9)",
                            }}
                        >
                            🌾 Agri-Tech
                        </h1>

                        {/* SUB HEADING */}
                        <h2
                            className="fw-bold mb-3"
                            style={{
                                color: "#123f31",
                                fontSize: "clamp(28px, 4vw, 46px)",
                                textShadow:
                                    "0 2px 8px rgba(255, 255, 255, 0.9)",
                            }}
                        >
                            Smart Farming for a Better Tomorrow
                        </h2>

                        {/* DESCRIPTION */}
                        <p
                            className="mx-auto mb-4"
                            style={{
                                maxWidth: "750px",
                                color: "#355c4d",
                                fontSize: "18px",
                                lineHeight: "1.7",
                                fontWeight: "500",
                                textShadow:
                                    "0 1px 4px rgba(255, 255, 255, 0.8)",
                            }}
                        >
                            Empowering farmers with modern technology,
                            useful information, crop management and smart
                            agricultural solutions.
                        </p>

                        {/* BUTTONS */}
                        <div className="d-flex justify-content-center flex-wrap gap-3">

                            <Link
                                to="/login"
                                className="btn btn-success btn-lg px-4 py-3 rounded-3 fw-semibold shadow"
                            >
                                🚀 Get Started
                            </Link>

                            <Link
                                to="/dashboard"
                                className="btn btn-outline-success btn-lg px-4 py-3 rounded-3 fw-semibold bg-white"
                            >
                                📊 Learn More
                            </Link>

                        </div>

                    </div>
                </div>
            </section>


            {/* =========================
                FEATURES SECTION
            ========================= */}

            <section className="py-5 bg-white">

                <div className="container">

                    <div className="row text-center g-4">

                        {/* =========================
                            BETTER CROP YIELDS
                        ========================= */}

                        <div className="col-6 col-md">
                            <div className="d-flex flex-column align-items-center h-100">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    <span style={{ fontSize: "35px" }}>
                                        🌿
                                    </span>
                                </div>

                                <h6
                                    className="fw-bold mb-2"
                                    style={{
                                        color: "#17483a",
                                    }}
                                >
                                    Better Crop Yields
                                </h6>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        maxWidth: "180px",
                                    }}
                                >
                                    Get expert advice for healthier crops.
                                </p>

                            </div>
                        </div>


                        {/* =========================
                            REAL-TIME WEATHER
                        ========================= */}

                        <div className="col-6 col-md">
                            <div className="d-flex flex-column align-items-center h-100">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    <span style={{ fontSize: "35px" }}>
                                        🌤️
                                    </span>
                                </div>

                                <h6
                                    className="fw-bold mb-2"
                                    style={{
                                        color: "#17483a",
                                    }}
                                >
                                    Real-time Weather
                                </h6>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        maxWidth: "180px",
                                    }}
                                >
                                    Plan your farming activities better.
                                </p>

                            </div>
                        </div>


                        {/* =========================
                            MARKET INSIGHTS
                        ========================= */}

                        <div className="col-6 col-md">
                            <div className="d-flex flex-column align-items-center h-100">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    <span style={{ fontSize: "35px" }}>
                                        📈
                                    </span>
                                </div>

                                <h6
                                    className="fw-bold mb-2"
                                    style={{
                                        color: "#17483a",
                                    }}
                                >
                                    Market Insights
                                </h6>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        maxWidth: "180px",
                                    }}
                                >
                                    Get the best prices for your produce.
                                </p>

                            </div>
                        </div>


                        {/* =========================
                            PEST MANAGEMENT
                        ========================= */}

                        <div className="col-6 col-md">
                            <div className="d-flex flex-column align-items-center h-100">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    <span style={{ fontSize: "35px" }}>
                                        🐞
                                    </span>
                                </div>

                                <h6
                                    className="fw-bold mb-2"
                                    style={{
                                        color: "#17483a",
                                    }}
                                >
                                    Pest Management
                                </h6>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        maxWidth: "180px",
                                    }}
                                >
                                    Detect and prevent pest attacks early.
                                </p>

                            </div>
                        </div>


                        {/* =========================
                            SOIL HEALTH
                        ========================= */}

                        <div className="col-6 col-md">
                            <div className="d-flex flex-column align-items-center h-100">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    <span style={{ fontSize: "35px" }}>
                                        🧪
                                    </span>
                                </div>

                                <h6
                                    className="fw-bold mb-2"
                                    style={{
                                        color: "#17483a",
                                    }}
                                >
                                    Soil Health
                                </h6>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        maxWidth: "180px",
                                    }}
                                >
                                    Keep your soil fertile and productive.
                                </p>

                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;
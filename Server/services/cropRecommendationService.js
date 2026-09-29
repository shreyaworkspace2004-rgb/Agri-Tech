// ======================================================
// CROP RECOMMENDATION SERVICE
// ======================================================

const getCropRecommendations = ({
    soilType,
    ph,
    nitrogen,
    phosphorus,
    potassium,
    moisture,
    temperature,
    season,
}) => {
    const recommendations = [];

    // --------------------------------------------------
    // Normalize values
    // --------------------------------------------------

    const soil = String(soilType || "").toLowerCase();
    const currentSeason = String(season || "").toLowerCase();

    const pH = Number(ph);
    const N = Number(nitrogen);
    const P = Number(phosphorus);
    const K = Number(potassium);
    const M = Number(moisture);
    const T = Number(temperature);

    // --------------------------------------------------
    // Helper function
    // --------------------------------------------------

    const addCrop = (crop, score, reason) => {
        recommendations.push({
            crop,
            score,
            reason,
        });
    };

    // ==================================================
    // RICE
    // ==================================================

    let riceScore = 0;
    let riceReasons = [];

    if (
        soil.includes("clay") ||
        soil.includes("loam")
    ) {
        riceScore += 25;
        riceReasons.push("Suitable soil type");
    }

    if (M >= 20 && M <= 40) {
        riceScore += 20;
        riceReasons.push("Suitable temperature");
    }

    if (currentSeason === "kharif") {
        riceScore += 25;
        riceReasons.push("Suitable Kharif season");
    }

    if (moisture >= 50) {
        riceScore += 20;
        riceReasons.push("Good soil moisture");
    }

    if (pH >= 5.5 && pH <= 7.0) {
        riceScore += 10;
        riceReasons.push("Suitable soil pH");
    }

    if (riceScore >= 40) {
        addCrop(
            "Rice",
            riceScore,
            riceReasons.join(", ")
        );
    }

    // ==================================================
    // WHEAT
    // ==================================================

    let wheatScore = 0;
    let wheatReasons = [];

    if (
        soil.includes("loam") ||
        soil.includes("clay")
    ) {
        wheatScore += 25;
        wheatReasons.push("Suitable soil type");
    }

    if (T >= 10 && T <= 25) {
        wheatScore += 25;
        wheatReasons.push("Suitable temperature");
    }

    if (currentSeason === "rabi") {
        wheatScore += 30;
        wheatReasons.push("Suitable Rabi season");
    }

    if (pH >= 6.0 && pH <= 7.5) {
        wheatScore += 20;
        wheatReasons.push("Suitable soil pH");
    }

    if (wheatScore >= 40) {
        addCrop(
            "Wheat",
            wheatScore,
            wheatReasons.join(", ")
        );
    }

    // ==================================================
    // COTTON
    // ==================================================

    let cottonScore = 0;
    let cottonReasons = [];

    if (
        soil.includes("black") ||
        soil.includes("loam")
    ) {
        cottonScore += 30;
        cottonReasons.push("Suitable soil type");
    }

    if (T >= 21 && T <= 35) {
        cottonScore += 25;
        cottonReasons.push("Suitable temperature");
    }

    if (currentSeason === "kharif") {
        cottonScore += 25;
        cottonReasons.push("Suitable Kharif season");
    }

    if (pH >= 5.5 && pH <= 8.0) {
        cottonScore += 20;
        cottonReasons.push("Suitable soil pH");
    }

    if (cottonScore >= 40) {
        addCrop(
            "Cotton",
            cottonScore,
            cottonReasons.join(", ")
        );
    }

    // ==================================================
    // MAIZE
    // ==================================================

    let maizeScore = 0;
    let maizeReasons = [];

    if (
        soil.includes("loam") ||
        soil.includes("sandy")
    ) {
        maizeScore += 25;
        maizeReasons.push("Suitable soil type");
    }

    if (T >= 18 && T <= 30) {
        maizeScore += 25;
        maizeReasons.push("Suitable temperature");
    }

    if (
        currentSeason === "kharif" ||
        currentSeason === "summer"
    ) {
        maizeScore += 25;
        maizeReasons.push("Suitable season");
    }

    if (pH >= 5.8 && pH <= 7.5) {
        maizeScore += 15;
        maizeReasons.push("Suitable soil pH");
    }

    if (N >= 40) {
        maizeScore += 10;
        maizeReasons.push("Good nitrogen level");
    }

    if (maizeScore >= 40) {
        addCrop(
            "Maize",
            maizeScore,
            maizeReasons.join(", ")
        );
    }

    // ==================================================
    // SUGARCANE
    // ==================================================

    let sugarcaneScore = 0;
    let sugarcaneReasons = [];

    if (
        soil.includes("loam") ||
        soil.includes("clay")
    ) {
        sugarcaneScore += 25;
        sugarcaneReasons.push("Suitable soil type");
    }

    if (T >= 20 && T <= 35) {
        sugarcaneScore += 25;
        sugarcaneReasons.push("Suitable temperature");
    }

    if (M >= 40) {
        sugarcaneScore += 20;
        sugarcaneReasons.push("Good moisture level");
    }

    if (pH >= 6.0 && pH <= 7.5) {
        sugarcaneScore += 20;
        sugarcaneReasons.push("Suitable soil pH");
    }

    if (N >= 40) {
        sugarcaneScore += 10;
        sugarcaneReasons.push("Good nitrogen level");
    }

    if (sugarcaneScore >= 40) {
        addCrop(
            "Sugarcane",
            sugarcaneScore,
            sugarcaneReasons.join(", ")
        );
    }

    // ==================================================
    // SOYBEAN
    // ==================================================

    let soybeanScore = 0;
    let soybeanReasons = [];

    if (
        soil.includes("loam") ||
        soil.includes("black")
    ) {
        soybeanScore += 30;
        soybeanReasons.push("Suitable soil type");
    }

    if (T >= 20 && T <= 30) {
        soybeanScore += 25;
        soybeanReasons.push("Suitable temperature");
    }

    if (currentSeason === "kharif") {
        soybeanScore += 25;
        soybeanReasons.push("Suitable Kharif season");
    }

    if (pH >= 6.0 && pH <= 7.5) {
        soybeanScore += 20;
        soybeanReasons.push("Suitable soil pH");
    }

    if (soybeanScore >= 40) {
        addCrop(
            "Soybean",
            soybeanScore,
            soybeanReasons.join(", ")
        );
    }

    // ==================================================
    // POTATO
    // ==================================================

    let potatoScore = 0;
    let potatoReasons = [];

    if (
        soil.includes("sandy") ||
        soil.includes("loam")
    ) {
        potatoScore += 30;
        potatoReasons.push("Suitable soil type");
    }

    if (T >= 15 && T <= 25) {
        potatoScore += 25;
        potatoReasons.push("Suitable temperature");
    }

    if (pH >= 5.0 && pH <= 6.5) {
        potatoScore += 25;
        potatoReasons.push("Suitable soil pH");
    }

    if (P >= 30) {
        potatoScore += 10;
        potatoReasons.push("Good phosphorus level");
    }

    if (M >= 30 && M <= 70) {
        potatoScore += 10;
        potatoReasons.push("Suitable moisture level");
    }

    if (potatoScore >= 40) {
        addCrop(
            "Potato",
            potatoScore,
            potatoReasons.join(", ")
        );
    }

    // ==================================================
    // TOMATO
    // ==================================================

    let tomatoScore = 0;
    let tomatoReasons = [];

    if (
        soil.includes("loam") ||
        soil.includes("sandy")
    ) {
        tomatoScore += 25;
        tomatoReasons.push("Suitable soil type");
    }

    if (T >= 18 && T <= 30) {
        tomatoScore += 25;
        tomatoReasons.push("Suitable temperature");
    }

    if (pH >= 6.0 && pH <= 7.0) {
        tomatoScore += 25;
        tomatoReasons.push("Suitable soil pH");
    }

    if (K >= 30) {
        tomatoScore += 15;
        tomatoReasons.push("Good potassium level");
    }

    if (M >= 30 && M <= 70) {
        tomatoScore += 10;
        tomatoReasons.push("Suitable moisture level");
    }

    if (tomatoScore >= 40) {
        addCrop(
            "Tomato",
            tomatoScore,
            tomatoReasons.join(", ")
        );
    }

    // ==================================================
    // SORT BY SCORE
    // ==================================================

    recommendations.sort(
        (a, b) => b.score - a.score
    );

    // Return maximum 5 recommendations
    return recommendations.slice(0, 5);
};


// ======================================================
// FERTILIZER RECOMMENDATION
// ======================================================

const getFertilizerRecommendation = ({
    nitrogen,
    phosphorus,
    potassium,
}) => {
    const recommendations = [];

    const N = Number(nitrogen);
    const P = Number(phosphorus);
    const K = Number(potassium);

    if (N < 40) {
        recommendations.push(
            "Nitrogen level is low. Consider nitrogen-rich fertilizer or organic manure."
        );
    }

    if (P < 30) {
        recommendations.push(
            "Phosphorus level is low. Consider phosphorus-rich fertilizer."
        );
    }

    if (K < 30) {
        recommendations.push(
            "Potassium level is low. Consider potassium-rich fertilizer."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "NPK levels appear adequate. Maintain balanced fertilizer application."
        );
    }

    return recommendations;
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getCropRecommendations,
    getFertilizerRecommendation,
};
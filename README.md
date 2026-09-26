# 🌾 Agri-Tech – Smart Agriculture Management System

Agri-Tech is a full-stack smart agriculture web application designed to help farmers manage crops and access useful agricultural information through a simple, responsive and user-friendly interface.

The application provides features such as crop management, weather information, market prices, pest alerts and soil analysis. It also supports multilingual content to make the application easier to use for farmers.

---

## 📌 Project Overview

Agriculture depends heavily on factors such as weather conditions, soil quality, crop health, pest attacks and market prices.

Agri-Tech brings important farming-related information together in one web application.

The system allows farmers to:

- Manage their crops
- Check weather information
- View agricultural market prices
- Monitor pest and disease alerts
- Analyse soil information
- View farming statistics through a dashboard
- Use the application in multiple languages
- Securely login and access protected features

---

## ✨ Key Features

### 🔐 User Authentication

- User Registration
- User Login
- JWT-based authentication
- Protected routes
- Secure password handling using bcryptjs
- Authentication token management

---

### 🌱 Crop Management

Farmers can manage their crop information through the application.

Features include:

- Add new crops
- View crop records
- Edit crop information
- Delete crop records
- Crop type management
- Area management
- Soil type information
- Sowing date
- Expected harvest date
- Crop status

Crop statuses include:

- Planned
- Growing
- Harvested

---

### 🌦️ Weather Information

The application provides weather information using a weather API.

Features include:

- Search weather information
- Temperature
- Weather condition
- Humidity
- Weather icons
- Location-based weather search
- Support for different cities and smaller locations

The dashboard also displays weather information for Pune.

---

### 💰 Market Prices

The Market Prices module helps users view agricultural commodity price information.

Features include:

- Crop/product selection
- Market price records
- Price information
- Market information
- Add market price records
- Edit market price records
- Delete market price records
- Search/filter functionality

The application also supports multilingual display for agricultural products.

For example:

- Wheat → गहू
- Rice → तांदूळ
- Tomato → टोमॅटो

---

### 🐛 Pest Alerts

The Pest Alerts module helps farmers monitor crop pests and diseases.

Features include:

- Add pest alerts
- Edit pest alerts
- Delete pest alerts
- Search pest alerts
- Filter by risk level
- Pest name
- Disease name
- Symptoms
- Prevention
- Treatment
- Affected season

Risk levels include:

- Low
- Medium
- High
- Critical

---

### 🧪 Soil Analysis

The Soil Analysis module provides soil-related information.

The dashboard provides statistics such as:

- Total soil analyses
- Good / Excellent soil
- Poor soil

The module can help organize soil information for better crop management.

---

## 📊 Smart Dashboard

The Agri-Tech dashboard provides an overview of important farming information.

Dashboard sections include:

- Total Crops
- Market Price Records
- Pune Weather
- Total Pest Alerts
- High Risk Alerts
- Critical Alerts
- Total Soil Analyses
- Good / Excellent Soil
- Poor Soil
- Upcoming Crop Activities

The dashboard also provides quick navigation buttons to the respective modules.

---

## 🌐 Multilingual Support

Agri-Tech includes multilingual support to make the application more accessible.

Supported languages include:

- 🇬🇧 English
- 🇮🇳 मराठी
- 🇮🇳 हिंदी

Examples:

| English | Marathi | Hindi |
|---|---|---|
| Total Crops | एकूण पिके | कुल फसलें |
| Market Prices | बाजार भाव | बाजार भाव |
| Weather | हवामान | मौसम |
| Pest Alerts | किडीच्या सूचना | कीट अलर्ट |
| Soil Analysis | माती विश्लेषण | मिट्टी विश्लेषण |

---

## 🖥️ User Interface

The application uses a responsive and modern interface.

UI features include:

- Bootstrap-based design
- Responsive cards
- Dashboard statistics
- Navigation buttons
- Forms
- Search and filter controls
- Alert messages
- Loading indicators
- Responsive layout
- Mobile-friendly design

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Bootstrap
- Axios
- React Router DOM
- i18next

### Backend

- Node.js
- Express.js
- JavaScript
- REST API

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcryptjs

### External Services

- Weather API

### Development Tools

- Vite
- Nodemon
- Git
- GitHub

---

## 📂 Project Structure

```text
Agri_Tech/
│
├── client/
│   │
│   ├── public/
│   │   └── image/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Crops.jsx
│   │   │   ├── Weather.jsx
│   │   │   ├── MarketPrices.jsx
│   │   │   ├── PestAlerts.jsx
│   │   │   └── SoilAnalysis.jsx
│   │   │
│   │   ├── i18n/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Crop.js
│   │   ├── MarketPrice.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── marketPriceRoutes.js
│   │   └── ...
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

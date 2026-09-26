# 🌾 Agri-Tech – Smart Agriculture Technology

Agri-Tech is a full-stack Smart Agriculture web application designed to help farmers manage crops, monitor weather conditions, check market prices, identify pest alerts, and analyze soil health.

The application provides a user-friendly, responsive, and multilingual interface to support data-driven agricultural decisions.

---

## 📌 Project Overview

Agriculture depends heavily on weather conditions, soil quality, crop management, market prices, and pest control.

Agri-Tech brings these important agricultural features together into a single web application.

The system allows farmers to:

- 🌱 Manage crops
- 🌦️ Check real-time weather information
- 💰 View agricultural market prices
- 🐛 Monitor pest alerts
- 🧪 Analyze soil health
- 📊 View agricultural information through a dashboard
- 🔐 Register and login securely
- 🌐 Use the application in multiple languages

---

## 🎯 Objectives

The main objectives of Agri-Tech are:

- Improve crop management
- Provide useful weather information
- Help farmers monitor market prices
- Provide pest-related alerts
- Support soil health analysis
- Reduce agricultural losses
- Improve farming decisions using technology
- Provide a simple and user-friendly interface

---

## ✨ Key Features

### 🔐 User Authentication

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Secure Password Handling

### 📊 Dashboard

The dashboard provides an overview of important agricultural information.

It includes:

- Total Crops
- Market Price Records
- Weather Information
- Total Pest Alerts
- High Risk Alerts
- Critical Alerts
- Total Soil Analyses
- Good / Excellent Soil
- Poor Soil
- Upcoming Crop Activities

### 🌱 Crop Management

Users can:

- Add crops
- View crops
- Update crop information
- Manage crop status
- Store sowing date
- Store expected harvest date
- Store crop type
- Store soil type
- Store farming area

### 🌦️ Weather

The weather module provides weather information based on the searched location.

Features include:

- Temperature
- Weather condition
- Humidity
- Weather icons
- Location-based weather search
- Support for cities and smaller locations

### 💰 Market Prices

The market price module allows users to view agricultural market price information.

### 🐛 Pest Alerts

The pest alert module provides information about:

- Total Pest Alerts
- High Risk Alerts
- Critical Alerts

### 🧪 Soil Analysis

The soil analysis module provides soil-related information including:

- Total Soil Analyses
- Good / Excellent Soil
- Poor Soil
- Soil health information

### 🌐 Multilingual Support

The application supports multiple languages, including:

- English
- Marathi
- Hindi

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- React.js
- Bootstrap
- React Router
- Axios
- i18next

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs

### Database

- MongoDB
- Mongoose

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Vite
- npm

---

## 📁 Project Structure

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
│   │   ├── assets/
│   │   ├── i18n/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   │
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md

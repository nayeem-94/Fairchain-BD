# 🌾 FairChain BD – AI-Powered Supply Chain Monitoring Platform

**FairChain BD** is an AI-powered supply chain monitoring platform designed to improve transparency, accountability, and price monitoring in Bangladesh's essential commodity market.

The platform tracks essential commodities such as rice, soybean oil, onions, sugar, lentils, vegetables, and fruits throughout the supply chain — from importers and manufacturers to distributors, wholesalers, and retailers.

By combining supply chain tracking, real-time data monitoring, and machine learning, FairChain BD aims to help identify unusual price fluctuations, detect potential market anomalies, and promote a fairer commodity distribution system.

## 🚀 Live Demo

**Frontend:** https://fairchain-bd.vercel.app/

## ✨ Key Features

- **Role-Based Access Control:** Separate dashboards and permissions for different supply chain participants.
- **Supply Chain Tracking:** Track products and batches from import to retail.
- **Import Management:** Record imported commodities, quantities, prices, origins, and port information.
- **Transfer Management:** Manage product transfers between supply chain participants with acceptance and rejection workflows.
- **Inventory Management:** Monitor received, transferred, sold, and remaining stock.
- **Price Monitoring:** Track commodity prices across different supply chain stages.
- **Interactive Map:** Visualize supply chain locations using Leaflet and OpenStreetMap.
- **AI-Powered Price Prediction:** Apply machine learning to analyze and predict commodity prices.
- **Anomaly Detection:** Identify unusual price movements and potentially suspicious market activities.
- **Admin Dashboard:** Monitor users, supply chain activities, and overall platform operations.

## 👥 User Roles

FairChain BD supports five primary supply chain roles and an administrator.

| Role | Responsibilities |
|---|---|
| Importer | Import registration and shipment management |
| Manufacturer | Receive raw materials and manage processing |
| Distributor | Manage product distribution and transfers |
| Wholesaler | Receive and distribute bulk products |
| Retailer | Manage retail inventory and selling prices |
| Admin | Manage users and monitor platform activities |

## 🔄 Supply Chain Workflow

```text
Importer
   |
   v
Manufacturer
   |
   v
Distributor
   |
   v
Wholesaler
   |
   v
Retailer
   |
   v
Consumer
```

Each stage maintains product and batch information to support end-to-end supply chain traceability.

## 🤖 AI & Machine Learning

FairChain BD integrates machine learning techniques to support data-driven market monitoring.

- **Random Forest:** Commodity price prediction.
- **Isolation Forest:** Detecting unusual price patterns and potential anomalies.
- **Time-Series Forecasting:** Analyzing historical commodity prices to identify trends.

These models aim to support better market insights and early identification of irregularities.

## 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS
- JavaScript
- React Router
- Lucide React
- Leaflet
- OpenStreetMap

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

### Database
- PostgreSQL

### Artificial Intelligence & Machine Learning
- Python
- NumPy
- Pandas
- Scikit-learn
- Random Forest
- Isolation Forest
- Prophet

### Deployment
- Vercel – Frontend
- Render – Backend

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Replace the URL with your deployed backend API URL when connecting to the production backend.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

## 🔐 Authentication

FairChain BD uses JWT-based authentication to secure API communication.

- User login and registration.
- Access and refresh token handling.
- Role-based dashboard redirection.
- Protected application routes.

## 🎯 Project Objectives

- Improve transparency in Bangladesh's essential commodity supply chain.
- Monitor commodity prices across different distribution stages.
- Reduce opportunities for artificial price manipulation.
- Improve product traceability from import to retail.
- Use AI and machine learning for price analysis and anomaly detection.
- Support data-driven decisions for better market monitoring.

## 🔮 Future Improvements

- Advanced AI-based price forecasting.
- Automated market anomaly alerts.
- Real-time commodity price analytics.
- Government and market authority integration.
- Enhanced supply chain visualization.
- Consumer-facing price transparency features.

## 👨‍💻 Author

**Mostafizur Rahman Nayeem**

Computer Science & Engineering

- GitHub: https://github.com/nayeem-94
- LinkedIn: https://www.linkedin.com/in/mostafizur-rahman-nayeem-77a458274/

---

*FairChain BD – Building a More Transparent and Fair Supply Chain for Bangladesh.*
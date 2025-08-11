# DAsort - AI-Enabled Semantic Search for National Classification of Occupation (NCO)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-green.svg)
![Government](https://img.shields.io/badge/Gov-MoSPI-orange.svg)

## 🚀 Project Overview

**DAsort** is an AI-powered semantic search solution developed for the Government of India's Ministry of Statistics and Programme Implementation (MoSPI) to revolutionize the National Classification of Occupation (NCO) system. This project addresses the critical need to modernize the traditional keyword-based job classification process with intelligent, semantic understanding capabilities.

### 🎯 Problem Statement

The current NCO-2015 system faces significant challenges:
- **Manual Process**: Requires exact keyword matching in static PDF documents
- **Training Intensive**: Demands extensive familiarity with 3,600+ occupation codes across 52 sectors
- **Error-Prone**: Leads to misclassification and data quality issues
- **Not Scalable**: Cannot efficiently handle large-scale national surveys
- **Time-Consuming**: Slows down data collection and policy planning processes

### 💡 Our Solution

DAsort provides a comprehensive AI-enabled platform that transforms occupation classification through:

- **🧠 Semantic Search**: Natural language processing with BERT/Transformers for intelligent job matching
- **📊 Data Processing**: Automated ingestion, cleaning, and validation of survey data
- **🌐 Multi-language Support**: Hindi and regional language capabilities for nationwide accessibility
- **📈 Analytics Dashboard**: Real-time insights, trends, and performance monitoring
- **🔒 Role-based Access**: Secure access control for enumerators, analysts, and administrators
- **🔍 Confidence Scoring**: AI-powered relevance ranking with confidence metrics

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for backend type safety
- **Prisma ORM** with PostgreSQL database
- **JWT** authentication and authorization
- **bcrypt** for password hashing
- **CORS** for cross-origin resource sharing

### AI/ML Stack (Planned)
- **Python** with FastAPI for ML services
- **BERT/Transformers** for semantic understanding
- **FAISS** for efficient vector similarity search
- **scikit-learn** for data preprocessing
- **pandas** for data manipulation

## 📁 Project Structure

```
DAsort/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── layouts/         # Page layouts
│   │   ├── store/           # Redux store and slices
│   │   ├── services/        # API service functions
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── dist/                # Build output
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controller/      # Route controllers
│   │   ├── router/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utility/         # Helper utilities
│   │   ├── db/             # Database configuration
│   │   └── prisma/         # Prisma schema and migrations
│   └── dist/               # Compiled JavaScript
├── ml-service/             # Python ML microservice (Planned)
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- Python 3.8+ (for ML components)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikash55Kumar/DAsort.git
   cd DAsort
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Setup environment variables
   .env
   # Edit .env with your database and configuration details
   
   # Setup database
   npx prisma generate
   npx prisma db push
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Setup environment variables
   .env
   # Edit .env with your backend API URL
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## 🎯 Key Features

### 🔍 Intelligent Job Search
- Natural language job description input
- AI-powered semantic matching with confidence scores
- Hierarchical NCO code display (8-digit classification)
- Support for synonyms and contextual understanding
- Multi-language query processing

### 📊 Data Management
- CSV/Excel file upload and processing
- Automated data cleaning and anomaly detection
- Duplicate removal and data validation
- Export capabilities in multiple formats
- Bulk job classification processing

### 📈 Analytics & Reporting
- Real-time KPI dashboards
- Interactive charts and trend analysis
- Performance metrics and usage statistics
- Custom date range filtering
- Export reports for policy planning

### 🌐 Multi-language Support
- Hindi and regional language input
- Automatic language detection
- Localized user interface
- Translation capabilities for job descriptions

### 🔒 Security & Compliance
- Role-based access control (Admin, Analyst, Enumerator)
- JWT-based authentication
- Government-grade security standards
- Complete audit trail logging
- Data encryption in transit and at rest

### 👥 User Roles

- **Enumerator**: Basic search, data entry, view assigned surveys
- **Data Analyst**: Advanced analytics, reporting, data cleaning
- **Administrator**: Full system management, user control, system configuration

## 🌟 Expected Impact

### For Government Operations
- **75% Reduction** in manual classification time
- **90% Improvement** in data accuracy and consistency
- **60% Decrease** in training time for enumerators
- **Enhanced Quality** of national statistics and surveys

### For Policy Making
- Faster, more reliable data collection
- Improved evidence-based governance
- Better resource allocation in surveys
- Modernized statistical infrastructure

## 🏆 Alignment with National Priorities

This project directly supports:
- **Digital India Initiative**: Leveraging AI for government services
- **National Data Strategy**: Improving data quality and accessibility
- **Evidence-based Governance**: Providing reliable statistical foundation
- **Skill Development**: Modernizing occupation classification for workforce planning

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build

# Deploy to government cloud infrastructure
```

## 📞 Support & Contact

### Ministry Contact
- **Ministry of Statistics and Programme Implementation**
- **Government of India**
- **Sardar Patel Bhavan, New Delhi**
- **Website**: [mospi.gov.in](https://mospi.gov.in)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ministry of Statistics and Programme Implementation (MoSPI)**
- **Government of India Digital Innovation Team**
- **National Classification of Occupation (NCO) Committee**
- **AI Hackathon 2025 Organizing Committee**

---

**Built for AI Hackathon 2025** | **Ministry of Statistics and Programme Implementation** | **Government of India**

*Transforming National Statistics with Artificial Intelligence*
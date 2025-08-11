# NCO AI - Semantic Search for Job Classification

## 🚀 Project Overview

AI-enabled Semantic Search for National Classification of Occupation (NCO) - A comprehensive solution for the Government of India's Ministry of Statistics and Programme Implementation to modernize job classification processes.

### 🎯 Problem Statement

The National Classification of Occupation (NCO-2015) currently relies on manual keyword-based search through static documents, which is:
- Time-consuming and error-prone
- Requires extensive training and expertise
- Limited scalability for large surveys
- Lacks semantic understanding of job descriptions

### 💡 Our Solution

An AI-powered web application that provides:
- **Semantic Search**: Natural language processing for intelligent job code matching
- **Data Processing**: Automated data cleaning and anomaly detection
- **Multi-language Support**: Hindi and regional language capabilities
- **Analytics Dashboard**: Real-time insights and reporting
- **Role-based Access**: Different levels for enumerators, analysts, and administrators

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Heroicons** for icons
- **Axios** for API calls

### Backend (To be implemented)
- **Node.js** with Express
- **Python** for AI/ML processing
- **PostgreSQL** database
- **BERT/Transformers** for NLP
- **FAISS** for vector search

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── layouts/             # Page layouts
│   ├── pages/               # Application pages
│   │   ├── public/          # Public pages (landing, about, etc.)
│   │   ├── auth/            # Authentication pages
│   │   └── private/         # Protected pages
│   ├── services/            # API service functions
│   ├── context/             # React Context providers
│   ├── utils/               # Helper functions and constants
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── dist/                    # Build output
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd "/home/vikash/Desktop/Hackathon/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Features

### Public Area
- **Landing Page**: Hero section, problem statement, features overview
- **About Page**: Detailed project information and technology stack
- **Contact Page**: Contact form and ministry information
- **Help Page**: Documentation, FAQ, and quick start guides

### Authentication
- **Login/Register**: Email-based authentication with role selection
- **Role Management**: Admin, Data Analyst, Enumerator roles

### Authenticated Area
- **Dashboard**: KPI cards, charts, and activity logs
- **Job Search**: AI-powered semantic search with confidence scores
- **Data Explorer**: Dataset management and record viewing
- **Data Cleaning**: File upload and automated cleaning
- **Reports & Analytics**: Advanced reporting and visualizations
- **Admin Panel**: User and system management (admin only)

## 🎯 Key Features

### 🔍 Semantic Search
- Natural language job description input
- AI-powered matching with confidence scores
- Hierarchical job code display
- Multiple match types (exact, semantic, partial)

### 📊 Data Management
- CSV/Excel file upload and processing
- Automated anomaly detection
- Data cleaning with detailed reports
- Export capabilities in multiple formats

### 📈 Analytics & Reporting
- Real-time KPI dashboards
- Interactive charts and visualizations
- Trend analysis and performance metrics
- Customizable date ranges and filters

### 🌐 Multi-language Support
- Hindi and regional language input
- Automatic translation capabilities
- Localized user interface

### 🔒 Security & Access Control
- Role-based permissions
- Secure authentication
- Audit trail logging
- Government-grade security standards

## 🎨 Design System

### Color Palette
- **Primary**: Blue (blue-600, blue-500)
- **Secondary**: Gray (gray-50 to gray-900)
- **Success**: Green (green-500, green-600)
- **Warning**: Yellow (yellow-500, yellow-600)
- **Error**: Red (red-500, red-600)

### Typography
- **Headers**: Font weights 600-800
- **Body**: Font weight 400-500
- **Code**: Monospace font family

### Components
- Consistent spacing using Tailwind's scale
- Rounded corners (rounded-lg, rounded-md)
- Subtle shadows and borders
- Smooth transitions and hover effects

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow React best practices and hooks
- Implement proper error handling
- Write meaningful component and variable names

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Include proper accessibility attributes
- Follow the established folder structure

### State Management
- Use React Context for global state
- Keep local state minimal and focused
- Implement proper loading and error states

## 📝 API Integration

The frontend is designed to work with a REST API backend. Key endpoints include:

- `POST /auth/login` - User authentication
- `GET /jobs/search` - Semantic job search
- `POST /datasets/upload` - Data file upload
- `GET /analytics/kpi` - Dashboard metrics

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_NODE_ENV` - Environment (development/production)

## 🏆 Hackathon Submission

This project addresses the Government of India's challenge for AI-enabled semantic search in occupation classification, providing:

- **Improved Efficiency**: Reduced manual effort and faster classification
- **Enhanced Accuracy**: AI-powered semantic matching with confidence scores
- **Scalable Solution**: Handles large datasets and multiple concurrent users
- **Modern Interface**: Intuitive design following government accessibility standards

## 📞 Support

For technical support or questions:
- Email: support@mospi.gov.in
- Ministry of Statistics and Programme Implementation
- Government of India

---

**Built for AI Hackathon 2025** | **Ministry of Statistics and Programme Implementation**

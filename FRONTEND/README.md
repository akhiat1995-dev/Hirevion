# Hirevion - Frontend

React frontend for the Hirevion platform - an AI-powered recruitment and talent matching system.

## 🎨 Brand Identity

**Hirevion** represents smart hiring powered by artificial intelligence.
- **Logo**: Pencil icon symbolizing creation, editing, and precision
- **Colors**: Navy blue (#1A365D) with orange accents for energy
- **Typography**: Playfair Display (elegant serif) + DM Sans (modern sans-serif)
- **Tagline**: "Smart Hiring" - intelligent recruitment for modern businesses

## 🎨 Design System

This frontend follows the **MarketLens** design system with:
- **Colors**: Navy blue (#1A365D, #2C5282) with warm white backgrounds
- **Typography**: Playfair Display (serif) for headings, DM Sans for body text
- **Components**: Paper shadows, rounded corners, subtle borders
- **Animations**: GSAP animations, smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on localhost:8000

### Installation

1. **Navigate to frontend directory**:
```bash
cd FRONTEND
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables** (optional):
```bash
cp .env.example .env
```
Edit `.env` if your backend runs on a different port:
```
REACT_APP_API_URL=http://localhost:8000
```

4. **Start the development server**:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
FRONTEND/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation component
│   │   └── Footer.js          # Footer component
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── RecruiterDashboard.js  # Upload CVs & analyze
│   │   ├── CandidateUpload.js     # Single CV analysis
│   │   ├── Results.js         # Analysis results
│   │   └── JobSetup.js        # Job configuration
│   ├── services/
│   │   └── api.js             # API integration
│   ├── App.js                 # Main app with routing
│   ├── index.js               # Entry point
│   └── index.css              # Tailwind + custom styles
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Features

### For Recruiters
- **Multi-CV Upload**: Drag & drop multiple PDF CVs
- **Job Definition**: Enter title, positions, and requirements
- **AI Matching**: Automated candidate scoring and ranking
- **Visual Results**: Charts, tier distribution, detailed analysis
- **Export Reports**: Download analysis results

### For Candidates
- **CV Analysis**: Upload your CV for instant feedback
- **Score Breakdown**: Overall score + detailed metrics
- **Strengths & Weaknesses**: AI-identified key points
- **Improvement Tips**: Personalized recommendations

## 🔗 API Integration

The frontend connects to the FastAPI backend:

```javascript
// Base URL (configured in package.json proxy)
const API_BASE_URL = 'http://localhost:8000';

// Key endpoints used:
POST /recruiter/hiring        // Upload CVs & analyze
GET  /recruiter/applications  // List previous uploads
GET  /candidate/list          // List analyzed CVs
POST /candidate/analyze       // Analyze single CV
```

## 🛠️ Built With

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Dropzone** - File upload handling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## 📱 Pages

### 1. Home (`/`)
- Landing page with hero section
- Feature highlights
- How it works section
- CTA to get started

### 2. Recruiter Dashboard (`/recruiter`)
- Job details form
- Multi-file upload zone
- Submit for analysis
- Loading states

### 3. Results (`/results`)
- Summary statistics
- Tier distribution chart
- Approved candidates list
- Rejected candidates list
- Detailed candidate cards

### 4. Candidate Upload (`/candidate`)
- Single file upload
- CV analysis display
- Score visualization
- Strengths/weaknesses
- Recommendations

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  navy: {
    800: '#2C5282',
    900: '#1A365D',
  },
  warm: {
    white: '#F7F5F0',
    // ...
  }
}
```

### Fonts
Google Fonts loaded in `public/index.html`:
- Playfair Display (headings)
- DM Sans (body text)

## 🔧 Troubleshooting

### CORS Errors
The proxy is configured in `package.json`. If you get CORS errors:
1. Ensure backend CORS allows `http://localhost:3000`
2. Or use the proxy configuration

### API Not Found
Make sure the backend is running:
```bash
cd BACKEND
python start.py
```

### Build Issues
Clear npm cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
```

## 🚀 Production Build

```bash
npm run build
```

Creates optimized build in `build/` folder.

## 📄 License

This project is part of Hirevion - AI-Powered Recruitment Platform.

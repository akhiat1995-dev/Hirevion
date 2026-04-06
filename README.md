# Hirevion - CV Analyzer Pro
<p align="center">
  <img src="FRONTEND/public/logo192.png" alt="Hirevion Logo" width="80" height="80">
</p>

<p align="center">
  <strong>AI-Powered Recruitment & Talent Matching Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-documentation">API</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

## Overview

**Hirevion** is an intelligent recruitment platform that leverages AI to:
- Parse and analyze CVs/resumes
- Extract structured candidate data
- Match candidates to job descriptions
- Provide detailed scoring and recommendations

Built with a modern **FastAPI** backend and **React** frontend with Tailwind CSS.

## Features

### For Candidates
- Upload CV (PDF) for AI analysis
- Get detailed CV quality scores
- Receive improvement recommendations
- View skills, experience, and education extraction
- Multilingual reports (English & French)

### For Recruiters
- Upload multiple CVs at once
- Define job requirements
- AI-powered candidate matching
- Flexible scoring system (4 tiers)
- Skills similarity detection
- Detailed matching analysis
- Session history & management

### AI Features
- **Smart Skill Matching**: Recognizes similar skills (React ↔ Vue, Python ↔ Django)
- **Flexible Scoring**: Considers potential, not just perfect matches
- **Transferable Skills**: Values adjacent experience
- **Growth Potential**: Evaluates learning agility

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **MongoDB** | NoSQL database (Motor async driver) |
| **Groq API** | LLM inference (Llama 3.3 70B) |
| **pdfplumber** | PDF text extraction |
| **Pydantic** | Data validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **React Router** | Client-side routing |
| **Tailwind CSS** | Utility-first CSS |
| **Axios** | HTTP client |
| **Recharts** | Data visualization |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

## Project Structure

```
CV ANALYZER PRO/
├── BACKEND/
│   ├── main.py                 # FastAPI entry point
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── candidate.py        # Candidate endpoints
│   │   └── recruiter.py        # Recruiter endpoints
│   ├── services/
│   │   ├── agent.py            # AI integration (Groq)
│   │   ├── extractor.py        # PDF extraction
│   │   └── rate_limiter.py     # Rate limiting
│   ├── config/
│   │   └── database.py         # MongoDB connection
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── PencilDesigns.js
│   │   │   └── ScrollAnimations.js
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js
│   │   │   ├── CandidateUpload.js
│   │   │   ├── CandidateResults.js
│   │   │   ├── RecruiterDashboard.js
│   │   │   └── Results.js
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (free tier)
- Groq API key (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hirevion-cv-analyzer.git
cd hirevion-cv-analyzer
```

### 2. Backend Setup

```bash
cd BACKEND

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

Edit `.env` with your credentials:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cv_analyzer
ALLOWED_ORIGINS=http://localhost:3000
```

Start the backend:
```bash
python main.py
# or
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd ../FRONTEND

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

## API Documentation

### System Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/stats` | Platform statistics |

### Candidate Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/candidate/analyze` | Upload & analyze CV |
| GET | `/candidate/list` | List all CVs |
| GET | `/candidate/{id}` | Get CV by ID |
| DELETE | `/candidate/{id}` | Delete CV |

### Recruiter Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recruiter/hiring` | Full hiring workflow |
| GET | `/recruiter/jobs` | List all jobs |
| DELETE | `/recruiter/jobs/{id}` | Delete job |
| GET | `/recruiter/sessions` | List hiring sessions |
| GET | `/recruiter/sessions/{id}` | Get session details |
| DELETE | `/recruiter/sessions/{id}` | Delete session |
| GET | `/recruiter/applications` | List applications |
| DELETE | `/recruiter/applications` | Clear applications |

## Scoring System

### Match Score Components
| Component | Weight |
|-----------|--------|
| Skills Match | 40% |
| Experience | 25% |
| Education | 15% |
| Domain Fit | 20% |

### Selection Tiers
| Tier | Score | Description |
|------|-------|-------------|
| Excellent | 80-100 | Strong hire |
| Good | 65-79 | Hire with mentorship |
| Potential | 50-64 | Interview for potential |
| Not Suitable | <50 | Does not meet requirements |

## Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=gsk_xxx          # Required: Groq API key
MONGO_URI=mongodb+srv://xxx   # Required: MongoDB connection
ALLOWED_ORIGINS=http://localhost:3000  # CORS origins
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000  # Backend URL
```

## Security Notes

- Never commit `.env` files
- Regenerate API keys if exposed
- Update CORS origins for production
- Add authentication for production use

## Free Tier Limits

| Service | Free Limit |
|---------|------------|
| Groq API | 1,000 requests/day |
| MongoDB Atlas | 512MB storage |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - feel free to use for personal or commercial projects.

## Acknowledgments

- [Groq](https://groq.com) for fast LLM inference
- [MongoDB Atlas](https://mongodb.com) for free database tier
- [FastAPI](https://fastapi.tiangolo.com) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for styling

---

<p align="center">
  Made with ❤️ by the Hirevion Team
</p>

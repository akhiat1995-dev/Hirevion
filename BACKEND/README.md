# CV Analyzer Pro

AI-powered CV analysis and job matching system built with FastAPI.

## Features

- **CV Upload & Analysis**: Extract structured data from PDF CVs using AI
- **Job Matching**: Match candidates to job descriptions with AI scoring
- **MongoDB Storage**: Persistent storage of CVs and analysis results
- **RESTful API**: Clean API design with proper validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd BACKEND
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Get your free Groq API key at: https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here

# MongoDB URI (free tier available at https://www.mongodb.com/atlas)
MONGO_URI=your_mongodb_uri_here

# Frontend URL (for CORS)
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Run the Application

```bash
python -m uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### System Endpoints

- `GET /` - API status and information
- `GET /health` - Health check with database status

### Candidate Endpoints

- `POST /candidate/analyze` - Upload and analyze a CV (PDF only)
- `GET /candidate/list` - List all analyzed CVs
- `GET /candidate/{cv_id}` - Get a specific CV by ID
- `DELETE /candidate/{cv_id}` - Delete a CV by ID

### Recruiter Endpoints

- `POST /recruiter/jobs` - Create a new job posting
- `GET /recruiter/jobs` - List all job postings
- `POST /recruiter/match` - Match candidates against a job description

## Example Usage

### Upload a CV

```bash
curl -X POST "http://localhost:8000/candidate/analyze" \
  -F "file=@cv.pdf"
```

### List All CVs

```bash
curl -X GET "http://localhost:8000/candidate/list"
```

### Get CV by ID

```bash
curl -X GET "http://localhost:8000/candidate/{cv_id}"
```

### Create a Job Posting

```bash
curl -X POST "http://localhost:8000/recruiter/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Developer",
    "posts": 2,
    "description": "Looking for Python developers with FastAPI experience"
  }'
```

### List All Jobs

```bash
curl -X GET "http://localhost:8000/recruiter/jobs"
```

### Match Candidates to Job

```bash
curl -X POST "http://localhost:8000/recruiter/match" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Developer",
    "posts": 2,
    "description": "Looking for Python developers with FastAPI experience"
  }'
```

### Health Check

```bash
curl -X GET "http://localhost:8000/health"
```

## Important Security Notes

1. **NEVER commit your `.env` file** - It contains sensitive API keys
2. **Regenerate your API keys** - If they were exposed, create new ones immediately:
   - Groq: https://console.groq.com/keys
   - MongoDB: https://cloud.mongodb.com
3. **Update CORS origins** - Change `ALLOWED_ORIGINS` in production to your actual frontend URL
4. **Add authentication** - Currently no auth; add API keys or JWT for production

## Free API Limits

- **Groq**: 1,000 requests/day on free tier (sufficient for testing)
- **MongoDB Atlas**: 512MB storage on free M0 tier

## Troubleshooting

### Database Connection Failed
- Check your `MONGO_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas

### AI Analysis Not Working
- Verify `GROQ_API_KEY` is set correctly
- Check Groq dashboard for rate limits

### CORS Errors
- Update `ALLOWED_ORIGINS` to match your frontend URL
- Ensure protocol matches (http vs https)

## Testing

Use the provided test script to verify all API endpoints:

```bash
# Test with default cv.pdf file
python test_api.py

# Test with specific file
python test_api.py /path/to/cv.pdf
```

This script tests:
- ✅ Health check
- ✅ CV upload and analysis
- ✅ List and get CV endpoints
- ✅ Job creation and listing
- ✅ Candidate matching

## Project Structure

```
BACKEND/
├── main.py                 # FastAPI app entry point
├── routers/
│   ├── candidate.py        # Candidate endpoints (upload, list, get, delete)
│   └── recruiter.py        # Recruiter endpoints (jobs, match)
├── services/
│   ├── agent.py            # AI integration with Groq
│   └── extractor.py        # PDF text extraction
├── config/
│   └── database.py         # MongoDB connection
├── models/
│   └── schemas.py          # Pydantic models
├── test_api.py             # API test suite
├── check_env.py            # Environment validator
└── requirements.txt        # Dependencies
```

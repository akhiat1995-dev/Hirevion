# Test Frontend-Backend Connection

## Backend Configuration ✅

### CORS Settings (main.py)
- **Allow Origins**: http://localhost:3000, http://127.0.0.1:3000
- **Allow Methods**: GET, POST, PUT, DELETE
- **Allow Headers**: *
- **Allow Credentials**: True

### Router Prefixes
- `/recruiter/*` - Recruiter endpoints
- `/candidate/*` - Candidate endpoints
- `/health` - Health check

## Frontend Configuration ✅

### Proxy (package.json)
```json
"proxy": "http://localhost:8000"
```

### API Base URL (src/services/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Endpoint Mapping ✅

| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|---------|
| `/recruiter/hiring` | `POST /recruiter/hiring` | ✅ |
| `/recruiter/applications` | `GET /recruiter/applications` | ✅ |
| `/recruiter/jobs` | `GET /recruiter/jobs` | ✅ |
| `/candidate/analyze` | `POST /candidate/analyze` | ✅ |
| `/candidate/list` | `GET /candidate/list` | ✅ |
| `/health` | `GET /health` | ✅ |

## How to Test Connection

### 1. Start Backend
```bash
cd BACKEND
python start.py
```

### 2. Frontend Already Running
```
http://localhost:3000
```

### 3. Test API Connection
Open browser console and run:
```javascript
fetch('/health')
  .then(r => r.json())
  .then(data => console.log(data))
```

Should return:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "timestamp": "..."
}
```

## Troubleshooting

### If CORS Error:
1. Check .env has ALLOWED_ORIGINS
2. Restart backend after .env changes
3. Check browser console for exact error

### If 404 Error:
1. Check backend is running on port 8000
2. Verify endpoint URLs match exactly
3. Check proxy setting in package.json

### If Connection Refused:
1. Backend not running - start it
2. Wrong port - check python start.py output
3. Firewall blocking - allow port 8000

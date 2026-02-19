from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ParsedData(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    skills: List[str] = []
    experience_years: int = 0
    education: List[str] = []
    summary: str = ""
    cv_id: Optional[str] = None

class CVBase(BaseModel):
    filename: str
    raw_text: str
    parsed_data: ParsedData
    status: str = "analyzed"

class CVCreate(CVBase):
    pass

class CVResponse(CVBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JobRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Job title")
    posts: int = Field(..., ge=1, le=100, description="Number of open positions")
    description: str = Field(..., min_length=20, description="Job description")

class MatchResult(BaseModel):
    cv_id: str
    candidate_name: str
    match_score: int
    status: str
    reason: str
    matching_skills: List[str]
    missing_skills: List[str]

class MatchResponse(BaseModel):
    success: bool
    job_title: str
    posts_available: int
    total_candidates: int
    valid_candidates: int
    selected: List[MatchResult]
    all_matches: List[MatchResult]

class HealthCheck(BaseModel):
    status: str
    version: str
    database: str
    timestamp: datetime

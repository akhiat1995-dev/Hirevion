import json
from typing import Dict
from services.ai.client import groq_client
from services.ai.prompts import SYSTEM_PROMPT_JOB_PROFILE


def _build_job_profile_error_fallback(job_title: str, number_of_positions: int, job_requirements: str) -> Dict:
    """Build a fallback response when job profile extraction fails."""
    return {
        "job_title": job_title,
        "number_of_positions": number_of_positions,
        "domain": "Not specified",
        "seniority_level": "Not specified",
        "experience_required": {"min_years": 0, "max_years": 0, "description": "Not specified"},
        "required_skills": [],
        "optional_skills": [],
        "tools_technologies": [],
        "education_requirements": [],
        "languages_required": [],
        "certifications_preferred": [],
        "key_responsibilities": [],
        "salary_range": "Not specified",
        "location": "Not specified",
        "work_mode": "Not specified",
        "raw_requirements": job_requirements,
        "error": "Job profile extraction failed"
    }


def extract_job_profile(job_title: str, number_of_positions: int, job_requirements: str) -> Dict:
    """
    Extract structured job profile from recruiter input.
    
    Args:
        job_title: Job title
        number_of_positions: Number of open positions
        job_requirements: Job description and requirements
    
    Returns:
        Dictionary with structured job profile
    """
    try:
        input_text = f"""
Job Title: {job_title}
Number of Positions: {number_of_positions}
Job Requirements:
{job_requirements}
"""

        response_text = groq_client.chat_completion(
            system_prompt=SYSTEM_PROMPT_JOB_PROFILE,
            user_message=input_text,
            max_tokens=2000,
            temperature=0.1
        )

        json_text = groq_client.extract_json_from_response(response_text)
        job_profile = json.loads(json_text)
        job_profile["number_of_positions"] = number_of_positions
        return job_profile

    except Exception as e:
        print(f"\u274c Job profile extraction error: {e}")
        return _build_job_profile_error_fallback(job_title, number_of_positions, job_requirements)

import json
from typing import Dict
from services.ai.client import groq_client
from services.ai.prompts import SYSTEM_PROMPT_HIRING_MATCH


def _build_match_error_fallback(error: str) -> Dict:
    """Build a fallback response when candidate matching fails."""
    return {
        "candidate_name": "Unknown",
        "match_score": 0,
        "decision": "rejected",
        "selection_tier": "not_suitable",
        "seniority_match": {"job_level": "", "candidate_level": "", "score": 0, "comment": "Error"},
        "skills_match": {"required_matched": [], "required_missing": [], "optional_matched": [], "score": 0, "comment": "Error"},
        "experience_match": {"required_years": 0, "candidate_years": 0, "score": 0, "comment": "Error"},
        "education_match": {"required": "", "candidate": "", "score": 0, "comment": "Error"},
        "domain_fit": {"job_domain": "", "candidate_domains": [], "score": 0, "comment": "Error"},
        "strengths": [],
        "weaknesses": [],
        "interview_focus_areas": [],
        "short_explanation": "Error occurred during matching",
        "reason": error,
        "error": error
    }


def match_candidate_to_job(candidate_data: Dict, job_description: str) -> Dict:
    """
    Match a candidate against a job description using AI.
    
    Args:
        candidate_data: Parsed candidate data (skills, experience, education, etc.)
        job_description: Job description and requirements
    
    Returns:
        Dictionary with match results and scoring
    """
    try:
        candidate_text = json.dumps({
            "skills": candidate_data.get("skills", []),
            "experience_years": candidate_data.get("experience_years", 0),
            "education": candidate_data.get("education", []),
            "work_experience": candidate_data.get("work_experience", []),
            "certifications": candidate_data.get("certifications", []),
            "languages": candidate_data.get("languages", [])
        })

        response_text = groq_client.chat_completion(
            system_prompt=SYSTEM_PROMPT_HIRING_MATCH,
            user_message=f"Candidate Profile:\n{candidate_text}\n\nJob Description:\n{job_description}",
            max_tokens=2000,
            temperature=0.1
        )

        json_text = groq_client.extract_json_from_response(response_text)
        match_result = json.loads(json_text)
        return match_result

    except Exception as e:
        print(f"\u274c AI matching error: {e}")
        return _build_match_error_fallback(str(e))

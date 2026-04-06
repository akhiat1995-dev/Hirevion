import json
from typing import Dict
from services.ai.client import groq_client
from services.ai.prompts import SYSTEM_PROMPT_CV
from config.settings import settings


def _build_cv_error_fallback(error: str) -> Dict:
    """Build a fallback response when CV parsing fails."""
    return {
        "candidate_info": {
            "name": "",
            "email": "",
            "phone": "",
            "address": "",
            "linkedin": ""
        },
        "summary": "Error parsing CV",
        "skills": [],
        "experience_years": 0,
        "work_experience": [],
        "education": [],
        "certifications": [],
        "languages": [],
        "projects": [],
        "analysis": {
            "overall_score": 0,
            "section_ratings": {},
            "strengths": [],
            "weaknesses": [],
            "improvement_tips": []
        },
        "report": {
            "english": {
                "title": "CV Analysis Report",
                "executive_summary": "An error occurred while analyzing the CV",
                "detailed_feedback": f"Error: {error}",
                "recommendations": []
            },
            "french": {
                "title": "Rapport d'Analyse du CV",
                "executive_summary": "Une erreur s'est produite lors de l'analyse du CV",
                "detailed_feedback": f"Erreur: {error}",
                "recommendations": []
            }
        },
        "error": error
    }


def parse_cv_with_ai(cv_text: str) -> Dict:
    """
    Use Groq AI to parse CV text and extract structured data.
    
    Args:
        cv_text: Raw text extracted from CV
    
    Returns:
        Dictionary with parsed CV data
    """
    try:
        if len(cv_text) > settings.CV_TEXT_MAX_LENGTH:
            cv_text = cv_text[:settings.CV_TEXT_MAX_LENGTH] + "\n[Content truncated for analysis]"

        response_text = groq_client.chat_completion(
            system_prompt=SYSTEM_PROMPT_CV,
            user_message=f"Parse this CV:\n\n{cv_text}",
            max_tokens=settings.AI_MAX_TOKENS,
            temperature=settings.AI_TEMPERATURE
        )

        json_text = groq_client.extract_json_from_response(response_text)
        parsed_data = json.loads(json_text)
        return parsed_data

    except Exception as e:
        print(f"\u274c AI parsing error: {e}")
        return _build_cv_error_fallback(str(e))

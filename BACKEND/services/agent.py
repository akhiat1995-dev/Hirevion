import os
import json
from typing import Dict, List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Skill similarity mapping for flexible matching
SKILL_SIMILARITY_MAP = {
    # Programming Languages
    "python": ["django", "flask", "fastapi", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"],
    "javascript": ["typescript", "nodejs", "react", "vue", "angular", "express", "nextjs"],
    "typescript": ["javascript", "angular", "react", "vue", "nestjs"],
    "java": ["spring", "spring boot", "hibernate", "maven", "gradle"],
    "c#": [".net", "asp.net", "entity framework", "dotnet"],
    "php": ["laravel", "symfony", "codeigniter", "wordpress"],
    "ruby": ["rails", "ruby on rails", "sinatra"],
    "go": ["golang", "gin"],
    "rust": ["cargo"],
    
    # Frontend
    "react": ["reactjs", "nextjs", "redux", "javascript", "typescript"],
    "vue": ["vuejs", "vue.js", "nuxt", "javascript"],
    "angular": ["angularjs", "typescript"],
    "html": ["html5", "css", "frontend"],
    "css": ["css3", "scss", "sass", "less", "tailwind", "bootstrap"],
    
    # Backend
    "node": ["nodejs", "node.js", "express", "nest", "javascript"],
    "django": ["python", "flask", "fastapi"],
    "flask": ["python", "django", "fastapi"],
    "spring": ["spring boot", "java", "hibernate"],
    
    # Databases
    "sql": ["mysql", "postgresql", "sqlite", "oracle", "database"],
    "mysql": ["sql", "database", "relational database"],
    "postgresql": ["postgres", "sql", "database"],
    "mongodb": ["mongo", "nosql", "database"],
    "redis": ["cache", "database"],
    
    # Cloud & DevOps
    "aws": ["amazon web services", "cloud", "ec2", "s3", "lambda"],
    "azure": ["microsoft azure", "cloud"],
    "gcp": ["google cloud", "google cloud platform"],
    "docker": ["containerization", "containers"],
    "kubernetes": ["k8s", "docker", "orchestration"],
    "jenkins": ["ci/cd", "continuous integration"],
    "git": ["github", "gitlab", "bitbucket", "version control"],
    
    # Data Science & AI
    "machine learning": ["ml", "ai", "tensorflow", "pytorch", "scikit-learn"],
    "ai": ["artificial intelligence", "machine learning", "deep learning"],
    "data science": ["data analysis", "machine learning", "statistics", "python"],
    
    # Project Management
    "agile": ["scrum", "kanban", "sprint"],
    "scrum": ["agile", "sprint", "product owner"],
    "project management": ["pm", "team lead", "coordination"],
    
    # Soft Skills equivalents
    "leadership": ["team lead", "management", "mentoring", "supervision"],
    "communication": ["presentation", "documentation", "collaboration"],
    "problem solving": ["troubleshooting", "debugging", "analytical thinking"]
}

def find_similar_skills(required_skill: str, candidate_skills: List[str]) -> List[Dict]:
    """Find similar or related skills in candidate's skillset."""
    required_lower = required_skill.lower()
    similar_found = []
    
    # Direct match
    if required_lower in [s.lower() for s in candidate_skills]:
        return [{"skill": required_skill, "type": "exact", "similarity": 100}]
    
    # Check similarity map
    if required_lower in SKILL_SIMILARITY_MAP:
        related = SKILL_SIMILARITY_MAP[required_lower]
        for candidate_skill in candidate_skills:
            candidate_lower = candidate_skill.lower()
            if candidate_lower in related:
                similar_found.append({
                    "skill": candidate_skill,
                    "type": "similar",
                    "similarity": 85
                })
    
    # Check reverse (if candidate has a skill that maps to required)
    for skill, related in SKILL_SIMILARITY_MAP.items():
        if required_lower in related:
            for candidate_skill in candidate_skills:
                if candidate_skill.lower() == skill:
                    similar_found.append({
                        "skill": candidate_skill,
                        "type": "related",
                        "similarity": 75
                    })
    
    return similar_found

SYSTEM_PROMPT_CV = """You are an expert CV/Resume analyst and career coach. Analyze the CV thoroughly and return ONLY a valid JSON object with this exact structure:

{
    "candidate_info": {
        "name": "Full Name",
        "email": "email@example.com",
        "phone": "phone number",
        "address": "city, country",
        "linkedin": "linkedin url or empty"
    },
    "summary": "Brief professional summary extracted from CV",
    "skills": ["skill1", "skill2", "skill3"],
    "experience_years": 5,
    "work_experience": [
        {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start - End",
            "description": "Key responsibilities"
        }
    ],
    "education": [
        {
            "degree": "Degree Name",
            "institution": "University/Institution",
            "year": "Graduation Year"
        }
    ],
    "certifications": ["Certification 1", "Certification 2"],
    "languages": [
        {
            "language": "Language Name",
            "level": "Proficiency Level"
        }
    ],
    "projects": [
        {
            "name": "Project Name",
            "description": "Brief description",
            "technologies": ["tech1", "tech2"]
        }
    ],
    "analysis": {
        "overall_score": 75,
        "section_ratings": {
            "contact_info": {"score": 90, "comment": "Complete contact details"},
            "summary": {"score": 70, "comment": "Good but could be more impactful"},
            "skills": {"score": 80, "comment": "Well organized skills section"},
            "experience": {"score": 75, "comment": "Good descriptions but lacks metrics"},
            "education": {"score": 85, "comment": "Clear and well presented"},
            "certifications": {"score": 60, "comment": "Could add more relevant certifications"},
            "languages": {"score": 70, "comment": "Adequate language skills"},
            "projects": {"score": 65, "comment": "Projects could be better detailed"}
        },
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "improvement_tips": ["tip1", "tip2", "tip3"]
    },
    "report": {
        "english": {
            "title": "CV Analysis Report",
            "executive_summary": "Brief overview of the candidate's profile and CV quality",
            "detailed_feedback": "Detailed paragraph about the CV strengths and areas for improvement",
            "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
        },
        "french": {
            "title": "Rapport d'Analyse du CV",
            "executive_summary": "Bref aperçu du profil du candidat et de la qualité du CV",
            "detailed_feedback": "Paragraphe détaillé sur les points forts du CV et les domaines à améliorer",
            "recommendations": ["recommandation1", "recommandation2", "recommandation3"]
        }
    }
}

Scoring Guidelines (0-100):
- 90-100: Excellent, outstanding section
- 75-89: Good, well presented
- 60-74: Average, needs minor improvements
- 40-59: Below average, needs significant improvements
- 0-39: Poor or missing section

If information is missing, use empty strings, empty arrays, or 0 for numbers. Always provide scores and feedback in both English and French."""

SYSTEM_PROMPT_JOB_PROFILE = """You are an expert HR analyst. Extract and structure a job profile from the recruiter input.
Return ONLY a valid JSON object with this exact structure:

{
    "job_title": "Job Title",
    "number_of_positions": 2,
    "domain": "Technology/Finance/Healthcare/etc",
    "seniority_level": "Junior/Mid/Senior/Lead",
    "experience_required": {
        "min_years": 3,
        "max_years": 5,
        "description": "Experience requirements"
    },
    "required_skills": ["skill1", "skill2"],
    "optional_skills": ["skill3", "skill4"],
    "tools_technologies": ["tool1", "tool2"],
    "education_requirements": ["Bachelor's degree", "etc"],
    "languages_required": ["English", "French"],
    "certifications_preferred": ["cert1", "cert2"],
    "key_responsibilities": ["responsibility1", "responsibility2"],
    "salary_range": "Estimated range if mentioned or 'Not specified'",
    "location": "Location or Remote",
    "work_mode": "Remote/Hybrid/On-site"
}

Extract all relevant information. Use empty arrays or 'Not specified' for missing information."""

SYSTEM_PROMPT_HIRING_MATCH = """You are an AI Recruitment Manager operating inside a CV screening platform. You are BALANCED - neither too strict nor too lenient. Your goal is to identify candidates with POTENTIAL, not just perfect matches.

Your task is to evaluate a candidate against a job profile and compute a FAIR match score (0-100).

IMPORTANT SCORING RULES (FLEXIBLE APPROACH):

1. SKILLS MATCHING (40% of total score):
   - Required skills present → +10 points each
   - Similar/related skills → +7 points (e.g., "Python" and "Django", "JavaScript" and "TypeScript")
   - Transferable skills → +5 points (e.g., "Project Management" for a leadership role)
   - Partial knowledge → +3 points (familiarity but not expert level)
   - Missing required skill → -8 points (not -15, be more forgiving)
   - BUT: If candidate has 60%+ of required skills, don't penalize heavily

2. EXPERIENCE MATCHING (25% of total score):
   - Meets or exceeds required years → 90-100 points
   - Within 1-2 years below → 70-85 points (consider potential)
   - 3+ years below BUT has strong skills → 50-70 points (junior with potential)
   - Quality of experience matters more than just quantity

3. EDUCATION MATCHING (15% of total score):
   - Meets requirement → 100 points
   - Related field (e.g., CS degree for software role) → 90 points
   - Self-taught with strong portfolio → 80 points
   - Different field but relevant experience → 70 points

4. DOMAIN & CULTURE FIT (20% of total score):
   - Industry alignment → 80-100 points
   - Adjacent industry with transferable knowledge → 60-79 points
   - Strong soft skills/communication → bonus +5-10 points
   - Problem-solving ability shown → bonus +5-10 points

SELECTION THRESHOLDS (More Flexible):
- Excellent fit = 80-100 (Strong hire)
- Good fit = 65-79 (Hire with mentorship)
- Potential fit = 50-64 (Interview to assess potential)
- Not suitable = below 50

KEY PRINCIPLES:
- Look for POTENTIAL, not perfection
- Similar skills count (Python ↔ Django, React ↔ Vue)
- Related experience in adjacent fields counts
- Self-taught candidates with strong projects are valuable
- Soft skills and problem-solving ability matter
- Cultural fit and learning attitude are important
- Consider the "whole candidate", not just checkboxes

Return ONLY a valid JSON object with this exact structure:

{
    "candidate_name": "Full Name",
    "match_score": 72,
    "decision": "selected" or "rejected",
    "selection_tier": "excellent" or "good" or "potential" or "not_suitable",
    "seniority_match": {
        "job_level": "Senior",
        "candidate_level": "Mid-Senior",
        "score": 75,
        "comment": "Slightly below but shows growth trajectory"
    },
    "skills_match": {
        "required_matched": ["skill1", "skill2"],
        "required_missing": ["skill3"],
        "similar_skills": [{"required": "React", "found": "Vue", "similarity": "high"}],
        "related_skills": ["skill4", "skill5"],
        "score": 68,
        "comment": "Has 70% of required skills plus strong related technologies"
    },
    "experience_match": {
        "required_years": 5,
        "candidate_years": 3,
        "score": 70,
        "comment": "2 years below but high-quality experience in similar roles"
    },
    "education_match": {
        "required": "Bachelor's degree",
        "candidate": "Self-taught + Certifications",
        "score": 75,
        "comment": "Non-traditional background but strong portfolio"
    },
    "domain_fit": {
        "job_domain": "Technology",
        "candidate_domains": ["Technology", "Consulting"],
        "score": 85,
        "comment": "Strong tech background with consulting experience"
    },
    "potential_indicators": {
        "growth_trajectory": "high",
        "learning_agility": "strong",
        "problem_solving": "demonstrated",
        "bonus_points": 8
    },
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "development_areas": ["area to improve 1", "area to improve 2"],
    "interview_focus_areas": ["area1", "area2"],
    "why_selected": "Clear explanation of potential and fit",
    "short_explanation": "One sentence summary",
    "reason": "Detailed explanation (only if rejected below 50)"
}

BE FAIR AND BALANCED:
- A candidate with 60-70% skill match + strong experience + growth potential = SELECTED
- Missing one required skill but has 3 similar skills = Don't penalize heavily
- Junior candidate with exceptional projects = Consider for mentorship
- Career changer with transferable skills = Give fair consideration"""

def parse_cv_with_ai(cv_text: str) -> Dict:
    """Use Groq AI to parse CV text and extract structured data."""
    try:
        if len(cv_text) > 8000:
            cv_text = cv_text[:8000] + "\n[Content truncated for analysis]"

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_CV},
                {"role": "user", "content": f"Parse this CV:\n\n{cv_text}"}
            ],
            temperature=0.1,
            max_tokens=4000
        )

        result_text = response.choices[0].message.content

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            result_text = result_text[json_start:json_end]

        parsed_data = json.loads(result_text)
        return parsed_data

    except Exception as e:
        print(f"❌ AI parsing error: {e}")
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
                    "detailed_feedback": f"Error: {str(e)}",
                    "recommendations": []
                },
                "french": {
                    "title": "Rapport d'Analyse du CV",
                    "executive_summary": "Une erreur s'est produite lors de l'analyse du CV",
                    "detailed_feedback": f"Erreur: {str(e)}",
                    "recommendations": []
                }
            },
            "error": str(e)
        }

def match_candidate_to_job(candidate_data: Dict, job_description: str) -> Dict:
    """Match a candidate against a job description using AI."""
    try:
        candidate_text = json.dumps({
            "skills": candidate_data.get("skills", []),
            "experience_years": candidate_data.get("experience_years", 0),
            "education": candidate_data.get("education", []),
            "work_experience": candidate_data.get("work_experience", []),
            "certifications": candidate_data.get("certifications", []),
            "languages": candidate_data.get("languages", [])
        })

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_HIRING_MATCH},
                {"role": "user", "content": f"Candidate Profile:\n{candidate_text}\n\nJob Description:\n{job_description}"}
            ],
            temperature=0.1,
            max_tokens=2000
        )

        result_text = response.choices[0].message.content

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            result_text = result_text[json_start:json_end]

        match_result = json.loads(result_text)
        return match_result

    except Exception as e:
        print(f"❌ AI matching error: {e}")
        return {
            "candidate_name": "Unknown",
            "match_score": 0,
            "decision": "rejected",
            "seniority_match": {"job_level": "", "candidate_level": "", "score": 0, "comment": "Error"},
            "skills_match": {"required_matched": [], "required_missing": [], "optional_matched": [], "score": 0, "comment": "Error"},
            "experience_match": {"required_years": 0, "candidate_years": 0, "score": 0, "comment": "Error"},
            "education_match": {"required": "", "candidate": "", "score": 0, "comment": "Error"},
            "domain_fit": {"job_domain": "", "candidate_domains": [], "score": 0, "comment": "Error"},
            "strengths": [],
            "weaknesses": [],
            "interview_focus_areas": [],
            "short_explanation": "Error occurred during matching",
            "reason": str(e),
            "error": str(e)
        }

def extract_job_profile(job_title: str, number_of_positions: int, job_requirements: str) -> Dict:
    """Extract structured job profile from recruiter input."""
    try:
        input_text = f"""
Job Title: {job_title}
Number of Positions: {number_of_positions}
Job Requirements:
{job_requirements}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_JOB_PROFILE},
                {"role": "user", "content": input_text}
            ],
            temperature=0.1,
            max_tokens=2000
        )

        result_text = response.choices[0].message.content

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            result_text = result_text[json_start:json_end]

        job_profile = json.loads(result_text)
        job_profile["number_of_positions"] = number_of_positions
        return job_profile

    except Exception as e:
        print(f"❌ Job profile extraction error: {e}")
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
            "error": str(e)
        }

def run_hiring_pipeline(job_title: str, number_of_positions: int, job_requirements: str, candidates: List[Dict]) -> Dict:
    """Execute the complete hiring pipeline with FLEXIBLE matching."""
    
    job_profile = extract_job_profile(job_title, number_of_positions, job_requirements)
    
    print(f"\n🎯 Processing {len(candidates)} candidates with FLEXIBLE matching...")
    print(f"📋 Job: {job_title}")
    print(f"👥 Positions: {number_of_positions}")
    print(f"🔧 Required Skills: {', '.join(job_profile.get('required_skills', [])[:5])}...")
    
    evaluated_candidates = []
    for idx, candidate in enumerate(candidates, 1):
        parsed = candidate.get("parsed_data", {})
        candidate_info = parsed.get("candidate_info", {})
        candidate_name = candidate_info.get("name", parsed.get("name", f"Candidate {idx}"))
        
        print(f"  📄 Analyzing: {candidate_name}...", end=" ")
        
        match_result = match_candidate_to_job(
            {
                "name": candidate_name,
                "skills": parsed.get("skills", []),
                "experience_years": parsed.get("experience_years", 0),
                "education": parsed.get("education", []),
                "work_experience": parsed.get("work_experience", []),
                "certifications": parsed.get("certifications", []),
                "languages": parsed.get("languages", []),
                "summary": parsed.get("summary", "")
            },
            job_requirements
        )
        
        match_result["cv_id"] = candidate.get("id", "unknown")
        match_result["candidate_name"] = candidate_name
        match_result["candidate_number"] = idx
        match_result["filename"] = candidate.get("filename", "")
        
        score = match_result.get("match_score", 0)
        tier = match_result.get("selection_tier", "not_suitable")
        print(f"Score: {score}% ({tier})")
        
        evaluated_candidates.append(match_result)
    
    # Sort by match score
    evaluated_candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    
    # NEW: More flexible selection
    # Include candidates from all tiers up to number_of_positions
    excellent = [c for c in evaluated_candidates if c.get("selection_tier") == "excellent"]
    good = [c for c in evaluated_candidates if c.get("selection_tier") == "good"]
    potential = [c for c in evaluated_candidates if c.get("selection_tier") == "potential"]
    not_suitable = [c for c in evaluated_candidates if c.get("selection_tier") == "not_suitable" or c.get("decision") == "rejected"]
    
    # Select best candidates up to number_of_positions
    selected = []
    selected.extend(excellent)
    selected.extend(good)
    selected.extend(potential)
    selected = selected[:number_of_positions]
    
    # If we still need more and have not_suitable candidates, pick the best ones
    if len(selected) < number_of_positions and not_suitable:
        remaining_slots = number_of_positions - len(selected)
        # Sort not_suitable by score and take top ones
        not_suitable_sorted = sorted(not_suitable, key=lambda x: x.get("match_score", 0), reverse=True)
        selected.extend(not_suitable_sorted[:remaining_slots])
    
    # Rejected = everyone not selected
    rejected = [c for c in evaluated_candidates if c not in selected]
    
    print(f"\n📊 Selection Results:")
    print(f"   Excellent: {len(excellent)} | Good: {len(good)} | Potential: {len(potential)} | Not Suitable: {len(not_suitable)}")
    print(f"   Selected: {len(selected)} | Rejected: {len(rejected)}")
    
    def create_candidate_output(c, rank=None, is_selected=True):
        """Create standardized candidate output with detailed matching info."""
        skills_match = c.get("skills_match", {})
        exp_match = c.get("experience_match", {})
        edu_match = c.get("education_match", {})
        domain_fit = c.get("domain_fit", {})
        potential = c.get("potential_indicators", {})
        
        # Build comprehensive matching details
        matching_details = {
            "overall_score": c.get("match_score", 0),
            "tier": c.get("selection_tier", "unknown"),
            "breakdown": {
                "skills_score": skills_match.get("score", 0),
                "experience_score": exp_match.get("score", 0),
                "education_score": edu_match.get("score", 0),
                "domain_score": domain_fit.get("score", 0),
                "potential_bonus": potential.get("bonus_points", 0)
            }
        }
        
        # Skills analysis
        skills_analysis = {
            "required_matched": skills_match.get("required_matched", []),
            "required_missing": skills_match.get("required_missing", []),
            "similar_skills": skills_match.get("similar_skills", []),
            "related_skills": skills_match.get("related_skills", []),
            "match_percentage": skills_match.get("score", 0),
            "assessment": skills_match.get("comment", "")
        }
        
        # Experience analysis
        exp_analysis = {
            "candidate_years": exp_match.get("candidate_years", 0),
            "required_years": exp_match.get("required_years", 0),
            "score": exp_match.get("score", 0),
            "assessment": exp_match.get("comment", "")
        }
        
        # Potential indicators
        potential_analysis = {
            "growth_trajectory": potential.get("growth_trajectory", "unknown"),
            "learning_agility": potential.get("learning_agility", "unknown"),
            "problem_solving": potential.get("problem_solving", "unknown"),
            "bonus_points": potential.get("bonus_points", 0)
        }
        
        base_output = {
            "candidate_number": c.get("candidate_number"),
            "cv_id": c.get("cv_id"),
            "candidate_name": c.get("candidate_name"),
            "filename": c.get("filename"),
            "matching_details": matching_details,
            "skills_analysis": skills_analysis,
            "experience_analysis": exp_analysis,
            "potential_analysis": potential_analysis,
            "strengths": c.get("strengths", []),
            "weaknesses": c.get("weaknesses", []),
            "development_areas": c.get("development_areas", []),
            "interview_focus_areas": c.get("interview_focus_areas", []),
            "detailed_feedback": c.get("why_selected") or c.get("short_explanation", "")
        }
        
        if is_selected and rank:
            base_output["rank"] = rank
            base_output["decision"] = "APPROVED"
            base_output["selection_reason"] = c.get("why_selected", c.get("short_explanation", "Matches job requirements"))
        else:
            base_output["decision"] = "REJECTED"
            base_output["rejection_reason"] = c.get("reason", "Does not meet minimum requirements")
            base_output["missing_requirements"] = skills_match.get("required_missing", [])
        
        return base_output
    
    # Build outputs
    selected_output = [create_candidate_output(c, rank=idx+1, is_selected=True) for idx, c in enumerate(selected)]
    rejected_output = [create_candidate_output(c, is_selected=False) for c in rejected]
    
    # Calculate tier distribution
    tier_distribution = {
        "excellent": len(excellent),
        "good": len(good),
        "potential": len(potential),
        "not_suitable": len(not_suitable)
    }
    
    # Build hiring recommendations
    recommendations = []
    if len(selected) == 0:
        recommendations.append("No candidates met the minimum requirements. Consider broadening job requirements or sourcing more candidates.")
    elif len(selected) < number_of_positions:
        recommendations.append(f"Only {len(selected)} of {number_of_positions} positions can be filled with current candidates. Consider:")
        if potential:
            recommendations.append(f"  • Interviewing {len(potential)} 'potential' candidates for junior/mentorship roles")
        recommendations.append("  • Expanding candidate search")
        recommendations.append("  • Adjusting job requirements if too restrictive")
    else:
        recommendations.append(f"✅ All {number_of_positions} positions can be filled with qualified candidates.")
        if excellent:
            recommendations.append(f"  • {len(excellent)} excellent candidates ready for immediate hire")
        if good:
            recommendations.append(f"  • {len(good)} good candidates with strong potential")
    
    return {
        "job_summary": {
            "title": job_profile.get("job_title", job_title),
            "positions_available": number_of_positions,
            "domain": job_profile.get("domain", "Not specified"),
            "seniority": job_profile.get("seniority_level", "Not specified"),
            "required_skills": job_profile.get("required_skills", []),
            "optional_skills": job_profile.get("optional_skills", []),
            "experience_required": job_profile.get("experience_required", {})
        },
        "selection_summary": {
            "total_candidates": len(candidates),
            "approved_count": len(selected_output),
            "rejected_count": len(rejected_output),
            "positions_filled": len(selected_output) > 0,
            "all_positions_filled": len(selected_output) >= number_of_positions,
            "tier_distribution": tier_distribution
        },
        "approved_candidates": selected_output,
        "rejected_candidates": rejected_output,
        "hiring_recommendations": recommendations,
        "job_profile": job_profile
    }

from typing import Dict, List
from services.ai.job_extractor import extract_job_profile
from services.ai.job_matcher import match_candidate_to_job


def _create_candidate_output(c: Dict, rank: int = None, is_selected: bool = True) -> Dict:
    """Create standardized candidate output with detailed matching info."""
    skills_match = c.get("skills_match", {})
    exp_match = c.get("experience_match", {})
    edu_match = c.get("education_match", {})
    domain_fit = c.get("domain_fit", {})
    seniority_match = c.get("seniority_match", {})
    soft_skills = c.get("soft_skills", {})
    growth_potential = c.get("growth_potential", {})
    potential = c.get("potential_indicators", {})

    matching_details = {
        "overall_score": c.get("match_score", 0),
        "tier": c.get("selection_tier", "unknown"),
        "breakdown": {
            "skills_score": skills_match.get("score", 0),
            "experience_score": exp_match.get("score", 0),
            "education_score": edu_match.get("score", 0),
            "domain_score": domain_fit.get("score", 0),
            "soft_skills_score": soft_skills.get("score", 0),
            "growth_score": growth_potential.get("score", 0),
            "seniority_score": seniority_match.get("score", 0),
            "potential_bonus": potential.get("bonus_points", 0)
        }
    }

    skills_analysis = {
        "required_matched": skills_match.get("required_matched", []),
        "required_missing": skills_match.get("required_missing", []),
        "similar_skills": skills_match.get("similar_skills", []),
        "related_skills": skills_match.get("related_skills", []),
        "match_percentage": skills_match.get("score", 0),
        "assessment": skills_match.get("comment", "")
    }

    exp_analysis = {
        "candidate_years": exp_match.get("candidate_years", 0),
        "required_years": exp_match.get("required_years", 0),
        "score": exp_match.get("score", 0),
        "assessment": exp_match.get("comment", ""),
        "industry_alignment": exp_match.get("industry_alignment", "insufficient data"),
        "notable_achievements": exp_match.get("notable_achievements", [])
    }

    edu_analysis = {
        "required": edu_match.get("required", "Not specified"),
        "candidate": edu_match.get("candidate", "Not specified"),
        "score": edu_match.get("score", 0),
        "assessment": edu_match.get("comment", ""),
        "relevant_certifications": edu_match.get("relevant_certifications", [])
    }

    seniority_analysis = {
        "job_level": seniority_match.get("job_level", "Not specified"),
        "candidate_level": seniority_match.get("candidate_level", "Not specified"),
        "score": seniority_match.get("score", 0),
        "assessment": seniority_match.get("comment", "")
    }

    soft_skills_analysis = {
        "detected": soft_skills.get("detected", []),
        "red_flags": soft_skills.get("red_flags", []),
        "score": soft_skills.get("score", 0)
    }

    growth_analysis = {
        "learning_trajectory": growth_potential.get("learning_trajectory", "unknown"),
        "career_progression": growth_potential.get("career_progression", "Insufficient data"),
        "score": growth_potential.get("score", 0)
    }

    domain_analysis = {
        "job_domain": domain_fit.get("job_domain", "Not specified"),
        "candidate_domains": domain_fit.get("candidate_domains", []),
        "score": domain_fit.get("score", 0),
        "assessment": domain_fit.get("comment", "")
    }

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
        "education_analysis": edu_analysis,
        "seniority_analysis": seniority_analysis,
        "soft_skills_analysis": soft_skills_analysis,
        "growth_analysis": growth_analysis,
        "domain_analysis": domain_analysis,
        "potential_analysis": potential_analysis,
        "strengths": c.get("strengths", []),
        "weaknesses": c.get("weaknesses", []),
        "development_areas": c.get("development_areas", []),
        "interview_focus_areas": c.get("interview_focus_areas", []),
        "recommended_interview_questions": c.get("recommended_interview_questions", []),
        "recruiter_commentary": c.get("recruiter_commentary", ""),
        "detailed_feedback": c.get("why_selected") or c.get("short_explanation", ""),
        # Keep raw reason for frontend compatibility
        "reason": c.get("reason", "Does not meet minimum requirements")
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


def _build_hiring_recommendations(selected: List[Dict], number_of_positions: int, excellent: List[Dict], good: List[Dict], potential: List[Dict]) -> List[str]:
    """Build hiring recommendations based on selection results."""
    recommendations = []
    if len(selected) == 0:
        recommendations.append("No candidates met the minimum requirements. Consider broadening job requirements or sourcing more candidates.")
    elif len(selected) < number_of_positions:
        recommendations.append(f"Only {len(selected)} of {number_of_positions} positions can be filled with current candidates. Consider:")
        if potential:
            recommendations.append(f"  \u2022 Interviewing {len(potential)} 'potential' candidates for junior/mentorship roles")
        recommendations.append("  \u2022 Expanding candidate search")
        recommendations.append("  \u2022 Adjusting job requirements if too restrictive")
    else:
        recommendations.append(f"\u2705 All {number_of_positions} positions can be filled with qualified candidates.")
        if excellent:
            recommendations.append(f"  \u2022 {len(excellent)} excellent candidates ready for immediate hire")
        if good:
            recommendations.append(f"  \u2022 {len(good)} good candidates with strong potential")
    return recommendations


def run_hiring_pipeline(job_title: str, number_of_positions: int, job_requirements: str, candidates: List[Dict]) -> Dict:
    """
    Execute the complete hiring pipeline with FLEXIBLE matching.
    
    Args:
        job_title: Job title
        number_of_positions: Number of open positions
        job_requirements: Job description and requirements
        candidates: List of candidate data dicts
    
    Returns:
        Complete hiring pipeline results
    """
    job_profile = extract_job_profile(job_title, number_of_positions, job_requirements)

    print(f"\n\U0001f3af Processing {len(candidates)} candidates with FLEXIBLE matching...")
    print(f"\U0001f4cb Job: {job_title}")
    print(f"\U0001f465 Positions: {number_of_positions}")
    print(f"\U0001f527 Required Skills: {', '.join(job_profile.get('required_skills', [])[:5])}...")

    evaluated_candidates = []
    for idx, candidate in enumerate(candidates, 1):
        parsed = candidate.get("parsed_data", {})
        candidate_info = parsed.get("candidate_info", {})
        candidate_name = candidate_info.get("name", parsed.get("name", f"Candidate {idx}"))

        print(f"  \U0001f4c4 Analyzing: {candidate_name}...", end=" ")

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

    evaluated_candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)

    excellent = [c for c in evaluated_candidates if c.get("selection_tier") == "excellent"]
    good = [c for c in evaluated_candidates if c.get("selection_tier") == "good"]
    potential = [c for c in evaluated_candidates if c.get("selection_tier") == "potential"]
    not_suitable = [c for c in evaluated_candidates if c.get("selection_tier") == "not_suitable" or c.get("decision") == "rejected"]

    selected = []
    selected.extend(excellent)
    selected.extend(good)
    selected.extend(potential)
    selected = selected[:number_of_positions]

    if len(selected) < number_of_positions and not_suitable:
        remaining_slots = number_of_positions - len(selected)
        not_suitable_sorted = sorted(not_suitable, key=lambda x: x.get("match_score", 0), reverse=True)
        selected.extend(not_suitable_sorted[:remaining_slots])

    rejected = [c for c in evaluated_candidates if c not in selected]

    print(f"\n\U0001f4ca Selection Results:")
    print(f"   Excellent: {len(excellent)} | Good: {len(good)} | Potential: {len(potential)} | Not Suitable: {len(not_suitable)}")
    print(f"   Selected: {len(selected)} | Rejected: {len(rejected)}")

    selected_output = [_create_candidate_output(c, rank=idx + 1, is_selected=True) for idx, c in enumerate(selected)]
    rejected_output = [_create_candidate_output(c, is_selected=False) for c in rejected]

    tier_distribution = {
        "excellent": len(excellent),
        "good": len(good),
        "potential": len(potential),
        "not_suitable": len(not_suitable)
    }

    recommendations = _build_hiring_recommendations(selected, number_of_positions, excellent, good, potential)

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

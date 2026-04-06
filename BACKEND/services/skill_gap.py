"""
Skill Gap Analysis Service

Analyzes a candidate's skills and recommends what to learn to improve their score.
"""

TOP_SKILLS_BY_DOMAIN = {
    "Technology": {
        "essential": ["Python", "JavaScript", "SQL", "Git", "Docker"],
        "high_value": ["AWS", "Kubernetes", "React", "TypeScript", "CI/CD"],
        "bonus": ["Terraform", "GraphQL", "Redis", "MongoDB", "Microservices"],
        "resources": {
            "Python": "https://docs.python.org/3/tutorial/",
            "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            "SQL": "https://www.w3schools.com/sql/",
            "Git": "https://git-scm.com/book/en/v2/Getting-Started-First-Steps-Git",
            "Docker": "https://docs.docker.com/get-started/",
            "AWS": "https://aws.amazon.com/training/",
            "Kubernetes": "https://kubernetes.io/docs/tutorials/",
            "React": "https://react.dev/learn",
            "TypeScript": "https://www.typescriptlang.org/docs/",
            "CI/CD": "https://docs.github.com/en/actions"
        }
    },
    "Data Science": {
        "essential": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas"],
        "high_value": ["TensorFlow", "PyTorch", "Scikit-learn", "Data Visualization", "R"],
        "bonus": ["Deep Learning", "NLP", "Computer Vision", "MLOps", "Spark"],
        "resources": {
            "Python": "https://docs.python.org/3/tutorial/",
            "SQL": "https://www.w3schools.com/sql/",
            "Machine Learning": "https://www.coursera.org/learn/machine-learning",
            "Statistics": "https://www.khanacademy.org/math/statistics-probability",
            "Pandas": "https://pandas.pydata.org/docs/getting_started/",
            "TensorFlow": "https://www.tensorflow.org/tutorials",
            "PyTorch": "https://pytorch.org/tutorials/",
            "Scikit-learn": "https://scikit-learn.org/stable/tutorial/",
            "Data Visualization": "https://matplotlib.org/stable/tutorials/",
            "R": "https://www.r-project.org/"
        }
    },
    "Design": {
        "essential": ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
        "high_value": ["Adobe XD", "Sketch", "User Testing", "Wireframing", "Accessibility"],
        "bonus": ["Motion Design", "Design Thinking", "HTML/CSS", "Responsive Design", "Branding"],
        "resources": {
            "Figma": "https://help.figma.com/hc/en-us/categories/360002051613-Get-started",
            "UI Design": "https://www.refactoringui.com/",
            "UX Research": "https://www.nngroup.com/articles/",
            "Prototyping": "https://www.figma.com/prototyping/",
            "Design Systems": "https://www.designsystems.com/"
        }
    },
    "Marketing": {
        "essential": ["SEO", "Content Marketing", "Social Media", "Analytics", "Email Marketing"],
        "high_value": ["Google Ads", "Facebook Ads", "Copywriting", "Marketing Automation", "CRM"],
        "bonus": ["Video Marketing", "Influencer Marketing", "A/B Testing", "Brand Strategy", "PR"],
        "resources": {
            "SEO": "https://moz.com/beginners-guide-to-seo",
            "Content Marketing": "https://blog.hubspot.com/marketing/content-marketing",
            "Social Media": "https://blog.hubspot.com/marketing/social-media-marketing-guide",
            "Analytics": "https://analytics.google.com/analytics/academy/",
            "Email Marketing": "https://mailchimp.com/resources/email-marketing-guide/"
        }
    }
}

DEFAULT_SKILLS = {
    "essential": ["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"],
    "high_value": ["Project Management", "Agile", "Critical Thinking", "Adaptability", "Negotiation"],
    "bonus": ["Public Speaking", "Mentoring", "Cross-functional Collaboration", "Strategic Thinking", "Data-Driven Decision Making"],
    "resources": {
        "Communication": "https://www.coursera.org/learn/communication-skills",
        "Teamwork": "https://www.mindtools.com/pages/article/team-building.htm",
        "Problem Solving": "https://www.mindtools.com/pages/article/newTMC_00.htm",
        "Time Management": "https://www.mindtools.com/pages/article/91.htm",
        "Leadership": "https://www.coursera.org/learn/leadership-skills"
    }
}

SKILL_SCORE_IMPACT = {
    "essential": 8,
    "high_value": 5,
    "bonus": 3
}


def detect_domain(skills: list, experience: list = None) -> str:
    """Detect the candidate's primary domain based on skills."""
    domain_scores = {}
    
    for domain, domain_skills in TOP_SKILLS_BY_DOMAIN.items():
        all_domain_skills = set(
            domain_skills["essential"] + 
            domain_skills["high_value"] + 
            domain_skills["bonus"]
        )
        match_count = sum(1 for s in skills if s.lower() in [d.lower() for d in all_domain_skills])
        domain_scores[domain] = match_count
    
    if not domain_scores or max(domain_scores.values()) == 0:
        return "General"
    
    return max(domain_scores, key=domain_scores.get)


def analyze_skill_gap(candidate_skills: list, candidate_score: int, experience_years: int = 0) -> dict:
    """
    Analyze skill gaps and provide learning recommendations.
    
    Args:
        candidate_skills: List of candidate's current skills
        candidate_score: Current overall CV score (0-100)
        experience_years: Years of experience
    
    Returns:
        Dictionary with skill gap analysis and recommendations
    """
    candidate_skills_lower = [s.lower() for s in candidate_skills]
    domain = detect_domain(candidate_skills)
    domain_skills = TOP_SKILLS_BY_DOMAIN.get(domain, DEFAULT_SKILLS)
    
    target_score = min(candidate_score + 20, 95)
    
    recommendations = []
    current_impact = 0
    
    for tier in ["essential", "high_value", "bonus"]:
        for skill in domain_skills[tier]:
            if skill.lower() not in candidate_skills_lower:
                impact = SKILL_SCORE_IMPACT[tier]
                new_score = min(candidate_score + current_impact + impact, target_score)
                projected_gain = new_score - candidate_score
                
                recommendations.append({
                    "skill": skill,
                    "priority": tier.upper(),
                    "impact_points": impact,
                    "projected_score": round(new_score),
                    "projected_gain": round(projected_gain),
                    "why": _generate_why(skill, tier, domain, candidate_skills),
                    "learn_url": domain_skills["resources"].get(skill, f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}"),
                    "estimated_hours": _estimate_hours(skill, tier)
                })
                current_impact += impact
                
                if new_score >= target_score:
                    break
        if new_score >= target_score:
            break
    
    progress_steps = []
    running_score = candidate_score
    for rec in recommendations[:5]:
        running_score = min(running_score + rec["impact_points"], target_score)
        progress_steps.append({
            "skill": rec["skill"],
            "score_after": running_score,
            "gain": rec["impact_points"]
        })
    
    return {
        "current_score": candidate_score,
        "target_score": target_score,
        "domain": domain,
        "total_skills_to_learn": len(recommendations),
        "recommendations": recommendations,
        "progress_steps": progress_steps,
        "quick_wins": [r for r in recommendations if r["priority"] == "ESSENTIAL"][:3],
        "long_term": [r for r in recommendations if r["priority"] == "BONUS"][:3]
    }


def _generate_why(skill: str, tier: str, domain: str, candidate_skills: list) -> str:
    """Generate a personalized reason for learning this skill."""
    reasons = {
        "essential": f"Required in 70%+ of {domain} roles",
        "high_value": f"Highly valued by employers in {domain}",
        "bonus": f"Differentiates you from other {domain} candidates"
    }
    
    base_reason = reasons.get(tier, "Valuable addition to your profile")
    
    if tier == "high_value" and candidate_skills:
        return f"Complements your existing skills. {base_reason}"
    
    return base_reason


def _estimate_hours(skill: str, tier: str) -> str:
    """Estimate learning hours for a skill."""
    estimates = {
        "essential": "20-40 hours",
        "high_value": "40-80 hours",
        "bonus": "80-120 hours"
    }
    return estimates.get(tier, "40-80 hours")

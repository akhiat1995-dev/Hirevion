from typing import Dict, List


SKILL_SIMILARITY_MAP = {
    "python": ["django", "flask", "fastapi", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"],
    "javascript": ["typescript", "nodejs", "react", "vue", "angular", "express", "nextjs"],
    "typescript": ["javascript", "angular", "react", "vue", "nestjs"],
    "java": ["spring", "spring boot", "hibernate", "maven", "gradle"],
    "c#": [".net", "asp.net", "entity framework", "dotnet"],
    "php": ["laravel", "symfony", "codeigniter", "wordpress"],
    "ruby": ["rails", "ruby on rails", "sinatra"],
    "go": ["golang", "gin"],
    "rust": ["cargo"],

    "react": ["reactjs", "nextjs", "redux", "javascript", "typescript"],
    "vue": ["vuejs", "vue.js", "nuxt", "javascript"],
    "angular": ["angularjs", "typescript"],
    "html": ["html5", "css", "frontend"],
    "css": ["css3", "scss", "sass", "less", "tailwind", "bootstrap"],

    "node": ["nodejs", "node.js", "express", "nest", "javascript"],
    "django": ["python", "flask", "fastapi"],
    "flask": ["python", "django", "fastapi"],
    "spring": ["spring boot", "java", "hibernate"],

    "sql": ["mysql", "postgresql", "sqlite", "oracle", "database"],
    "mysql": ["sql", "database", "relational database"],
    "postgresql": ["postgres", "sql", "database"],
    "mongodb": ["mongo", "nosql", "database"],
    "redis": ["cache", "database"],

    "aws": ["amazon web services", "cloud", "ec2", "s3", "lambda"],
    "azure": ["microsoft azure", "cloud"],
    "gcp": ["google cloud", "google cloud platform"],
    "docker": ["containerization", "containers"],
    "kubernetes": ["k8s", "docker", "orchestration"],
    "jenkins": ["ci/cd", "continuous integration"],
    "git": ["github", "gitlab", "bitbucket", "version control"],

    "machine learning": ["ml", "ai", "tensorflow", "pytorch", "scikit-learn"],
    "ai": ["artificial intelligence", "machine learning", "deep learning"],
    "data science": ["data analysis", "machine learning", "statistics", "python"],

    "agile": ["scrum", "kanban", "sprint"],
    "scrum": ["agile", "sprint", "product owner"],
    "project management": ["pm", "team lead", "coordination"],

    "leadership": ["team lead", "management", "mentoring", "supervision"],
    "communication": ["presentation", "documentation", "collaboration"],
    "problem solving": ["troubleshooting", "debugging", "analytical thinking"]
}


def find_similar_skills(required_skill: str, candidate_skills: List[str]) -> List[Dict]:
    """Find similar or related skills in candidate's skillset."""
    required_lower = required_skill.lower()
    similar_found = []

    if required_lower in [s.lower() for s in candidate_skills]:
        return [{"skill": required_skill, "type": "exact", "similarity": 100}]

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

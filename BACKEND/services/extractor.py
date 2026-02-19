import pdfplumber
import re
import json

def read_pdf(file_path):
    print(f"📂 Reading file: {file_path}...")
    full_text = ""
    
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
        return full_text
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        return ""

def extract_info(text):
    print("🔍 Extracting data...")
    
    # Pattern for Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    email = email_match.group(0) if email_match else "Not Found"

    # Pattern for Phone (Simple version for international formats)
    phone_match = re.search(r'\+?\d[\d -]{8,15}\d', text)
    phone = phone_match.group(0) if phone_match else "Not Found"

    # Simple Skill Search
    common_skills = ["Python", "Java", "JavaScript", "React", "SQL", "Docker", "Git", "HTML", "CSS", "Node.js"]
    found_skills = []
    
    text_lower = text.lower()
    for skill in common_skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    return {
        "email": email,
        "phone": phone,
        "skills": found_skills,
        "raw_text_length": len(text)
    }

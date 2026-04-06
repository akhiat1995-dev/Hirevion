import os
import certifi
import ssl
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None

database = Database()

async def connect_db():
    """Connect to MongoDB."""
    try:
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            print("⚠️  MONGO_URI not found in environment variables")
            return

        if "YOUR_PASSWORD" in mongo_uri or "<password>" in mongo_uri.lower():
            print("❌ Error: You need to replace YOUR_PASSWORD in the MONGO_URI with your actual MongoDB password")
            return

        connection_success = False

        try:
            import ssl
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            
            database.client = AsyncIOMotorClient(
                mongo_uri,
                tls=True,
                tlsAllowInvalidCertificates=True,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                retryWrites=True
            )
            await database.client.admin.command('ping')
            connection_success = True
            print("✅ MongoDB connected successfully!")
        except Exception as e:
            print(f"⚠️  Connection failed: {e}")
            database.client = None
            database.db = None
            return
        
        database.db = database.client["cv_analyzer"]

    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        database.client = None
        database.db = None

async def close_db():
    """Close MongoDB connection."""
    if database.client:
        database.client.close()
        print("✅ MongoDB connection closed")

def get_db():
    """Get database instance."""
    if database.db is None:
        raise Exception("Database not connected. Call connect_db() first.")
    return database.db

async def save_cv(cv_data: dict):
    """Save CV data to database."""
    db = get_db()
    result = await db.cvs.insert_one(cv_data)
    return str(result.inserted_id)

async def get_all_cvs():
    """Get all CVs from database."""
    db = get_db()
    cvs = []
    async for cv in db.cvs.find():
        cv["id"] = str(cv.pop("_id"))
        cvs.append(cv)
    return cvs

async def get_user_cvs(user_id: str):
    """Get only the CVs belonging to a specific user."""
    db = get_db()
    cvs = []
    async for cv in db.cvs.find({"user_id": user_id}):
        cv["id"] = str(cv.pop("_id"))
        cvs.append(cv)
    return cvs

async def get_cv_by_id(cv_id: str):
    """Get a CV by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    cv = await db.cvs.find_one({"_id": ObjectId(cv_id)})
    if cv:
        cv["id"] = str(cv.pop("_id"))
    return cv

async def delete_cv_by_id(cv_id: str) -> bool:
    """Delete a CV by ID. Returns True if deleted, False if not found."""
    from bson.objectid import ObjectId
    db = get_db()
    result = await db.cvs.delete_one({"_id": ObjectId(cv_id)})
    return result.deleted_count > 0

async def save_job(job_data: dict):
    """Save a job posting to database."""
    db = get_db()
    result = await db.jobs.insert_one(job_data)
    return str(result.inserted_id)

async def get_all_jobs():
    """Get all job postings from database (deprecated - use get_user_jobs)."""
    db = get_db()
    jobs = []
    async for job in db.jobs.find():
        job["id"] = str(job.pop("_id"))
        jobs.append(job)
    return jobs

async def get_user_jobs(user_id: str):
    """Get only the jobs belonging to a specific user."""
    db = get_db()
    jobs = []
    async for job in db.jobs.find({"user_id": user_id}):
        job["id"] = str(job.pop("_id"))
        jobs.append(job)
    return jobs

# ============ RECRUITER PHASE - SEPARATE COLLECTION ============

async def save_recruiter_application(cv_data: dict):
    """Save CV application for recruiter phase (separate from candidate phase)."""
    db = get_db()
    result = await db.recruiter_applications.insert_one(cv_data)
    return str(result.inserted_id)

async def get_all_recruiter_applications():
    """Get all recruiter applications from database (deprecated - use get_user_recruiter_applications)."""
    db = get_db()
    applications = []
    async for app in db.recruiter_applications.find():
        app["id"] = str(app.pop("_id"))
        applications.append(app)
    return applications

async def get_user_recruiter_applications(user_id: str):
    """Get only the recruiter applications belonging to a specific user."""
    db = get_db()
    applications = []
    async for app in db.recruiter_applications.find({"user_id": user_id}):
        app["id"] = str(app.pop("_id"))
        applications.append(app)
    return applications

async def get_recruiter_application_by_id(app_id: str):
    """Get a recruiter application by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    app = await db.recruiter_applications.find_one({"_id": ObjectId(app_id)})
    if app:
        app["id"] = str(app.pop("_id"))
    return app

async def delete_recruiter_application(app_id: str) -> bool:
    """Delete a recruiter application by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    result = await db.recruiter_applications.delete_one({"_id": ObjectId(app_id)})
    return result.deleted_count > 0

async def clear_all_recruiter_applications() -> int:
    """Clear all recruiter applications. Returns count of deleted documents."""
    db = get_db()
    result = await db.recruiter_applications.delete_many({})
    return result.deleted_count

# ============ JOB MANAGEMENT - UPDATE & DELETE ============

async def get_job_by_id(job_id: str):
    """Get a job posting by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if job:
        job["id"] = str(job.pop("_id"))
    return job

async def update_job(job_id: str, job_data: dict) -> bool:
    """Update a job posting. Returns True if updated, False if not found."""
    from bson.objectid import ObjectId
    db = get_db()
    job_data.pop("id", None)
    result = await db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": job_data}
    )
    return result.modified_count > 0

async def delete_job(job_id: str) -> bool:
    """Delete a job posting. Returns True if deleted, False if not found."""
    from bson.objectid import ObjectId
    db = get_db()
    result = await db.jobs.delete_one({"_id": ObjectId(job_id)})
    return result.deleted_count > 0

# ============ STATISTICS ============

async def get_statistics():
    """Get platform statistics for dashboard."""
    from datetime import datetime
    db = get_db()
    
    total_cvs = await db.cvs.count_documents({})
    total_jobs = await db.jobs.count_documents({})
    total_applications = await db.recruiter_applications.count_documents({})
    
    avg_score = 0
    if total_cvs > 0:
        pipeline = [
            {"$group": {"_id": None, "avg_score": {"$avg": "$parsed_data.analysis.overall_score"}}}
        ]
        result = await db.cvs.aggregate(pipeline).to_list(1)
        if result:
            avg_score = round(result[0].get("avg_score", 0), 1)
    
    top_skills = []
    if total_cvs > 0:
        pipeline = [
            {"$unwind": "$parsed_data.skills"},
            {"$group": {"_id": "$parsed_data.skills", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        skills_result = await db.cvs.aggregate(pipeline).to_list(10)
        top_skills = [{"skill": s["_id"], "count": s["count"]} for s in skills_result if s["_id"]]
    
    avg_experience = 0
    if total_cvs > 0:
        pipeline = [
            {"$group": {"_id": None, "avg_exp": {"$avg": "$parsed_data.experience_years"}}}
        ]
        exp_result = await db.cvs.aggregate(pipeline).to_list(1)
        if exp_result:
            avg_experience = round(exp_result[0].get("avg_exp", 0), 1)
    
    return {
        "total_cvs": total_cvs,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "average_score": avg_score,
        "average_experience_years": avg_experience,
        "top_skills": top_skills,
        "last_updated": datetime.utcnow().isoformat()
    }

# ============ HIRING SESSIONS (Complete Workflow Results) ============

async def save_hiring_session(session_data: dict):
    """Save a complete hiring workflow session with results."""
    db = get_db()
    result = await db.hiring_sessions.insert_one(session_data)
    return str(result.inserted_id)

async def get_all_hiring_sessions():
    """Get all hiring sessions (deprecated - use get_user_hiring_sessions)."""
    db = get_db()
    sessions = []
    async for session in db.hiring_sessions.find().sort("created_at", -1):
        session["id"] = str(session.pop("_id"))
        sessions.append(session)
    return sessions

async def get_user_hiring_sessions(user_id: str):
    """Get only the hiring sessions belonging to a specific user."""
    db = get_db()
    sessions = []
    async for session in db.hiring_sessions.find({"user_id": user_id}).sort("created_at", -1):
        session["id"] = str(session.pop("_id"))
        sessions.append(session)
    return sessions

async def get_hiring_session_by_id(session_id: str):
    """Get a hiring session by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    session = await db.hiring_sessions.find_one({"_id": ObjectId(session_id)})
    if session:
        session["id"] = str(session.pop("_id"))
    return session

async def delete_hiring_session(session_id: str) -> bool:
    """Delete a hiring session."""
    from bson.objectid import ObjectId
    db = get_db()
    result = await db.hiring_sessions.delete_one({"_id": ObjectId(session_id)})
    return result.deleted_count > 0

async def clear_all_hiring_sessions() -> int:
    """Clear all hiring sessions."""
    db = get_db()
    result = await db.hiring_sessions.delete_many({})
    return result.deleted_count


# ============ USER AUTHENTICATION ============

async def save_user(user_data: dict):
    """Save a new user to database."""
    db = get_db()
    result = await db.users.insert_one(user_data)
    return str(result.inserted_id)


async def get_user_by_email(email: str):
    """Get a user by email."""
    db = get_db()
    user = await db.users.find_one({"email": email})
    if user:
        user["id"] = str(user.pop("_id"))
    return user


async def get_user_by_id(user_id: str):
    """Get a user by ID."""
    from bson.objectid import ObjectId
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["id"] = str(user.pop("_id"))
    return user


async def update_user_last_login(user_id: str):
    """Update user's last login timestamp."""
    from bson.objectid import ObjectId
    from datetime import datetime
    db = get_db()
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"last_login": datetime.utcnow()}}
    )


async def update_user(user_id: str, user_data: dict) -> bool:
    """Update user data. Returns True if updated, False if not found."""
    from bson.objectid import ObjectId
    db = get_db()
    user_data.pop("id", None)
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": user_data}
    )
    return result.modified_count > 0


async def delete_user_by_id(user_id: str) -> bool:
    """Delete user and all their associated data."""
    from bson.objectid import ObjectId
    db = get_db()
    
    # Delete user
    user_result = await db.users.delete_one({"_id": ObjectId(user_id)})
    
    # Delete user's CVs
    await db.cvs.delete_many({"user_id": user_id})
    
    # Delete user's recruiter applications
    await db.recruiter_applications.delete_many({"user_id": user_id})
    
    # Delete user's jobs
    await db.jobs.delete_many({"user_id": user_id})
    
    # Delete user's hiring sessions
    await db.hiring_sessions.delete_many({"user_id": user_id})
    
    return user_result.deleted_count > 0


async def update_hiring_session_notes(session_id: str, notes_data: dict) -> bool:
    """Update notes on a hiring session or specific candidate."""
    from bson.objectid import ObjectId
    db = get_db()
    
    if "candidate_id" in notes_data and "note" in notes_data:
        # Note on a specific candidate
        result = await db.hiring_sessions.update_one(
            {"_id": ObjectId(session_id), "approved_candidates.cv_id": notes_data["candidate_id"]},
            {"$set": {"approved_candidates.$.note": notes_data["note"]}}
        )
        if result.modified_count == 0:
            result = await db.hiring_sessions.update_one(
                {"_id": ObjectId(session_id), "rejected_candidates.cv_id": notes_data["candidate_id"]},
                {"$set": {"rejected_candidates.$.note": notes_data["note"]}}
            )
        return result.modified_count > 0
    elif "session_note" in notes_data:
        # Note on the entire session
        result = await db.hiring_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {"session_note": notes_data["session_note"]}}
        )
        return result.modified_count > 0
    
    return False

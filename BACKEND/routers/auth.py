from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
import bcrypt
import secrets
from datetime import datetime, timedelta, timezone
from config.database import save_user, get_user_by_email, update_user_last_login, get_user_by_id, update_user, delete_user_by_id, get_db
from models.user import UserCreate, UserLogin, TokenRefresh
from utils.jwt import create_access_token, create_refresh_token
from middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


@router.post("/register")
async def register(user_data: UserCreate):
    """Register a new user account."""
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        role_label = "Candidate" if existing_user.get("role") == "user" else "Recruiter"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This email is already registered as a {role_label}. Please use a different email or sign in with your existing account."
        )

    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hash_password(user_data.password),
        "role": user_data.role,
        "is_active": True,
        "created_at": datetime.utcnow()
    }

    try:
        user_id = await save_user(user_dict)
    except Exception as e:
        print(f"❌ Failed to save user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

    access_token = create_access_token(data={"sub": user_id, "email": user_data.email})
    refresh_token = create_refresh_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "created_at": user_dict["created_at"].isoformat()
        }
    }


@router.post("/login")
async def login(credentials: UserLogin):
    """Authenticate user and return JWT tokens."""
    user = await get_user_by_email(credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    await update_user_last_login(user["id"])

    access_token = create_access_token(data={"sub": user["id"], "email": user["email"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user.get("role", "user"),
            "created_at": user.get("created_at"),
            "last_login": user.get("last_login")
        }
    }


@router.post("/refresh")
async def refresh_token(token_data: TokenRefresh):
    """Refresh an access token using a valid refresh token."""
    try:
        from utils.jwt import decode_token
        payload = decode_token(token_data.refresh_token, token_type="refresh")
        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        new_access_token = create_access_token(data={"sub": user_id, "email": email})
        new_refresh_token = create_refresh_token(data={"sub": user_id})

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user.get("role", "user"),
                "created_at": user.get("created_at"),
                "last_login": user.get("last_login")
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid refresh token: {str(e)}"
        )


@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information."""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user.get("role", "user"),
        "created_at": current_user.get("created_at"),
        "last_login": current_user.get("last_login")
    }


@router.put("/me")
async def update_profile(
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile (name, password)."""
    update_fields = {}

    if "full_name" in update_data:
        if len(update_data["full_name"].strip()) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
        update_fields["full_name"] = update_data["full_name"].strip()

    if "password" in update_data:
        if len(update_data["password"]) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        update_fields["hashed_password"] = hash_password(update_data["password"])

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    try:
        await update_user(current_user["id"], update_fields)
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.delete("/me")
async def delete_account(
    confirm_password: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete current user's account permanently."""
    if not verify_password(confirm_password, current_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    try:
        await delete_user_by_id(current_user["id"])
        return {"success": True, "message": "Account deleted permanently"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")


@router.post("/forgot-password")
async def forgot_password(data: dict):
    """
    Generate a password reset token for the given email.
    
    In production, this would send an email with the reset link.
    For now, it returns the token directly (for development).
    """
    email = data.get("email", "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = await get_user_by_email(email)
    
    # Always return success even if email doesn't exist (security: don't reveal if email exists)
    if not user:
        return {"success": True, "message": "If an account exists with this email, a reset link has been sent."}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    # Save reset token to database
    db = get_db()
    await db.password_resets.insert_one({
        "user_id": user["id"],
        "email": email,
        "token": reset_token,
        "expires_at": expires_at,
        "used": False,
        "created_at": datetime.utcnow()
    })

    # In production: send email with reset link
    # For development: return token directly
    return {
        "success": True,
        "message": "If an account exists with this email, a reset link has been sent.",
        "reset_token": reset_token,  # Remove this in production
        "reset_link": f"http://localhost:3000/reset-password?token={reset_token}"  # Remove in production
    }


@router.post("/reset-password")
async def reset_password(data: dict):
    """
    Reset password using a valid reset token.
    """
    token = data.get("token", "").strip()
    new_password = data.get("password", "").strip()

    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and password are required")

    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Find valid reset token
    db = get_db()
    reset_record = await db.password_resets.find_one({
        "token": token,
        "used": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })

    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Update user password
    user = await get_user_by_id(reset_record["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await update_user(user["id"], {"hashed_password": hash_password(new_password)})

    # Mark token as used
    await db.password_resets.update_one(
        {"_id": reset_record["_id"]},
        {"$set": {"used": True}}
    )

    return {"success": True, "message": "Password reset successfully. You can now sign in."}

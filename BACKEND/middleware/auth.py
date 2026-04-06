from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config.database import get_user_by_id
from utils.jwt import decode_token

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency to get the current authenticated user from JWT token.
    
    Usage:
        @router.get("/protected")
        async def protected_route(current_user = Depends(get_current_user)):
            ...
    
    Raises:
        HTTPException: If token is invalid, expired, or user not found
    """
    token = credentials.credentials
    
    payload = decode_token(token, token_type="access")
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    return user


async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency to ensure the current user is active.
    
    Usage:
        @router.get("/active-only")
        async def active_route(current_user = Depends(get_current_active_user)):
            ...
    """
    return current_user


def require_role(*allowed_roles: str):
    """
    Dependency factory to require specific user roles.
    
    Usage:
        @router.delete("/admin-only")
        async def admin_route(current_user = Depends(require_role("admin"))):
            ...
    
    Args:
        *allowed_roles: List of roles that are allowed to access the route
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "user")
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' is not authorized. Required: {', '.join(allowed_roles)}"
            )
        
        return current_user
    
    return role_checker

from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import InvalidTokenError

from app.core.config import settings

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify JWT token and return the decoded payload if valid
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token_payload: dict = Depends(verify_token)):
    """
    Extract user information from token payload
    """
    user_id = token_payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    return {
        "user_id": user_id,
        "email": token_payload.get("email"),
        "roles": token_payload.get("roles", [])
    }

def has_role(required_roles: list):
    """
    Check if the current user has any of the required roles
    """
    async def role_checker(user: dict = Depends(get_current_user)):
        user_roles = user.get("roles", [])
        
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return user
        
    return role_checker
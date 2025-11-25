from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
from pathlib import Path

from src.core.config import settings

security = HTTPBearer()


def load_public_key() -> str:
    public_key_path = Path(settings.JWT_PUBLIC_KEY_PATH)

    if not public_key_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Public key file not found at {public_key_path}"
        )

    with open(public_key_path, "r") as key_file:
        return key_file.read()


def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials

    try:
        public_key = load_public_key()
        payload = jwt.decode(
            token,
            public_key,
            algorithms=[settings.JWT_ALGORITHM],
            options={
                "verify_signature": True,
                "verify_exp": True,
            }
        )
        return payload

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(token_payload: dict = Depends(verify_jwt_token)) -> dict:
    user_id = token_payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not extract user from token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "user_id": user_id,
        "email": token_payload.get("email"),
        "roles": token_payload.get("roles", []),
        **token_payload
    }


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[dict]:
    if credentials is None:
        return None

    try:
        payload = verify_jwt_token(credentials)
        return get_current_user(payload)
    except HTTPException:
        return None

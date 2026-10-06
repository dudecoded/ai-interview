from fastapi import APIRouter, Depends, HTTPException
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..services.auth_service import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

password_hash = PasswordHash.recommended()


@router.post("/register")
def register(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=name,
        email=email,
        password_hash=password_hash.hash(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }


@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not password_hash.verify(
        password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(user.id)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }
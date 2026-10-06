from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user")
    interviews = relationship("Interview", back_populates="user")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filename = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    education = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    interviews = relationship("Interview", back_populates="resume")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)

    status = Column(String, default="started")
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration = Column(Integer, nullable=True)

    user = relationship("User", back_populates="interviews")
    resume = relationship("Resume", back_populates="interviews")
    answers = relationship("Answer", back_populates="interview")
    result = relationship("Result", back_populates="interview", uselist=False)


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)

    question = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)

    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)

    interview = relationship("Interview", back_populates="answers")


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)

    overall_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    problem_solving_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)

    strengths = Column(Text, nullable=True)
    improvements = Column(Text, nullable=True)
    suggestions = Column(Text, nullable=True)

    interview = relationship("Interview", back_populates="result")
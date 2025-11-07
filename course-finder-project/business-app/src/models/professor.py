"""
Professor Model
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base


class Professor(Base):
    """
    Professor domain model representing instructors in the system.
    """
    __tablename__ = "professors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    specialty = Column(String(255), nullable=True)

    # Relationship to courses through ProfessorCourse association table
    professor_courses = relationship(
        "ProfessorCourse",
        back_populates="professor",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Professor(id={self.id}, name='{self.name}', email='{self.email}')>"

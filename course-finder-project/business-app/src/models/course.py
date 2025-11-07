"""
Course Model
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.core.database import Base


class Course(Base):
    """
    Course domain model representing courses available in the system.
    """
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=True)

    # Relationship to professors through ProfessorCourse association table
    course_professors = relationship(
        "ProfessorCourse",
        back_populates="course",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Course(id={self.id}, code='{self.code}', name='{self.name}')>"

"""
ProfessorCourse Association Model
"""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.core.database import Base


class ProfessorCourse(Base):
    """
    ProfessorCourse association model representing the many-to-many relationship
    between professors and courses with additional metadata.
    """
    __tablename__ = "professor_courses"

    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(
        Integer,
        ForeignKey("professors.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    course_id = Column(
        Integer,
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(String(50), default="active", nullable=False)  # active, inactive, pending

    # Relationships
    professor = relationship("Professor", back_populates="professor_courses")
    course = relationship("Course", back_populates="course_professors")

    def __repr__(self):
        return f"<ProfessorCourse(professor_id={self.professor_id}, course_id={self.course_id}, status='{self.status}')>"

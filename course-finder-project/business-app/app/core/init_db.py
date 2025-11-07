"""
Database initialization utility
"""
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

from app.core.database import engine, Base
from app.models import Professor, Course, ProfessorCourse


def init_db():
    """
    Create all database tables based on the defined models.

    This function should be called once to initialize the database schema.
    For production, consider using Alembic migrations instead.
    """
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def drop_all_tables():
    """
    Drop all database tables.

    WARNING: This will delete all data in the database!
    Use with caution, preferably only in development.
    """
    print("WARNING: Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped!")


if __name__ == "__main__":
    # Initialize database when running this script directly
    init_db()

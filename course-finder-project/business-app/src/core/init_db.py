"""
Database initialization utility
"""
from dotenv import load_dotenv
import os
from pathlib import Path
from sqlalchemy import inspect

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

from src.core.database import engine, Base
from src.models import Professor, Course, ProfessorCourse


def create_db_and_tables():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


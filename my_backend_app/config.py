import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'postgresql://user:password@localhost:5432/my_app_db_fallback')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key_if_not_set')
    CORS_HEADERS = 'Content-Type'

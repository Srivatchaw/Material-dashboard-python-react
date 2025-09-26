# my_backend_app/__init__.py
from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import db # Import db from models.py

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    # Register blueprints
    from .routes import auth_bp, items_bp, notifications_bp # <--- Ensure notifications_bp is imported
    app.register_blueprint(auth_bp)
    app.register_blueprint(items_bp)
    app.register_blueprint(notifications_bp) # <--- ENSURE THIS LINE IS PRESENT AND UNCOMMENTED

    with app.app_context():
        db.create_all()

    return app
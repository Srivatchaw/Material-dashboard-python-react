from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import db  # Import db from models.py


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Enable CORS for the entire app

    # Register blueprints (routes)
    from .routes import auth_bp, items_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(items_bp) # Register the new blueprint

    # Context processor to create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

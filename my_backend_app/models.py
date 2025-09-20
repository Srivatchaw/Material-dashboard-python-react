# my_backend_app/models.py
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256
from datetime import datetime, date # Import date as well

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    login_history = db.relationship('LoginHistory', backref='user', lazy=True)
    items = db.relationship('Item', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)

    def check_password(self, password):
        return pbkdf2_sha256.verify(password, self.password_hash)

class LoginHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    login_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    login_ip = db.Column(db.String(45), nullable=True)

    def __repr__(self):
        return f'<LoginHistory User:{self.user_id} Time:{self.login_time}>'

# --- UPDATED ITEM MODEL ---
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Core Project/Item details
    project_name = db.Column(db.String(100), nullable=False) # Renamed from 'name'
    form_name = db.Column(db.String(100), nullable=False) # New field
    description = db.Column(db.Text, nullable=True)
    
    # Date fields
    start_date = db.Column(db.Date, nullable=False, default=date.today()) # New field, store only date. Use date.today()
    expected_completion_date = db.Column(db.Date, nullable=False) # New field
    actual_completion_date = db.Column(db.Date, nullable=True) # New field (can be null)
    
    # Status and Reason
    status = db.Column(db.String(50), nullable=False, default='Pending') # Made nullable=False
    reason_for_delay = db.Column(db.Text, nullable=True) # New field

    # Automatically set on creation
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow) 

    def __repr__(self):
        return f'<Item {self.project_name}>'
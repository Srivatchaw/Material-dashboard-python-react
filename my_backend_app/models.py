from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256
from datetime import datetime, date

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

# --- UPDATED ITEM MODEL (Date and Status made nullable=True) ---
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Core Project/Item details
    project_name = db.Column(db.String(100), nullable=False)
    form_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Date fields - Made nullable=True
    start_date = db.Column(db.Date, nullable=True) # <--- Changed to nullable=True
    expected_completion_date = db.Column(db.Date, nullable=True) # <--- Changed to nullable=True
    actual_completion_date = db.Column(db.Date, nullable=True)
    
    # Status and Reason - Status made nullable=True
    status = db.Column(db.String(50), nullable=True, default='Pending') # <--- Changed to nullable=True
    reason_for_delay = db.Column(db.Text, nullable=True)

    # NEW FIELDS (from previous steps)
    customer = db.Column(db.String(100), nullable=False)
    public_ip = db.Column(db.String(45), nullable=True)
    private_ip = db.Column(db.String(45), nullable=True)
    os_type = db.Column(db.String(50), nullable=True)
    root_username = db.Column(db.String(50), nullable=True)
    root_password = db.Column(db.String(100), nullable=True)
    server_username = db.Column(db.String(50), nullable=True)
    server_password = db.Column(db.String(100), nullable=True)
    server_name = db.Column(db.String(100), nullable=False)
    core = db.Column(db.Integer, nullable=True)
    ram = db.Column(db.String(50), nullable=True)
    hdd = db.Column(db.String(50), nullable=True)
    ports = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    applications = db.Column(db.Text, nullable=True)
    db_name = db.Column(db.String(100), nullable=True)
    db_password = db.Column(db.String(100), nullable=True)
    db_port = db.Column(db.Integer, nullable=True)
    dump_location = db.Column(db.String(255), nullable=True)
    crontab_config = db.Column(db.Text, nullable=True)
    backup_location = db.Column(db.String(255), nullable=True)
    url = db.Column(db.String(255), nullable=True)
    login_name = db.Column(db.String(50), nullable=True)
    login_password = db.Column(db.String(100), nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Item {self.project_name}>'
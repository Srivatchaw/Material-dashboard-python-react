# my_backend_app/models.py
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

# --- CORRECTED ITEM MODEL (BASED ON YOUR LATEST REQUEST TO REMOVE FIELDS AND SET MANDATORY) ---
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # All fields you listed are now MANDATORY (nullable=False) as requested
    customer = db.Column(db.String(100), nullable=False)
    public_ip = db.Column(db.String(45), nullable=False)
    private_ip = db.Column(db.String(45), nullable=False)
    os_type = db.Column(db.String(50), nullable=False)
    root_username = db.Column(db.String(50), nullable=False)
    root_password = db.Column(db.String(100), nullable=False)
    server_username = db.Column(db.String(50), nullable=False)
    server_password = db.Column(db.String(100), nullable=False)
    server_name = db.Column(db.String(100), nullable=False)
    core = db.Column(db.Integer, nullable=False)
    ram = db.Column(db.String(50), nullable=False)
    hdd = db.Column(db.String(50), nullable=False)
    ports = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    applications = db.Column(db.Text, nullable=False)
    db_name = db.Column(db.String(100), nullable=False)
    db_password = db.Column(db.String(100), nullable=False)
    db_port = db.Column(db.Integer, nullable=False)
    dump_location = db.Column(db.String(255), nullable=False)
    crontab_config = db.Column(db.Text, nullable=False)
    backup_location = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    login_name = db.Column(db.String(50), nullable=False)
    login_password = db.Column(db.String(100), nullable=False)

    # These fields are REMOVED entirely from the model as per your request
    # project_name
    # form_name
    # description
    # start_date
    # expected_completion_date
    # actual_completion_date
    # status
    # reason_for_delay

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow) 

    def __repr__(self):
        return f'<Item {self.customer} - {self.server_name}>'
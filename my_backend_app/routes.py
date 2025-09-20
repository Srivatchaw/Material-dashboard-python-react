from flask import Blueprint, request, jsonify, g
from .models import db, User, LoginHistory, Item
from flask_cors import cross_origin
from datetime import datetime, date # Import date as well
import functools

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
items_bp = Blueprint('items', __name__, url_prefix='/api/items')

# --- Authentication Decorator (Simple for now) ---
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'message': 'Authentication required. X-User-ID header missing.'}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Invalid user ID.'}), 401
        
        g.user = user
        return view(**kwargs)
    return wrapped_view

# --- Auth Endpoints (signup and signin from previous steps) ---
@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required!'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred during registration', 'error': str(e)}), 500

@auth_bp.route('/signin', methods=['POST'])
@cross_origin()
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        print("DEBUG: SIGNIN - Username or password missing from request.")
        return jsonify({'message': 'Username and password are required!'}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        print(f"DEBUG: SIGNIN - User '{username}' authenticated successfully.")
        
        try:
            login_ip = request.remote_addr
            new_login_entry = LoginHistory(
                user_id=user.id,
                login_time=datetime.utcnow(),
                login_ip=login_ip
            )

            print(f"DEBUG: SIGNIN - Attempting to add LoginHistory entry: User ID={user.id}, IP={login_ip}, Time={new_login_entry.login_time}")

            db.session.add(new_login_entry)
            db.session.commit()
            print("DEBUG: SIGNIN - LoginHistory entry committed successfully.")

        except Exception as e:
            db.session.rollback()
            print(f"ERROR: SIGNIN - Failed to record login history for user '{username}': {e}")
            pass

        return jsonify({'message': 'Login successful!', 'user_id': user.id, 'username': user.username}), 200
    else:
        print(f"DEBUG: SIGNIN - Invalid credentials for user '{username}'.")
        return jsonify({'message': 'Invalid username or password'}), 401
    
# --- ITEM ENDPOINTS ---
@items_bp.route('/create', methods=['POST'])
@cross_origin()
@login_required
def create_item():
    print("DEBUG: CREATE_ITEM - Endpoint accessed.")
    data = request.get_json()
    
    # Retrieve all new fields
    project_name = data.get('project_name')
    form_name = data.get('form_name')
    description = data.get('description')
    start_date_str = data.get('start_date')
    expected_completion_date_str = data.get('expected_completion_date')
    actual_completion_date_str = data.get('actual_completion_date')
    status = data.get('status', 'Pending')
    reason_for_delay = data.get('reason_for_delay')

    # Basic validation for required fields
    if not project_name or not form_name or not start_date_str or not expected_completion_date_str:
        return jsonify({'message': 'Project Name, Form Name, Start Date, and Expected Completion Date are required!'}), 400

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        expected_completion_date = datetime.strptime(expected_completion_date_str, '%Y-%m-%d').date()
        actual_completion_date = datetime.strptime(actual_completion_date_str, '%Y-%m-%d').date() if actual_completion_date_str else None
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_item = Item(
        user_id=g.user.id,
        project_name=project_name,
        form_name=form_name,
        description=description,
        start_date=start_date,
        expected_completion_date=expected_completion_date,
        actual_completion_date=actual_completion_date,
        status=status,
        reason_for_delay=reason_for_delay
    )

    try:
        db.session.add(new_item)
        db.session.commit()
        print(f"DEBUG: CREATE_ITEM - Item '{new_item.project_name}' created successfully with ID: {new_item.id}")
        return jsonify({'message': 'Item created successfully!', 'item': {
            'id': new_item.id,
            'project_name': new_item.project_name,
            'form_name': new_item.form_name,
            'description': new_item.description,
            'start_date': new_item.start_date.isoformat(),
            'expected_completion_date': new_item.expected_completion_date.isoformat(),
            'actual_completion_date': new_item.actual_completion_date.isoformat() if new_item.actual_completion_date else None,
            'status': new_item.status,
            'reason_for_delay': new_item.reason_for_delay,
            'created_at': new_item.created_at.isoformat()
        }}), 201
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: CREATE_ITEM - Failed to create item for user {g.user.username}: {e}")
        return jsonify({'message': 'An error occurred during item creation', 'error': str(e)}), 500

@items_bp.route('/get_all', methods=['GET'])
@cross_origin()
@login_required
def get_all_items():
    print(f"DEBUG: GET_ALL_ITEMS - Endpoint accessed for user {g.user.username}.")
    items = Item.query.filter_by(user_id=g.user.id).order_by(Item.created_at.desc()).all()
    
    items_data = []
    for item in items:
        items_data.append({
            'id': item.id,
            'project_name': item.project_name,
            'form_name': item.form_name,
            'description': item.description,
            'start_date': item.start_date.isoformat(),
            'expected_completion_date': item.expected_completion_date.isoformat(),
            'actual_completion_date': item.actual_completion_date.isoformat() if item.actual_completion_date else None,
            'status': item.status,
            'reason_for_delay': item.reason_for_delay,
            'created_at': item.created_at.isoformat()
        })
    print(f"DEBUG: GET_ALL_ITEMS - Returning {len(items_data)} items for user {g.user.username}.")
    return jsonify(items_data), 200

# --- Get single item by ID (for editing) ---
@items_bp.route('/get/<int:item_id>', methods=['GET'])
@cross_origin()
@login_required
def get_single_item(item_id):
    print(f"DEBUG: GET_SINGLE_ITEM - Endpoint accessed for item_id={item_id}, user={g.user.username}.")
    item = Item.query.filter_by(id=item_id, user_id=g.user.id).first()
    if not item:
        return jsonify({'message': 'Item not found or unauthorized.'}), 404
    
    return jsonify({
        'id': item.id,
        'project_name': item.project_name,
        'form_name': item.form_name,
        'description': item.description,
        'start_date': item.start_date.isoformat(),
        'expected_completion_date': item.expected_completion_date.isoformat(),
        'actual_completion_date': item.actual_completion_date.isoformat() if item.actual_completion_date else None,
        'status': item.status,
        'reason_for_delay': item.reason_for_delay,
        'created_at': item.created_at.isoformat()
    }), 200

# --- Update an item ---
@items_bp.route('/update/<int:item_id>', methods=['PUT'])
@cross_origin()
@login_required
def update_item(item_id):
    print(f"DEBUG: UPDATE_ITEM - Endpoint accessed for item_id={item_id}, user={g.user.username}.")
    item = Item.query.filter_by(id=item_id, user_id=g.user.id).first()
    if not item:
        return jsonify({'message': 'Item not found or unauthorized.'}), 404

    data = request.get_json()
    
    # Update all new fields, handling potential missing values
    item.project_name = data.get('project_name', item.project_name)
    item.form_name = data.get('form_name', item.form_name)
    item.description = data.get('description', item.description)
    
    start_date_str = data.get('start_date')
    if start_date_str:
        try:
            item.start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid start date format. Use YYYY-MM-DD.'}), 400

    expected_completion_date_str = data.get('expected_completion_date')
    if expected_completion_date_str:
        try:
            item.expected_completion_date = datetime.strptime(expected_completion_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid expected completion date format. Use YYYY-MM-DD.'}), 400

    actual_completion_date_str = data.get('actual_completion_date')
    if actual_completion_date_str:
        try:
            item.actual_completion_date = datetime.strptime(actual_completion_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid actual completion date format. Use YYYY-MM-DD.'}), 400
    else:
        item.actual_completion_date = None # Allow clearing the actual completion date

    item.status = data.get('status', item.status)
    item.reason_for_delay = data.get('reason_for_delay', item.reason_for_delay)

    # Basic validation for required fields on update
    if not item.project_name or not item.form_name or not item.start_date or not item.expected_completion_date:
        return jsonify({'message': 'Project Name, Form Name, Start Date, and Expected Completion Date are required!'}), 400


    try:
        db.session.commit()
        print(f"DEBUG: UPDATE_ITEM - Item '{item.project_name}' with ID: {item.id} updated successfully.")
        return jsonify({'message': 'Item updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: UPDATE_ITEM - Failed to update item {item_id} for user {g.user.username}: {e}")
        return jsonify({'message': 'An error occurred during item update', 'error': str(e)}), 500

# --- Delete an item ---
@items_bp.route('/delete/<int:item_id>', methods=['DELETE'])
@cross_origin()
@login_required
def delete_item(item_id):
    print(f"DEBUG: DELETE_ITEM - Endpoint accessed for item_id={item_id}, user={g.user.username}.")
    item = Item.query.filter_by(id=item_id, user_id=g.user.id).first()
    if not item:
        return jsonify({'message': 'Item not found or unauthorized.'}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        print(f"DEBUG: DELETE_ITEM - Item '{item.project_name}' with ID: {item.id} deleted successfully.")
        return jsonify({'message': 'Item deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: DELETE_ITEM - Failed to delete item {item_id} for user {g.user.username}: {e}")
        return jsonify({'message': 'An error occurred during item deletion', 'error': str(e)}), 500
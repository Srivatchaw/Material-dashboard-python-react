from flask import Blueprint, request, jsonify, g
from .models import db, User, LoginHistory, Item
from flask_cors import cross_origin
from datetime import datetime, date
import functools

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
items_bp = Blueprint('items', __name__, url_prefix='/api/items')

# --- Authentication Decorator ---
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
    
    # Only retrieve fields that exist in the model
    customer = data.get('customer')
    public_ip = data.get('public_ip')
    private_ip = data.get('private_ip')
    os_type = data.get('os_type')
    root_username = data.get('root_username')
    root_password = data.get('root_password')
    server_username = data.get('server_username')
    server_password = data.get('server_password')
    server_name = data.get('server_name')
    core = data.get('core')
    ram = data.get('ram')
    hdd = data.get('hdd')
    ports = data.get('ports')
    location = data.get('location')
    applications = data.get('applications')
    db_name = data.get('db_name')
    db_password = data.get('db_password')
    db_port = data.get('db_port')
    dump_location = data.get('dump_location')
    crontab_config = data.get('crontab_config')
    backup_location = data.get('backup_location')
    url = data.get('url')
    login_name = data.get('login_name')
    login_password = data.get('login_password')

    # Updated Backend validation for ALL mandatory fields (matching models.py)
    # This list must EXACTLY match the non-nullable columns in your models.py
    if not all([
        customer, server_name, public_ip, private_ip, os_type, root_username, root_password,
        server_username, server_password, core, ram, hdd, ports, location, applications, db_name,
        db_password, db_port, dump_location, crontab_config, backup_location, url, login_name, login_password
    ]):
        return jsonify({'message': 'All mandatory fields must be filled.'}), 400

    try:
        # Core and DB Port must be numbers, convert them
        core_int = int(core)
        db_port_int = int(db_port)
    except ValueError as ve:
        print(f"ERROR: CREATE_ITEM - Integer parsing error: {ve}")
        return jsonify({'message': 'Core and DB Port must be numbers.'}), 400

    new_item = Item(
        user_id=g.user.id,
        customer=customer,
        public_ip=public_ip,
        private_ip=private_ip,
        os_type=os_type,
        root_username=root_username,
        root_password=root_password,
        server_username=server_username,
        server_password=server_password,
        server_name=server_name,
        core=core_int,
        ram=ram,
        hdd=hdd,
        ports=ports,
        location=location,
        applications=applications,
        db_name=db_name,
        db_password=db_password,
        db_port=db_port_int,
        dump_location=dump_location,
        crontab_config=crontab_config,
        backup_location=backup_location,
        url=url,
        login_name=login_name,
        login_password=login_password
    )

    try:
        db.session.add(new_item)
        db.session.commit()
        print(f"DEBUG: CREATE_ITEM - Item '{new_item.customer}' created successfully with ID: {new_item.id}")
        item_data = {
            'id': new_item.id,
            'customer': new_item.customer,
            'public_ip': new_item.public_ip, 'private_ip': new_item.private_ip, 'os_type': new_item.os_type,
            'root_username': new_item.root_username, 'root_password': new_item.root_password,
            'server_username': new_item.server_username, 'server_password': new_item.server_password,
            'server_name': new_item.server_name, 'core': new_item.core, 'ram': new_item.ram,
            'hdd': new_item.hdd, 'ports': new_item.ports, 'location': new_item.location,
            'applications': new_item.applications, 'db_name': new_item.db_name, 'db_password': new_item.db_password,
            'db_port': new_item.db_port, 'dump_location': new_item.dump_location,
            'crontab_config': new_item.crontab_config, 'backup_location': new_item.backup_location,
            'url': new_item.url, 'login_name': new_item.login_name, 'login_password': new_item.login_password,
            'created_at': new_item.created_at.isoformat(),
        }
        return jsonify({'message': 'Item created successfully!', 'item': item_data}), 201
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
        item_data = {
            'id': item.id, 
            'customer': item.customer,
            'public_ip': item.public_ip, 'private_ip': item.private_ip, 'os_type': item.os_type,
            'root_username': item.root_username, 'root_password': item.root_password,
            'server_username': item.server_username, 'server_password': item.server_password,
            'server_name': item.server_name, 'core': item.core, 'ram': item.ram,
            'hdd': item.hdd, 'ports': item.ports, 'location': item.location,
            'applications': item.applications, 'db_name': item.db_name, 'db_password': item.db_password,
            'db_port': item.db_port, 'dump_location': item.dump_location,
            'crontab_config': item.crontab_config, 'backup_location': item.backup_location,
            'url': item.url, 'login_name': item.login_name, 'login_password': item.login_password,
            'created_at': item.created_at.isoformat(),
        }
        items_data.append(item_data)
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
    
    item_data = {
        'id': item.id, 
        'customer': item.customer,
        'public_ip': item.public_ip, 'private_ip': item.private_ip, 'os_type': item.os_type,
        'root_username': item.root_username, 'root_password': item.root_password,
        'server_username': item.server_username, 'server_password': item.server_password,
        'server_name': item.server_name, 'core': item.core, 'ram': item.ram,
        'hdd': item.hdd, 'ports': item.ports, 'location': item.location,
        'applications': item.applications, 'db_name': item.db_name, 'db_password': item.db_password,
        'db_port': item.db_port, 'dump_location': item.dump_location,
        'crontab_config': item.crontab_config, 'backup_location': item.backup_location,
        'url': item.url, 'login_name': item.login_name, 'login_password': item.login_password,
        'created_at': item.created_at.isoformat(),
    }
    return jsonify(item_data), 200

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
    
    # Update all fields based on payload, using existing value as fallback
    item.customer = data.get('customer', item.customer)
    item.public_ip = data.get('public_ip', item.public_ip)
    item.private_ip = data.get('private_ip', item.private_ip)
    item.os_type = data.get('os_type', item.os_type)
    item.root_username = data.get('root_username', item.root_username)
    item.root_password = data.get('root_password', item.root_password)
    item.server_username = data.get('server_username', item.server_username)
    item.server_password = data.get('server_password', item.server_password)
    item.server_name = data.get('server_name', item.server_name)
    item.core = int(data.get('core')) if data.get('core') is not None else item.core
    item.ram = data.get('ram', item.ram)
    item.hdd = data.get('hdd', item.hdd)
    item.ports = data.get('ports', item.ports)
    item.location = data.get('location', item.location)
    item.applications = data.get('applications', item.applications)
    item.db_name = data.get('db_name', item.db_name)
    item.db_password = data.get('db_password', item.db_password)
    item.db_port = int(data.get('db_port')) if data.get('db_port') is not None else item.db_port
    item.dump_location = data.get('dump_location', item.dump_location)
    item.crontab_config = data.get('crontab_config', item.crontab_config)
    item.backup_location = data.get('backup_location', item.backup_location)
    item.url = data.get('url', item.url)
    item.login_name = data.get('login_name', item.login_name)
    item.login_password = data.get('login_password', item.login_password)


    # Basic validation for ALL mandatory fields on update (matching models.py)
    required_fields_on_update = [
        item.customer, item.server_name, 
        item.public_ip, item.private_ip, item.os_type, item.root_username, item.root_password,
        item.server_username, item.server_password,
        item.core, item.ram, item.hdd, item.ports, item.location, item.applications, item.db_name, item.db_password, item.db_port,
        item.dump_location, item.crontab_config, item.backup_location, item.url, item.login_name, item.login_password
    ]
    if not all(required_fields_on_update):
        return jsonify({'message': 'All mandatory fields must be filled.'}), 400

    try:
        db.session.commit()
        print(f"DEBUG: UPDATE_ITEM - Item '{item.customer}' with ID: {item.id} updated successfully.")
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
        print(f"DEBUG: DELETE_ITEM - Item '{item.customer}' with ID: {item.id} deleted successfully.")
        return jsonify({'message': 'Item deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: DELETE_ITEM - Failed to delete item {item_id} for user {g.user.username}: {e}")
        return jsonify({'message': 'An error occurred during item deletion', 'error': str(e)}), 500
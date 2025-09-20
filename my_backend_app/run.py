import os
import sys

# Add the parent directory of 'my_backend_app' to the Python path
# This allows 'my_backend_app' to be treated as a package when run directly.
# This approach is generally used for direct execution of scripts within a package,
# but 'flask run' is the recommended way for Flask apps.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Now, import create_app from the my_backend_app package
from my_backend_app import create_app

app = create_app()

if __name__ == '__main__':
    # When running with 'python run.py', debug should be True for development
    # In production, set debug=False and use a production WSGI server like Gunicorn
    app.run(debug=True, port=5000)
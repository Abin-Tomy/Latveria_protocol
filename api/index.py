import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lockstep_api.settings')

# Import Django WSGI application
from lockstep_api.wsgi import application

# Vercel expects 'app' or 'handler'
app = application

import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lockstep_api.settings')
django.setup()

from game.models import Team

def create_admin():
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin1234')
    
    print(f"Attempting to create superuser: {username}")
    
    try:
        if not Team.objects.filter(team_id=username).exists():
            Team.objects.create_superuser(username, password)
            print(f'SUCCESS: Superuser "{username}" created.')
        else:
            print(f'INFO: Superuser "{username}" already exists.')
            
            # Optional: Update password checking/resetting could go here if needed
            # user = Team.objects.get(team_id=username)
            # user.set_password(password)
            # user.save()
            # print(f'INFO: Password reset for "{username}".')

    except Exception as e:
        print(f'ERROR: Failed to create superuser: {e}')

if __name__ == "__main__":
    create_admin()

import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lockstep_api.settings')

import django
django.setup()

from game.models import Level

# Update or create Level 1 with answer "1215"
level, created = Level.objects.update_or_create(
    level_number=1, 
    defaults={
        'title': 'Clock Puzzle', 
        'description': 'Set the time to 12:15', 
        'answer': '1215', 
        'hint': 'Look at the clock hands'
    }
)

if created:
    print(f'Level 1 created with answer: {level.answer}')
else:
    print(f'Level 1 updated with answer: {level.answer}')

# Verify
print(f'\nVerification - Level 1 in database:')
print(f'  Title: {level.title}')
print(f'  Answer: {level.answer}')
print(f'  Description: {level.description}')

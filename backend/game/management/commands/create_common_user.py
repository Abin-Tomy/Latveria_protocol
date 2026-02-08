from django.core.management.base import BaseCommand
from game.models import Team

class Command(BaseCommand):
    help = 'Creates a common user for multi-device access'

    def handle(self, *args, **kwargs):
        team_id = 'common'
        password = 'common'
        
        if Team.objects.filter(team_id=team_id).exists():
            self.stdout.write(self.style.WARNING(f'Team "{team_id}" already exists'))
            
            # Optional: Reset password to ensure it matches
            user = Team.objects.get(team_id=team_id)
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Password for "{team_id}" reset to "{password}"'))
        else:
            Team.objects.create_user(team_id=team_id, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created team "{team_id}"'))

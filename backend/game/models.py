from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class TeamManager(BaseUserManager):
    """Custom manager for Team model"""
    
    def create_user(self, team_id, password=None, **extra_fields):
        """Create and return a regular team user"""
        if not team_id:
            raise ValueError('Team ID must be set')
        
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        
        team = self.model(team_id=team_id, **extra_fields)
        team.set_password(password)
        team.save(using=self._db)
        return team
    
    def create_superuser(self, team_id, password=None, **extra_fields):
        """Create and return a superuser team"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(team_id, password, **extra_fields)


class Team(AbstractUser):
    """Custom user model representing a team"""
    username = None  # Remove username field
    team_id = models.CharField(max_length=20, unique=True)
    current_level = models.IntegerField(default=1)
    is_active_session = models.BooleanField(default=False)
    session_token = models.CharField(max_length=255, blank=True, null=True)
    total_time_seconds = models.IntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    objects = TeamManager()  # Use custom manager
    
    USERNAME_FIELD = 'team_id'
    REQUIRED_FIELDS = []
    
    class Meta:
        ordering = ['-current_level', 'total_time_seconds']
    
    def __str__(self):
        return self.team_id


class Level(models.Model):
    """Puzzle levels"""
    level_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    puzzle_content = models.TextField(help_text="Riddle, cipher, or puzzle text")
    image = models.ImageField(upload_to='puzzles/', blank=True, null=True)
    answer = models.CharField(max_length=200, help_text="Correct answer (case-insensitive)")
    hint = models.TextField(blank=True, help_text="Optional hint")
    is_final_level = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['level_number']
    
    def __str__(self):
        return f"Level {self.level_number}: {self.title}"


class Progress(models.Model):
    """Track team progress through levels"""
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='progress')
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0)
    time_taken_seconds = models.IntegerField(null=True, blank=True)
    
    class Meta:
        unique_together = ('team', 'level')
        ordering = ['started_at']
    
    def __str__(self):
        return f"{self.team.team_id} - Level {self.level.level_number}"
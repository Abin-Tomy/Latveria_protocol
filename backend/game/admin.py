from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Team, Level, Progress


@admin.register(Team)
class TeamAdmin(UserAdmin):
    """Admin interface for Team model"""
    list_display = ['team_id', 'current_level', 'total_time_seconds', 'is_active_session', 'started_at']
    list_filter = ['current_level', 'is_active_session', 'started_at']
    search_fields = ['team_id']
    ordering = ['-current_level', 'total_time_seconds']
    
    fieldsets = (
        (None, {'fields': ('team_id', 'password')}),
        ('Game Progress', {'fields': ('current_level', 'total_time_seconds', 'started_at', 'completed_at')}),
        ('Session', {'fields': ('is_active_session', 'session_token')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('team_id', 'password1', 'password2'),
        }),
    )


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    """Admin interface for Level model"""
    list_display = ['level_number', 'title', 'is_final_level', 'created_at']
    list_filter = ['is_final_level', 'created_at']
    search_fields = ['title', 'description', 'puzzle_content']
    ordering = ['level_number']
    
    fieldsets = (
        ('Basic Info', {'fields': ('level_number', 'title', 'description')}),
        ('Puzzle', {'fields': ('puzzle_content', 'image', 'answer', 'hint')}),
        ('Settings', {'fields': ('is_final_level',)}),
    )


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    """Admin interface for Progress model"""
    list_display = ['team', 'level', 'started_at', 'completed_at', 'attempts', 'time_taken_seconds']
    list_filter = ['completed_at', 'started_at']
    search_fields = ['team__team_id', 'level__title']
    ordering = ['-started_at']
    
    readonly_fields = ['started_at']
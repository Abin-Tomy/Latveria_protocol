from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Team


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

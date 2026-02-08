from rest_framework import serializers
from .models import Team, Level, Progress


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_id', 'current_level', 'total_time_seconds', 'started_at', 'completed_at']
        read_only_fields = ['id']


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'level_number', 'title', 'description', 'puzzle_content', 'image', 'hint', 'is_final_level']
        read_only_fields = ['id']


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'team', 'level', 'started_at', 'completed_at', 'attempts', 'time_taken_seconds']
        read_only_fields = ['id', 'started_at']
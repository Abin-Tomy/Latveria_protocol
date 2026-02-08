from rest_framework import serializers
from .models import Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_id', 'current_level', 'total_time_seconds', 'started_at', 'completed_at']
        read_only_fields = ['id']

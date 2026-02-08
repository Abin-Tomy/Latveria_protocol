from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Team
from .serializers import TeamSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for authentication"""
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Team registration endpoint - creates a new team or logs in existing"""
    team_id = request.data.get('team_id')
    password = request.data.get('password')
    
    if not team_id or not password:
        return Response(
            {'error': 'Team name and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if team already exists
    existing_team = Team.objects.filter(team_id=team_id).first()
    
    if existing_team:
        # Team exists - try to authenticate (login)
        user = authenticate(request, username=team_id, password=password)
        if user is not None:
            login(request, user)
            user.is_active_session = True
            
            if not user.started_at:
                user.started_at = timezone.now()
            user.save()
            return Response({
                'success': True,
                'message': 'Welcome back!',
                'team': TeamSerializer(user).data
            })
        else:
            return Response(
                {'error': 'Team already exists with a different password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    else:
        # Create new team
        try:
            new_team = Team.objects.create_user(team_id=team_id, password=password)
            new_team.is_active_session = True
            new_team.started_at = timezone.now()
            new_team.save()
            
            # Log them in
            login(request, new_team)
            
            return Response({
                'success': True,
                'message': 'Registration successful!',
                'team': TeamSerializer(new_team).data
            })
        except Exception as e:
            return Response(
                {'error': f'Registration failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Team logout endpoint"""
    user = request.user
    user.is_active_session = False
    user.save()
    logout(request)
    
    return Response({'success': True, 'message': 'Logout successful'})


@api_view(['POST'])
@permission_classes([AllowAny])
def complete_game(request):
    """Save team completion time when game is finished"""
    team_id = request.data.get('team_id')
    completion_time_seconds = request.data.get('completion_time_seconds')
    
    if not team_id:
        return Response(
            {'error': 'Team ID is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        team = Team.objects.get(team_id=team_id)
        team.completed_at = timezone.now()
        team.total_time_seconds = completion_time_seconds or 0
        team.save()
        
        return Response({
            'success': True,
            'message': f'Congratulations {team_id}! Completion time recorded.',
            'team': TeamSerializer(team).data
        })
    except Team.DoesNotExist:
        # If team doesn't exist, create a record for them
        try:
            new_team = Team.objects.create_user(team_id=team_id, password='completed')
            new_team.completed_at = timezone.now()
            new_team.total_time_seconds = completion_time_seconds or 0
            new_team.save()
            
            return Response({
                'success': True,
                'message': f'Congratulations {team_id}! Completion time recorded.',
                'team': TeamSerializer(new_team).data
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to save completion: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
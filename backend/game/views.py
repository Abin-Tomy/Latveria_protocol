from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Team, Level, Progress
from .serializers import TeamSerializer, LevelSerializer


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


@api_view(['GET'])
@permission_classes([AllowAny])  # Changed to AllowAny with manual auth check
def get_current_level(request):
    """Get current level for the authenticated team"""
    # Debug logging
    print(f"[DEBUG] User authenticated: {request.user.is_authenticated}")
    print(f"[DEBUG] X-Team-ID header: {request.headers.get('X-Team-ID')}")
    print(f"[DEBUG] team_id query param: {request.GET.get('team_id')}")
    
    # Try to get team from session first
    if request.user.is_authenticated:
        # Force refresh from DB to ensure we have latest fields (like current_level)
        team = Team.objects.get(pk=request.user.pk)
    else:
        team = None
    
    # Fallback: get team from X-Team-ID header
    if not team:
        team_id = request.headers.get('X-Team-ID') or request.GET.get('team_id')
        print(f"[DEBUG] Resolved team_id: '{team_id}'")
        if team_id and team_id.strip():  # Make sure it's not empty
            try:
                team = Team.objects.get(team_id=team_id)
                print(f"[DEBUG] Found team: {team}")
            except Team.DoesNotExist:
                print(f"[DEBUG] Team not found for team_id: '{team_id}'")
                # List all teams for debugging
                all_teams = list(Team.objects.values_list('team_id', flat=True))
                print(f"[DEBUG] Available teams: {all_teams}")
                return Response(
                    {'error': f'Team not found: {team_id}'},
                    status=status.HTTP_404_NOT_FOUND
                )
    
    if not team:
        return Response(
            {'error': 'Authentication required. Please log in.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        level = Level.objects.get(level_number=team.current_level)
        
        # Create or get progress record
        progress, created = Progress.objects.get_or_create(
            team=team,
            level=level
        )
        
        return Response({
            'level': LevelSerializer(level).data,
            'current_level_number': team.current_level,
            'total_time_seconds': team.total_time_seconds,
            'attempts': progress.attempts
        })
    except Level.DoesNotExist:
        # Team has completed all levels
        total_levels = Level.objects.count()
        if team.current_level > total_levels:
            return Response({
                'game_completed': True,
                'current_level_number': team.current_level,
                'total_time_seconds': team.total_time_seconds,
                'message': 'All levels completed!'
            })
        return Response(
            {'error': 'Level not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])  # Changed to AllowAny with manual auth check
def submit_answer(request):
    """Submit answer for current level"""
    # Try to get team from session first
    team = request.user if request.user.is_authenticated else None
    
    # Fallback: get team from X-Team-ID header
    if not team:
        team_id = request.headers.get('X-Team-ID') or request.data.get('team_id')
        if team_id:
            try:
                team = Team.objects.get(team_id=team_id)
            except Team.DoesNotExist:
                return Response(
                    {'error': 'Team not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
    
    if not team:
        return Response(
            {'error': 'Authentication required. Please log in.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    submitted_answer = request.data.get('answer', '').strip().lower()
    
    if not submitted_answer:
        return Response(
            {'error': 'Answer is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        level = Level.objects.get(level_number=team.current_level)
        progress, created = Progress.objects.get_or_create(team=team, level=level)
        
        # Increment attempts
        progress.attempts += 1
        progress.save()
        
        # Check answer (case-insensitive)
        if submitted_answer == level.answer.strip().lower():
            # Correct answer
            progress.completed_at = timezone.now()
            if progress.started_at:
                progress.time_taken_seconds = int((progress.completed_at - progress.started_at).total_seconds())
            progress.save()
            
            # Update team progress
            team.current_level += 1
            team.total_time_seconds += progress.time_taken_seconds or 0
            
            # Check if all levels completed
            total_levels = Level.objects.count()
            if team.current_level > total_levels:
                team.completed_at = timezone.now()
            
            team.save()
            
            return Response({
                'correct': True,
                'message': 'Correct! Level unlocked.',
                'next_level': team.current_level,
                'is_completed': team.current_level > total_levels
            })
        else:
            # Wrong answer
            return Response({
                'correct': False,
                'message': 'Incorrect answer. Try again.',
                'attempts': progress.attempts
            })
            
    except Level.DoesNotExist:
        return Response(
            {'error': 'Level not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Progress.DoesNotExist:
        return Response(
            {'error': 'Progress record not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_status(request):
    """Get current team status"""
    team = request.user
    return Response({
        'team_id': team.team_id,
        'current_level': team.current_level,
        'total_time_seconds': team.total_time_seconds,
        'started_at': team.started_at,
        'completed_at': team.completed_at
    })
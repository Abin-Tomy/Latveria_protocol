from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='csrf'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('game/level/', views.get_current_level, name='current_level'),
    path('game/submit/', views.submit_answer, name='submit_answer'),
    path('game/status/', views.team_status, name='team_status'),
]
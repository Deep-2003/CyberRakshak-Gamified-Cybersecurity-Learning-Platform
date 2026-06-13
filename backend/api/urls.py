from django.urls import path
from .views import (
    scam_detect_view,
    profile,
    leaderboard,
    register
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
#paths to views
urlpatterns = [
    path('detect-scam/', scam_detect_view, name='detect-scam'),
    path("register/", register),
    path("login/", TokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("profile/", profile),
    path("leaderboard/", leaderboard)
]

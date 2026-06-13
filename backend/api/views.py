from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ml_models.inference import detector
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import UserProfile
from datetime import date

@api_view(['POST'])
def scam_detect_view(request):
    """
    Detect if input text is a scam or legitimate
    """
    text = request.data.get('text') or request.data.get('message')
    
    if not text:
        return Response(
            {"error": "Field 'text' is required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        result = detector.predict(text)
        if request.user.is_authenticated:

            profile, _ = UserProfile.objects.get_or_create(
                user=request.user
            )

            profile.update_streak()

            if result == "scam":
                profile.points += 15
            else:
                profile.points += 5

            profile.save()
            today = date.today()

            if profile.last_points_date != today:
                profile.points_today = 0
                profile.last_points_date = today

            if profile.points_today < 100:

                profile.points += 10
                profile.points_today += 10

                profile.update_level()

                profile.save()
        return Response({
            "status": "success",
            "input_text": text[:100] + "..." if len(text) > 100 else text,
            "prediction": result
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    #ensure profile is created for each user
    profile, created = UserProfile.objects.get_or_create(
                            user=request.user
                        )

    return Response({
        "username": request.user.username,
        "points": profile.points,
        "streak": profile.streak,
        "level": profile.level
    })

@api_view(["GET"])
def leaderboard(request):

    users = User.objects.all().order_by(
        "-profile__points"
    )[:10]

    data = []

    for user in users:

        data.append({
            "username": user.username,
            "points": user.profile.points,
            "streak": user.profile.streak,
            "level": user.profile.level
        })

    return Response(data)


@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response({
        "message": "User created successfully"
    })
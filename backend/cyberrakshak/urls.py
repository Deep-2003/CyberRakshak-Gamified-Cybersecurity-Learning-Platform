from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Simple welcome view for root URL
def home_view(request):
    return JsonResponse({
        "message": "Welcome to CyberRakshak API",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),   # All APIs under /api/
    path('', home_view),                 # ← Add this line for root URL
]
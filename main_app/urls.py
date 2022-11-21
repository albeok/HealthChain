from django.urls import path
from .views import homepage

urlpatterns = [path("", homepage.as_view(), name="homepage")]

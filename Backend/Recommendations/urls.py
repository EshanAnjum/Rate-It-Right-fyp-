from django.urls import path
from .views import recommend_devices

urlpatterns = [
    path('recommend/', recommend_devices, name='recommend_devices'),
]

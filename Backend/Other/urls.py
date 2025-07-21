# Other/urls.py

from django.urls import path
from .views import get_rag_answer, get_location_from_coordinates


urlpatterns = [
    path('get-answer/', get_rag_answer),
    path('get-location/', get_location_from_coordinates, name='get_location'),
]

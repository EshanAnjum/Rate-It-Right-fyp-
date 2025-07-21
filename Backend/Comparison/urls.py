from django.urls import path
from . import views

urlpatterns = [
    path('compare/', views.compare_devices, name='compare_devices'),
    path('autocomplete_analyzer_page/', views.autocomplete_analyzer_page, name='autocomplete_analyzer_page'),
]


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('Authentication.urls')),
    path('api/products/', include('Products.urls')),
    path('api/', include('Recommendations.urls')),
    path('datafetch/', include('DataFetch.urls')),
    path('api/', include('Recommendations.urls')),
    path('comparison/', include('Comparison.urls')),
    path('sentiment/', include('Sentiment.urls')),
    path('api/rag/', include('Other.urls')),
    path('api/others/', include('Other.urls')),
    path('api/contact/', include('Contact.urls')),
]
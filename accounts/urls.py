from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InformaticaCredentialsViewSet

router = DefaultRouter()
router.register(r'informatica/credentials', InformaticaCredentialsViewSet, basename='informatica-credentials')

urlpatterns = [
    path('', include(router.urls)),
] 
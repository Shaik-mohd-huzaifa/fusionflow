from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConnectorTypeViewSet,
    InformaticaConnectionViewSet,
    DataTaskViewSet,
    TaskExecutionViewSet
)

router = DefaultRouter()
router.register('connector-types', ConnectorTypeViewSet, basename='connector-type')
router.register('connections', InformaticaConnectionViewSet, basename='informatica-connection')
router.register('tasks', DataTaskViewSet, basename='data-task')
router.register('executions', TaskExecutionViewSet, basename='task-execution')

urlpatterns = [
    path('', include(router.urls)),
] 
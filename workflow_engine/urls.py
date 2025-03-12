from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AIComponentViewSet, WorkflowViewSet, WorkflowComponentViewSet,
    ComponentConnectionViewSet, WorkflowExecutionViewSet
)
from django.views.generic import RedirectView

router = DefaultRouter()
router.register('components', AIComponentViewSet, basename='ai-component')
router.register('workflows', WorkflowViewSet, basename='workflow')
router.register('workflow-components', WorkflowComponentViewSet, basename='workflow-component')
router.register('connections', ComponentConnectionViewSet, basename='connection')
router.register('executions', WorkflowExecutionViewSet, basename='execution')

urlpatterns = [
    path('builder/', RedirectView.as_view(url='/workflow-builder/')),
    path('', include(router.urls)),
] 
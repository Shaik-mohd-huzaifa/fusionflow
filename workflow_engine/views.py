from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import (
    AIComponent, Workflow, WorkflowComponent, ComponentConnection,
    WorkflowExecution, ComponentExecutionLog
)
from .serializers import (
    AIComponentSerializer, WorkflowSerializer, WorkflowComponentSerializer,
    ComponentConnectionSerializer, WorkflowExecutionSerializer,
    ComponentExecutionLogSerializer
)
from .permissions import IsOrganizationMember, IsOrganizationAdmin, IsWorkflowOwnerOrAdmin

# Create your views here.

class AIComponentViewSet(viewsets.ModelViewSet):
    serializer_class = AIComponentSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return AIComponent.objects.filter(
            created_by__organization=self.request.user.organization
        )

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember, IsWorkflowOwnerOrAdmin]

    def get_queryset(self):
        return Workflow.objects.filter(
            created_by__organization=self.request.user.organization
        )

    @action(detail=True, methods=['post'])
    def add_component(self, request, pk=None):
        workflow = self.get_object()
        serializer = WorkflowComponentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(workflow=workflow)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_connection(self, request, pk=None):
        workflow = self.get_object()
        serializer = ComponentConnectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(workflow=workflow)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        workflow = self.get_object()
        serializer = WorkflowExecutionSerializer(data={'workflow': workflow.id, 'input_data': request.data})
        if serializer.is_valid():
            execution = serializer.save()
            # Here you would typically trigger the workflow execution in background
            # For now, we'll just mark it as completed
            execution.status = 'COMPLETED'
            execution.save()
            return Response(WorkflowExecutionSerializer(execution).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkflowComponentViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowComponentSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return WorkflowComponent.objects.filter(
            workflow__created_by__organization=self.request.user.organization
        )

class ComponentConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ComponentConnectionSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return ComponentConnection.objects.filter(
            workflow__created_by__organization=self.request.user.organization
        )

class WorkflowExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return WorkflowExecution.objects.filter(
            workflow__created_by__organization=self.request.user.organization
        )

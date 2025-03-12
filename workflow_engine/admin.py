from django.contrib import admin
from .models import (
    AIComponent, Workflow, WorkflowComponent, ComponentConnection,
    WorkflowExecution, ComponentExecutionLog
)

@admin.register(AIComponent)
class AIComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'component_type', 'created_by', 'is_active', 'created_at')
    list_filter = ('component_type', 'is_active')
    search_fields = ('name', 'description')

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'version', 'is_active', 'is_published', 'created_at')
    list_filter = ('is_active', 'is_published')
    search_fields = ('name', 'description')

@admin.register(WorkflowComponent)
class WorkflowComponentAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'ai_component', 'order')
    list_filter = ('workflow', 'ai_component')
    ordering = ('workflow', 'order')

@admin.register(ComponentConnection)
class ComponentConnectionAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'source_component', 'target_component', 'connection_type')
    list_filter = ('workflow', 'connection_type')

@admin.register(WorkflowExecution)
class WorkflowExecutionAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'status', 'started_at', 'completed_at')
    list_filter = ('status', 'workflow')
    ordering = ('-started_at',)

@admin.register(ComponentExecutionLog)
class ComponentExecutionLogAdmin(admin.ModelAdmin):
    list_display = ('workflow_execution', 'workflow_component', 'status', 'started_at', 'completed_at')
    list_filter = ('status', 'workflow_execution')
    ordering = ('-started_at',)

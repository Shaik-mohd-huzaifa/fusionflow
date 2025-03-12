from django.db import models
from django.conf import settings

class AIComponent(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    component_type = models.CharField(max_length=50, choices=[
        ('INPUT', 'Input Component'),
        ('PROCESS', 'Processing Component'),
        ('OUTPUT', 'Output Component'),
        ('DECISION', 'Decision Component'),
    ])
    configuration_schema = models.JSONField(help_text="JSON schema for component configuration")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Workflow(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    version = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} v{self.version}"

class WorkflowComponent(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='components')
    ai_component = models.ForeignKey(AIComponent, on_delete=models.CASCADE)
    position_x = models.FloatField(help_text="X coordinate in the workflow canvas")
    position_y = models.FloatField(help_text="Y coordinate in the workflow canvas")
    configuration = models.JSONField(help_text="Component specific configuration")
    order = models.IntegerField(help_text="Execution order in the workflow")

    class Meta:
        ordering = ['order']

class ComponentConnection(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='connections')
    source_component = models.ForeignKey(WorkflowComponent, on_delete=models.CASCADE, related_name='outgoing_connections')
    target_component = models.ForeignKey(WorkflowComponent, on_delete=models.CASCADE, related_name='incoming_connections')
    connection_type = models.CharField(max_length=50, choices=[
        ('SUCCESS', 'Success Path'),
        ('FAILURE', 'Failure Path'),
        ('CONDITIONAL', 'Conditional Path'),
    ])
    condition = models.JSONField(null=True, blank=True, help_text="Conditions for conditional paths")

class WorkflowExecution(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='executions')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ])
    input_data = models.JSONField()
    output_data = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

class ComponentExecutionLog(models.Model):
    workflow_execution = models.ForeignKey(WorkflowExecution, on_delete=models.CASCADE, related_name='component_logs')
    workflow_component = models.ForeignKey(WorkflowComponent, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ])
    input_data = models.JSONField()
    output_data = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['started_at']

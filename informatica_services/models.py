from django.db import models
from accounts.models import Organization, CustomUser

class ConnectorType(models.Model):
    """Defines different types of connectors and their capabilities"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_source = models.BooleanField(default=True, help_text="Can be used as source")
    is_target = models.BooleanField(default=True, help_text="Can be used as target")
    informatica_type = models.CharField(max_length=100, help_text="Connector type in Informatica")
    category = models.CharField(max_length=50, choices=[
        ('DATABASE', 'Database'),
        ('FILE', 'File'),
        ('CLOUD', 'Cloud Service'),
        ('MESSAGING', 'Messaging'),
        ('BIGDATA', 'Big Data'),
        ('API', 'API/Web Service'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ConnectorField(models.Model):
    """Defines fields required for each connector type"""
    FIELD_TYPES = [
        ('STRING', 'Text String'),
        ('PASSWORD', 'Password'),
        ('NUMBER', 'Number'),
        ('BOOLEAN', 'Boolean'),
        ('FILE', 'File Upload'),
        ('SELECT', 'Selection'),
        ('MULTISELECT', 'Multiple Selection'),
    ]

    connector_type = models.ForeignKey(ConnectorType, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=100)
    field_key = models.CharField(max_length=100, help_text="Key used in configuration")
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    description = models.TextField(blank=True)
    is_required = models.BooleanField(default=True)
    is_credential = models.BooleanField(default=False, help_text="Whether this field contains sensitive data")
    default_value = models.JSONField(null=True, blank=True)
    validation_regex = models.CharField(max_length=500, blank=True, help_text="Regex for field validation")
    options = models.JSONField(null=True, blank=True, help_text="Options for SELECT/MULTISELECT fields")
    order = models.IntegerField(default=0, help_text="Display order in forms")

    class Meta:
        unique_together = ['connector_type', 'field_key']
        ordering = ['order']

    def __str__(self):
        return f"{self.connector_type.name} - {self.name}"

class InformaticaConnection(models.Model):
    name = models.CharField(max_length=255)
    connector_type = models.ForeignKey(ConnectorType, on_delete=models.PROTECT)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Connection Details stored securely
    connection_config = models.JSONField(help_text="Non-sensitive configuration details")
    credentials = models.JSONField(help_text="Encrypted sensitive credentials", null=True, blank=True)
    informatica_connection_id = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        unique_together = ['name', 'organization']

    def __str__(self):
        return f"{self.name} ({self.connector_type.name})"

class DataTask(models.Model):
    TASK_TYPES = [
        ('MAPPING', 'Data Mapping'),
        ('CODE', 'Code Task'),
        ('FILE_TRANSFER', 'File Transfer'),
        ('DYNAMIC_MAPPING', 'Dynamic Mapping'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('READY', 'Ready'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    task_type = models.CharField(max_length=50, choices=TASK_TYPES)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    # Task Configuration
    source_connection = models.ForeignKey(InformaticaConnection, on_delete=models.CASCADE, related_name='source_tasks')
    target_connection = models.ForeignKey(InformaticaConnection, on_delete=models.CASCADE, related_name='target_tasks')
    task_config = models.JSONField(help_text="Task configuration details")
    
    class Meta:
        unique_together = ['name', 'organization']

    def __str__(self):
        return self.name

class TaskExecution(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    task = models.ForeignKey(DataTask, on_delete=models.CASCADE, related_name='executions')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    executed_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    input_params = models.JSONField(null=True, blank=True)
    output_data = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    informatica_job_id = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"Execution {self.id} of {self.task.name}"

class InformaticaCredentials(models.Model):
    user = models.OneToOneField('accounts.CustomUser', on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  # This will be encrypted
    security_domain = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Informatica Credentials'
        verbose_name_plural = 'Informatica Credentials'

    def __str__(self):
        return f"Informatica Credentials for {self.user.email}" 
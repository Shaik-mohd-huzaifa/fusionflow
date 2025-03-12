from rest_framework import serializers
from .models import AIComponent, Workflow, WorkflowComponent, ComponentConnection, WorkflowExecution, ComponentExecutionLog

class AIComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIComponent
        fields = ['id', 'name', 'description', 'component_type', 'configuration_schema', 'created_at', 'is_active']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class WorkflowComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowComponent
        fields = ['id', 'workflow', 'ai_component', 'position_x', 'position_y', 'configuration', 'order']

class ComponentConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentConnection
        fields = ['id', 'workflow', 'source_component', 'target_component', 'connection_type', 'condition']

class WorkflowSerializer(serializers.ModelSerializer):
    components = WorkflowComponentSerializer(many=True, read_only=True)
    connections = ComponentConnectionSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ['id', 'name', 'description', 'created_by', 'created_at', 'is_active', 'is_published', 'version', 'components', 'connections']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class WorkflowExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowExecution
        fields = ['id', 'workflow', 'started_at', 'completed_at', 'status', 'input_data', 'output_data', 'error_message']
        read_only_fields = ['started_at', 'completed_at', 'status', 'output_data', 'error_message']

class ComponentExecutionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentExecutionLog
        fields = ['id', 'workflow_execution', 'workflow_component', 'started_at', 'completed_at', 'status', 'input_data', 'output_data', 'error_message']
        read_only_fields = ['started_at', 'completed_at', 'status', 'output_data', 'error_message'] 
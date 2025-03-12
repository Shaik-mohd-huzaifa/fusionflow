from rest_framework import serializers
from .models import (
    ConnectorType, ConnectorField, InformaticaConnection,
    DataTask, TaskExecution, InformaticaCredentials
)

class ConnectorFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectorField
        fields = ['id', 'name', 'field_key', 'field_type', 'description',
                 'is_required', 'is_credential', 'default_value', 'options', 'order']

class ConnectorTypeSerializer(serializers.ModelSerializer):
    fields = ConnectorFieldSerializer(many=True, read_only=True)

    class Meta:
        model = ConnectorType
        fields = ['id', 'name', 'code', 'description', 'category',
                 'is_source', 'is_target', 'fields']

class InformaticaConnectionSerializer(serializers.ModelSerializer):
    connector_type_details = ConnectorTypeSerializer(source='connector_type', read_only=True)
    
    class Meta:
        model = InformaticaConnection
        fields = ['id', 'name', 'connector_type', 'connector_type_details',
                 'organization', 'created_by', 'created_at', 'updated_at',
                 'is_active', 'connection_config', 'credentials',
                 'informatica_connection_id']
        read_only_fields = ['created_by', 'created_at', 'updated_at',
                          'informatica_connection_id']
        extra_kwargs = {
            'credentials': {'write_only': True}
        }

    def validate(self, data):
        connector_type = data['connector_type']
        config = data.get('connection_config', {})
        credentials = data.get('credentials', {})

        # Validate required fields
        required_fields = connector_type.fields.filter(is_required=True)
        for field in required_fields:
            if field.is_credential:
                if field.field_key not in credentials:
                    raise serializers.ValidationError(
                        f"Required credential field '{field.name}' is missing"
                    )
            else:
                if field.field_key not in config:
                    raise serializers.ValidationError(
                        f"Required field '{field.name}' is missing"
                    )

        # Validate field types
        for field in connector_type.fields.all():
            value = credentials.get(field.field_key) if field.is_credential else config.get(field.field_key)
            if value is not None:
                if field.field_type == 'NUMBER' and not isinstance(value, (int, float)):
                    raise serializers.ValidationError(
                        f"Field '{field.name}' must be a number"
                    )
                elif field.field_type == 'BOOLEAN' and not isinstance(value, bool):
                    raise serializers.ValidationError(
                        f"Field '{field.name}' must be a boolean"
                    )
                elif field.field_type == 'SELECT' and field.options and value not in field.options:
                    raise serializers.ValidationError(
                        f"Field '{field.name}' must be one of: {', '.join(field.options)}"
                    )

        return data

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class DataTaskSerializer(serializers.ModelSerializer):
    source_connection_details = InformaticaConnectionSerializer(
        source='source_connection', read_only=True
    )
    target_connection_details = InformaticaConnectionSerializer(
        source='target_connection', read_only=True
    )

    class Meta:
        model = DataTask
        fields = ['id', 'name', 'description', 'task_type', 'organization',
                 'created_by', 'created_at', 'updated_at', 'status',
                 'source_connection', 'source_connection_details',
                 'target_connection', 'target_connection_details',
                 'task_config']
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'status']

    def validate(self, data):
        # Validate source connection can be used as source
        if not data['source_connection'].connector_type.is_source:
            raise serializers.ValidationError(
                f"Connector type '{data['source_connection'].connector_type.name}' cannot be used as a source"
            )

        # Validate target connection can be used as target
        if not data['target_connection'].connector_type.is_target:
            raise serializers.ValidationError(
                f"Connector type '{data['target_connection'].connector_type.name}' cannot be used as a target"
            )

        return data

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class TaskExecutionSerializer(serializers.ModelSerializer):
    task_details = DataTaskSerializer(source='task', read_only=True)

    class Meta:
        model = TaskExecution
        fields = ['id', 'task', 'task_details', 'started_at', 'completed_at',
                 'status', 'executed_by', 'input_params', 'output_data',
                 'error_message', 'informatica_job_id']
        read_only_fields = ['started_at', 'completed_at', 'status', 'executed_by',
                          'output_data', 'error_message', 'informatica_job_id']

    def create(self, validated_data):
        validated_data['executed_by'] = self.context['request'].user
        return super().create(validated_data)

class ConnectionTestSerializer(serializers.Serializer):
    connection_id = serializers.IntegerField()

class MappingExecuteSerializer(serializers.Serializer):
    runtime_params = serializers.JSONField(required=False)

class InformaticaCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformaticaCredentials
        fields = ['id', 'username', 'password', 'security_domain', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Encrypt password before saving
        from django.conf import settings
        from cryptography.fernet import Fernet
        f = Fernet(settings.ENCRYPTION_KEY.encode())
        validated_data['password'] = f.encrypt(validated_data['password'].encode()).decode()
        return super().create(validated_data) 
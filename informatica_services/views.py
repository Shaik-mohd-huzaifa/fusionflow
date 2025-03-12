from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import (
    ConnectorType, ConnectorField, InformaticaConnection,
    DataTask, TaskExecution
)
from .serializers import (
    ConnectorTypeSerializer, ConnectorFieldSerializer,
    InformaticaConnectionSerializer, DataTaskSerializer,
    TaskExecutionSerializer, ConnectionTestSerializer,
    MappingExecuteSerializer
)
from .services import InformaticaAPIClient
from workflow_engine.permissions import IsOrganizationMember
from rest_framework.exceptions import ValidationError
from accounts.models import InformaticaCredentials

class ConnectorTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for connector types. Connector types are managed through
    the management command and cannot be modified through the API.
    """
    serializer_class = ConnectorTypeSerializer
    permission_classes = [IsAuthenticated]
    queryset = ConnectorType.objects.filter(is_active=True)

    @action(detail=True)
    def fields(self, request, pk=None):
        """Get fields for a specific connector type"""
        connector_type = self.get_object()
        fields = connector_type.fields.all()
        serializer = ConnectorFieldSerializer(fields, many=True)
        return Response(serializer.data)

class InformaticaConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = InformaticaConnectionSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return InformaticaConnection.objects.filter(
            organization=self.request.user.organization
        )

    def get_informatica_client(self):
        try:
            credentials = InformaticaCredentials.objects.get(user=self.request.user)
            # Decrypt password
            from django.conf import settings
            from cryptography.fernet import Fernet
            f = Fernet(settings.ENCRYPTION_KEY.encode())
            decrypted_password = f.decrypt(credentials.password.encode()).decode()
            
            return InformaticaAPIClient(
                settings.INFORMATICA_BASE_URL,
                credentials.username,
                decrypted_password,
                credentials.security_domain
            )
        except InformaticaCredentials.DoesNotExist:
            raise ValidationError("Please configure your Informatica credentials first")

    def perform_create(self, serializer):
        connection = serializer.save()
        client = self.get_informatica_client()
        
        try:
            # Create the connection in Informatica
            connection_data = {
                'name': connection.name,
                'type': connection.connector_type.informatica_type,
                'properties': {
                    **connection.connection_config,
                    **connection.credentials
                }
            }
            
            result = client.create_connection(connection_data)
            connection.informatica_connection_id = result['id']
            connection.save()
            
        except Exception as e:
            connection.delete()
            raise serializer.ValidationError(str(e))

    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        connection = self.get_object()
        client = self.get_informatica_client()
        
        try:
            result = client.test_connection(connection.informatica_connection_id)
            return Response(result)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class DataTaskViewSet(viewsets.ModelViewSet):
    serializer_class = DataTaskSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return DataTask.objects.filter(
            organization=self.request.user.organization
        )

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        task = self.get_object()
        serializer = MappingExecuteSerializer(data=request.data)
        
        if serializer.is_valid():
            client = InformaticaAPIClient(
                settings.INFORMATICA_BASE_URL,
                settings.INFORMATICA_USERNAME,
                settings.INFORMATICA_PASSWORD
            )
            
            try:
                # Create execution record
                execution = TaskExecution.objects.create(
                    task=task,
                    executed_by=request.user,
                    input_params=serializer.validated_data.get('runtime_params')
                )
                
                # Execute the mapping in Informatica
                result = client.execute_mapping(
                    task.task_config['informatica_mapping_id'],
                    serializer.validated_data.get('runtime_params')
                )
                
                # Update execution record with job ID
                execution.informatica_job_id = result['jobId']
                execution.status = 'RUNNING'
                execution.save()
                
                return Response(TaskExecutionSerializer(execution).data)
            except Exception as e:
                if 'execution' in locals():
                    execution.status = 'FAILED'
                    execution.error_message = str(e)
                    execution.save()
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskExecutionSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return TaskExecution.objects.filter(
            task__organization=self.request.user.organization
        )

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        execution = self.get_object()
        
        if not execution.informatica_job_id:
            return Response(
                {'error': 'No Informatica job ID available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        client = InformaticaAPIClient(
            settings.INFORMATICA_BASE_URL,
            settings.INFORMATICA_USERNAME,
            settings.INFORMATICA_PASSWORD
        )
        
        try:
            logs = client.get_job_logs(execution.informatica_job_id)
            return Response(logs)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            ) 
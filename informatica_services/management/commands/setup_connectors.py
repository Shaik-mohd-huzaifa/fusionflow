from django.core.management.base import BaseCommand
from informatica_services.models import ConnectorType, ConnectorField

class Command(BaseCommand):
    help = 'Sets up initial connector types and their required fields'

    def handle(self, *args, **options):
        # Define connector types and their fields
        connectors = {
            'mysql': {
                'name': 'MySQL Database',
                'code': 'MYSQL',
                'description': 'Connect to MySQL databases',
                'category': 'DATABASE',
                'informatica_type': 'MySQL',
                'fields': [
                    {
                        'name': 'Host',
                        'field_key': 'host',
                        'field_type': 'STRING',
                        'description': 'Database host address',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Port',
                        'field_key': 'port',
                        'field_type': 'NUMBER',
                        'description': 'Database port number',
                        'default_value': 3306,
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Database',
                        'field_key': 'database',
                        'field_type': 'STRING',
                        'description': 'Database name',
                        'is_required': True,
                        'order': 3,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Database username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 4,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Database password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 5,
                    },
                ]
            },
            'postgresql': {
                'name': 'PostgreSQL Database',
                'code': 'POSTGRESQL',
                'description': 'Connect to PostgreSQL databases',
                'category': 'DATABASE',
                'informatica_type': 'PostgreSQL',
                'fields': [
                    {
                        'name': 'Host',
                        'field_key': 'host',
                        'field_type': 'STRING',
                        'description': 'Database host address',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Port',
                        'field_key': 'port',
                        'field_type': 'NUMBER',
                        'description': 'Database port number',
                        'default_value': 5432,
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Database',
                        'field_key': 'database',
                        'field_type': 'STRING',
                        'description': 'Database name',
                        'is_required': True,
                        'order': 3,
                    },
                    {
                        'name': 'Schema',
                        'field_key': 'schema',
                        'field_type': 'STRING',
                        'description': 'Database schema',
                        'default_value': 'public',
                        'is_required': True,
                        'order': 4,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Database username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 5,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Database password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 6,
                    },
                ]
            },
            'flat_file': {
                'name': 'Flat File',
                'code': 'FLATFILE',
                'description': 'Connect to flat files (CSV, Fixed-width, etc.)',
                'category': 'FILE',
                'informatica_type': 'FlatFile',
                'fields': [
                    {
                        'name': 'File Type',
                        'field_key': 'file_type',
                        'field_type': 'SELECT',
                        'description': 'Type of flat file',
                        'options': ['CSV', 'Fixed Width', 'Delimited'],
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Delimiter',
                        'field_key': 'delimiter',
                        'field_type': 'STRING',
                        'description': 'Field delimiter for delimited files',
                        'default_value': ',',
                        'is_required': False,
                        'order': 2,
                    },
                    {
                        'name': 'Text Qualifier',
                        'field_key': 'text_qualifier',
                        'field_type': 'STRING',
                        'description': 'Text qualifier character',
                        'default_value': '"',
                        'is_required': False,
                        'order': 3,
                    },
                    {
                        'name': 'Encoding',
                        'field_key': 'encoding',
                        'field_type': 'SELECT',
                        'description': 'File encoding',
                        'options': ['UTF-8', 'UTF-16', 'ASCII', 'ISO-8859-1'],
                        'default_value': 'UTF-8',
                        'is_required': True,
                        'order': 4,
                    },
                    {
                        'name': 'Header Row',
                        'field_key': 'has_header',
                        'field_type': 'BOOLEAN',
                        'description': 'File has header row',
                        'default_value': True,
                        'is_required': True,
                        'order': 5,
                    },
                ]
            },
            'sftp': {
                'name': 'SFTP Server',
                'code': 'SFTP',
                'description': 'Connect to SFTP servers',
                'category': 'FILE',
                'informatica_type': 'SFTP',
                'fields': [
                    {
                        'name': 'Host',
                        'field_key': 'host',
                        'field_type': 'STRING',
                        'description': 'SFTP server host',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Port',
                        'field_key': 'port',
                        'field_type': 'NUMBER',
                        'description': 'SFTP server port',
                        'default_value': 22,
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'SFTP username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                    {
                        'name': 'Authentication Type',
                        'field_key': 'auth_type',
                        'field_type': 'SELECT',
                        'description': 'Authentication method',
                        'is_required': True,
                        'options': ['Password', 'SSH Key'],
                        'order': 4,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'SFTP password',
                        'is_required': False,
                        'is_credential': True,
                        'order': 5,
                    },
                    {
                        'name': 'SSH Private Key',
                        'field_key': 'ssh_key',
                        'field_type': 'FILE',
                        'description': 'SSH private key file',
                        'is_required': False,
                        'is_credential': True,
                        'order': 6,
                    },
                ]
            }
        }

        # Add these additional connectors
        connectors.update({
            'oracle': {
                'name': 'Oracle Database',
                'code': 'ORACLE',
                'description': 'Connect to Oracle databases',
                'category': 'DATABASE',
                'informatica_type': 'Oracle',
                'fields': [
                    {
                        'name': 'Host',
                        'field_key': 'host',
                        'field_type': 'STRING',
                        'description': 'Database host address',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Port',
                        'field_key': 'port',
                        'field_type': 'NUMBER',
                        'description': 'Database port number',
                        'default_value': 1521,
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Service Name',
                        'field_key': 'service_name',
                        'field_type': 'STRING',
                        'description': 'Oracle service name',
                        'is_required': True,
                        'order': 3,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Database username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 4,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Database password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 5,
                    },
                ]
            },
            'mssql': {
                'name': 'Microsoft SQL Server',
                'code': 'MSSQL',
                'description': 'Connect to Microsoft SQL Server databases',
                'category': 'DATABASE',
                'informatica_type': 'SqlServer',
                'fields': [
                    {
                        'name': 'Server',
                        'field_key': 'server',
                        'field_type': 'STRING',
                        'description': 'SQL Server host address',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Port',
                        'field_key': 'port',
                        'field_type': 'NUMBER',
                        'description': 'Database port number',
                        'default_value': 1433,
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Database',
                        'field_key': 'database',
                        'field_type': 'STRING',
                        'description': 'Database name',
                        'is_required': True,
                        'order': 3,
                    },
                    {
                        'name': 'Authentication Type',
                        'field_key': 'auth_type',
                        'field_type': 'SELECT',
                        'description': 'Authentication method',
                        'options': ['SQL Server', 'Windows'],
                        'default_value': 'SQL Server',
                        'is_required': True,
                        'order': 4,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Database username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 5,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Database password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 6,
                    },
                ]
            },
            'salesforce': {
                'name': 'Salesforce',
                'code': 'SALESFORCE',
                'description': 'Connect to Salesforce CRM',
                'category': 'CLOUD',
                'informatica_type': 'SalesForce',
                'fields': [
                    {
                        'name': 'Environment',
                        'field_key': 'environment',
                        'field_type': 'SELECT',
                        'description': 'Salesforce environment',
                        'is_required': True,
                        'options': ['Production', 'Sandbox'],
                        'order': 1,
                    },
                    {
                        'name': 'Client ID',
                        'field_key': 'client_id',
                        'field_type': 'STRING',
                        'description': 'OAuth Client ID',
                        'is_required': True,
                        'is_credential': True,
                        'order': 2,
                    },
                    {
                        'name': 'Client Secret',
                        'field_key': 'client_secret',
                        'field_type': 'PASSWORD',
                        'description': 'OAuth Client Secret',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Salesforce username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 4,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Salesforce password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 5,
                    },
                ]
            },
            's3': {
                'name': 'Amazon S3',
                'code': 'S3',
                'description': 'Connect to Amazon S3 storage',
                'category': 'CLOUD',
                'informatica_type': 'AmazonS3',
                'fields': [
                    {
                        'name': 'Region',
                        'field_key': 'region',
                        'field_type': 'SELECT',
                        'description': 'AWS Region',
                        'is_required': True,
                        'options': ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
                        'order': 1,
                    },
                    {
                        'name': 'Bucket',
                        'field_key': 'bucket',
                        'field_type': 'STRING',
                        'description': 'S3 Bucket name',
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Access Key ID',
                        'field_key': 'access_key_id',
                        'field_type': 'STRING',
                        'description': 'AWS Access Key ID',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                    {
                        'name': 'Secret Access Key',
                        'field_key': 'secret_access_key',
                        'field_type': 'PASSWORD',
                        'description': 'AWS Secret Access Key',
                        'is_required': True,
                        'is_credential': True,
                        'order': 4,
                    },
                ]
            },
            'rest_api': {
                'name': 'REST API',
                'code': 'REST',
                'description': 'Connect to REST APIs',
                'category': 'API',
                'informatica_type': 'RestAPI',
                'fields': [
                    {
                        'name': 'Base URL',
                        'field_key': 'base_url',
                        'field_type': 'STRING',
                        'description': 'Base URL of the API',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Authentication Type',
                        'field_key': 'auth_type',
                        'field_type': 'SELECT',
                        'description': 'Authentication method',
                        'options': ['None', 'Basic', 'Bearer Token', 'OAuth2'],
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Username for Basic Auth',
                        'is_required': False,
                        'is_credential': True,
                        'order': 3,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Password for Basic Auth',
                        'is_required': False,
                        'is_credential': True,
                        'order': 4,
                    },
                    {
                        'name': 'Bearer Token',
                        'field_key': 'token',
                        'field_type': 'PASSWORD',
                        'description': 'Bearer token for authentication',
                        'is_required': False,
                        'is_credential': True,
                        'order': 5,
                    },
                    {
                        'name': 'Headers',
                        'field_key': 'headers',
                        'field_type': 'STRING',
                        'description': 'Custom headers in JSON format',
                        'is_required': False,
                        'order': 6,
                    },
                ]
            },
            'azure_blob': {
                'name': 'Azure Blob Storage',
                'code': 'AZURE_BLOB',
                'description': 'Connect to Azure Blob Storage',
                'category': 'CLOUD',
                'informatica_type': 'AzureBlob',
                'fields': [
                    {
                        'name': 'Storage Account',
                        'field_key': 'account_name',
                        'field_type': 'STRING',
                        'description': 'Azure Storage Account name',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Container',
                        'field_key': 'container',
                        'field_type': 'STRING',
                        'description': 'Blob container name',
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Access Key',
                        'field_key': 'access_key',
                        'field_type': 'PASSWORD',
                        'description': 'Storage Account access key',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                ]
            },
            'google_bigquery': {
                'name': 'Google BigQuery',
                'code': 'BIGQUERY',
                'description': 'Connect to Google BigQuery',
                'category': 'BIGDATA',
                'informatica_type': 'GoogleBigQuery',
                'fields': [
                    {
                        'name': 'Project ID',
                        'field_key': 'project_id',
                        'field_type': 'STRING',
                        'description': 'Google Cloud Project ID',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Dataset',
                        'field_key': 'dataset',
                        'field_type': 'STRING',
                        'description': 'BigQuery dataset name',
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Service Account Key',
                        'field_key': 'service_account_key',
                        'field_type': 'FILE',
                        'description': 'Google Cloud service account key file (JSON)',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                ]
            },
            'kafka': {
                'name': 'Apache Kafka',
                'code': 'KAFKA',
                'description': 'Connect to Apache Kafka clusters',
                'category': 'MESSAGING',
                'informatica_type': 'Kafka',
                'fields': [
                    {
                        'name': 'Bootstrap Servers',
                        'field_key': 'bootstrap_servers',
                        'field_type': 'STRING',
                        'description': 'Comma-separated list of Kafka brokers',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Security Protocol',
                        'field_key': 'security_protocol',
                        'field_type': 'SELECT',
                        'description': 'Security protocol for Kafka connection',
                        'options': ['PLAINTEXT', 'SSL', 'SASL_PLAINTEXT', 'SASL_SSL'],
                        'default_value': 'PLAINTEXT',
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'SASL Mechanism',
                        'field_key': 'sasl_mechanism',
                        'field_type': 'SELECT',
                        'description': 'SASL mechanism for authentication',
                        'options': ['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'],
                        'is_required': False,
                        'order': 3,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'SASL username',
                        'is_required': False,
                        'is_credential': True,
                        'order': 4,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'SASL password',
                        'is_required': False,
                        'is_credential': True,
                        'order': 5,
                    },
                ]
            },
            'mongodb': {
                'name': 'MongoDB',
                'code': 'MONGODB',
                'description': 'Connect to MongoDB databases',
                'category': 'DATABASE',
                'informatica_type': 'MongoDB',
                'fields': [
                    {
                        'name': 'Connection String',
                        'field_key': 'connection_string',
                        'field_type': 'STRING',
                        'description': 'MongoDB connection string (without credentials)',
                        'is_required': True,
                        'order': 1,
                    },
                    {
                        'name': 'Database',
                        'field_key': 'database',
                        'field_type': 'STRING',
                        'description': 'Database name',
                        'is_required': True,
                        'order': 2,
                    },
                    {
                        'name': 'Username',
                        'field_key': 'username',
                        'field_type': 'STRING',
                        'description': 'Database username',
                        'is_required': True,
                        'is_credential': True,
                        'order': 3,
                    },
                    {
                        'name': 'Password',
                        'field_key': 'password',
                        'field_type': 'PASSWORD',
                        'description': 'Database password',
                        'is_required': True,
                        'is_credential': True,
                        'order': 4,
                    },
                ]
            }
        })

        for code, config in connectors.items():
            connector_type, created = ConnectorType.objects.update_or_create(
                code=code,
                defaults={
                    'name': config['name'],
                    'description': config['description'],
                    'category': config['category'],
                    'informatica_type': config['informatica_type'],
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created connector type: {connector_type.name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated connector type: {connector_type.name}'))

            # Create or update fields for this connector type
            for field_config in config['fields']:
                field, created = ConnectorField.objects.update_or_create(
                    connector_type=connector_type,
                    field_key=field_config['field_key'],
                    defaults={
                        'name': field_config['name'],
                        'field_type': field_config['field_type'],
                        'description': field_config['description'],
                        'is_required': field_config['is_required'],
                        'is_credential': field_config.get('is_credential', False),
                        'default_value': field_config.get('default_value'),
                        'options': field_config.get('options'),
                        'order': field_config['order'],
                    }
                )
                
                if created:
                    self.stdout.write(f'  Created field: {field.name}')
                else:
                    self.stdout.write(f'  Updated field: {field.name}') 
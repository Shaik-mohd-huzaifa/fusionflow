import requests
import json
from django.conf import settings
from datetime import datetime, timedelta

class InformaticaAPIClient:
    def __init__(self, base_url, username, password):
        self.base_url = base_url
        self.username = username
        self.password = password
        self.session_id = None
        self.session_expiry = None

    def _get_auth_headers(self):
        """Get authentication headers with session ID if available"""
        if not self.session_id or datetime.now() >= self.session_expiry:
            self._login()
        
        return {
            'Content-Type': 'application/json',
            'INFA-SESSION-ID': self.session_id
        }

    def _login(self):
        """Login to Informatica API and get session ID"""
        login_url = f"{self.base_url}/api/v2/user/login"
        response = requests.post(
            login_url,
            json={
                "username": self.username,
                "password": self.password
            }
        )
        response.raise_for_status()
        data = response.json()
        self.session_id = data['sessionId']
        # Set session expiry to 23 hours from now (sessions typically last 24 hours)
        self.session_expiry = datetime.now() + timedelta(hours=23)

    def create_connection(self, connection_data):
        """Create a new connection in Informatica"""
        url = f"{self.base_url}/api/v2/connection"
        response = requests.post(
            url,
            headers=self._get_auth_headers(),
            json=connection_data
        )
        response.raise_for_status()
        return response.json()

    def test_connection(self, connection_id):
        """Test an existing connection"""
        url = f"{self.base_url}/api/v2/connection/{connection_id}/test"
        response = requests.post(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_mapping(self, mapping_data):
        """Create a new mapping task"""
        url = f"{self.base_url}/api/v2/mapping"
        response = requests.post(
            url,
            headers=self._get_auth_headers(),
            json=mapping_data
        )
        response.raise_for_status()
        return response.json()

    def execute_mapping(self, mapping_id, runtime_params=None):
        """Execute a mapping task"""
        url = f"{self.base_url}/api/v2/mapping/{mapping_id}/execute"
        data = {"runtimeParameters": runtime_params} if runtime_params else {}
        response = requests.post(
            url,
            headers=self._get_auth_headers(),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def get_job_status(self, job_id):
        """Get the status of a job"""
        url = f"{self.base_url}/api/v2/activity/job/{job_id}"
        response = requests.get(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def get_job_logs(self, job_id):
        """Get logs for a specific job"""
        url = f"{self.base_url}/api/v2/activity/job/{job_id}/log"
        response = requests.get(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def list_connections(self, connection_type=None):
        """List all connections or filter by type"""
        url = f"{self.base_url}/api/v2/connection"
        params = {"type": connection_type} if connection_type else {}
        response = requests.get(
            url,
            headers=self._get_auth_headers(),
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_connection_details(self, connection_id):
        """Get details of a specific connection"""
        url = f"{self.base_url}/api/v2/connection/{connection_id}"
        response = requests.get(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def update_connection(self, connection_id, connection_data):
        """Update an existing connection"""
        url = f"{self.base_url}/api/v2/connection/{connection_id}"
        response = requests.put(
            url,
            headers=self._get_auth_headers(),
            json=connection_data
        )
        response.raise_for_status()
        return response.json()

    def delete_connection(self, connection_id):
        """Delete a connection"""
        url = f"{self.base_url}/api/v2/connection/{connection_id}"
        response = requests.delete(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.status_code == 204 
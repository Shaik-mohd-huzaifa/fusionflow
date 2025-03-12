import requests
from typing import Dict, List, Optional
from urllib.parse import urljoin
from datetime import datetime, timedelta

class InformaticaCloudAPI:
    def __init__(self, pod_url: str, username: str, password: str, security_domain: Optional[str] = None):
        self.pod_url = pod_url.rstrip('/')
        self.username = username
        self.password = password
        self.security_domain = security_domain
        self.session_id = None
        self.session_expiry = None
        self.icSessionId = None

    def _get_auth_headers(self):
        """Get authentication headers with session ID if available"""
        if not self.session_id or datetime.now() >= self.session_expiry:
            self._login()
        
        return {
            'Content-Type': 'application/json',
            'INFA-SESSION-ID': self.session_id,
            'Accept': 'application/json',
            'icSessionId': self.icSessionId
        }

    def _login(self):
        """Login to Informatica API and get session ID"""
        login_url = f"{self.pod_url}/api/v2/user/login"
        response = requests.post(
            login_url,
            json={
                "username": self.username,
                "password": self.password,
                "securityDomain": self.security_domain or "@"
            }
        )
        response.raise_for_status()
        data = response.json()
        self.session_id = data['sessionId']
        # Set session expiry to 23 hours from now (sessions typically last 24 hours)
        self.session_expiry = datetime.now() + timedelta(hours=23)
        self.icSessionId = response.cookies.get('icSessionId')

    def test_connection(self) -> bool:
        """Test connection to Informatica Cloud"""
        try:
            self._login()
            return True
        except Exception as e:
            print(f"Connection test failed: {str(e)}")
            return False

    def get_connections(self) -> List[Dict]:
        """Get list of connections from Informatica Cloud"""
        url = f"{self.pod_url}/api/v2/connection"
        response = requests.get(
            url,
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_connection(self, connection_data):
        """Create a new connection in Informatica Cloud
        
        Args:
            connection_data (dict): Dictionary containing connection details:
                - name: Connection name
                - type: Connection type (e.g., Oracle, MySQL, etc.)
                - description: Optional description
        
        Returns:
            dict: Created connection details
        """
        url = f"{self.pod_url}/api/v2/connection"
        response = requests.post(
            url,
            headers=self._get_auth_headers(),
            json=connection_data
        )
        response.raise_for_status()
        return response.json()

def get_informatica_api(credentials) -> Optional[InformaticaCloudAPI]:
    """Create an InformaticaCloudAPI instance from credentials"""
    try:
        return InformaticaCloudAPI(
            pod_url=credentials.pod_url,
            username=credentials.username,
            password=credentials.password,
            security_domain=credentials.security_domain
        )
    except Exception as e:
        print(f"Failed to create Informatica API instance: {str(e)}")
        return None 
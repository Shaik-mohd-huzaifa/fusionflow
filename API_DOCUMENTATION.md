# AI Workflow Builder API Documentation

## Base URL
All API routes are prefixed with `/api`

## Authentication
Most endpoints require authentication using Token Authentication. Include the token in the request header:
```
Authorization: Token <your_token>
```

## Account Management Routes

### Authentication
#### Register New User and Organization
- **URL**: `/accounts/auth/register/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
    "username": "user@example.com",
    "email": "user@example.com",
    "password": "your_password",
    "first_name": "John",
    "last_name": "Doe",
    "organization_name": "My Company"
}
```
- **Success Response**: 
```json
{
    "token": "your_auth_token",
    "user": {
        "id": 1,
        "username": "user@example.com",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "organization": {
            "id": 1,
            "name": "My Company",
            "description": "",
            "subscription_plan": "FREE",
            "is_active": true
        },
        "role": "ADMIN"
    }
}
```

#### User Login
- **URL**: `/accounts/auth/login/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
    "username": "user@example.com",
    "password": "your_password"
}
```
- **Success Response**: Same as register response

### User Profile
#### Get User Profile
- **URL**: `/accounts/profile/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: User profile data including organization details

#### Update User Profile
- **URL**: `/accounts/profile/`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "profile_picture": "file_upload"
}
```

### Organization Management
#### List Organizations
- **URL**: `/accounts/organizations/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Create Organization
- **URL**: `/accounts/organizations/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "name": "New Organization",
    "description": "Organization description",
    "subscription_plan": "FREE"
}
```

#### Get Organization Details
- **URL**: `/accounts/organizations/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Update Organization
- **URL**: `/accounts/organizations/{id}/`
- **Method**: `PUT`
- **Auth Required**: Yes

#### Invite Member
- **URL**: `/accounts/organizations/{id}/invite_member/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "email": "newmember@example.com",
    "role": "DEVELOPER"
}
```

## Workflow Management Routes

### AI Components
#### List Components
- **URL**: `/workflows/components/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Create Component
- **URL**: `/workflows/components/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "name": "Text Analysis",
    "description": "Analyzes text using NLP",
    "component_type": "PROCESS",
    "configuration_schema": {
        "input": {
            "type": "string",
            "required": true
        }
    }
}
```

### Workflows
#### List Workflows
- **URL**: `/workflows/workflows/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Create Workflow
- **URL**: `/workflows/workflows/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "name": "Text Processing Pipeline",
    "description": "Process and analyze text",
    "version": "1.0"
}
```

#### Get Workflow Details
- **URL**: `/workflows/workflows/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Add Component to Workflow
- **URL**: `/workflows/workflows/{id}/add_component/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "ai_component": 1,
    "position_x": 100,
    "position_y": 100,
    "configuration": {},
    "order": 1
}
```

#### Add Connection Between Components
- **URL**: `/workflows/workflows/{id}/add_connection/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "source_component": 1,
    "target_component": 2,
    "connection_type": "SUCCESS",
    "condition": null
}
```

#### Execute Workflow
- **URL**: `/workflows/workflows/{id}/execute/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: Input data for workflow execution

### Workflow Components
#### List Workflow Components
- **URL**: `/workflows/workflow-components/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Create Workflow Component
- **URL**: `/workflows/workflow-components/`
- **Method**: `POST`
- **Auth Required**: Yes

### Component Connections
#### List Connections
- **URL**: `/workflows/connections/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Create Connection
- **URL**: `/workflows/connections/`
- **Method**: `POST`
- **Auth Required**: Yes

### Workflow Execution
#### List Executions
- **URL**: `/workflows/executions/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Get Execution Details
- **URL**: `/workflows/executions/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes

## Response Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Notes
1. All POST/PUT requests should include `Content-Type: application/json` header
2. File uploads (like profile pictures) should use `multipart/form-data`
3. All authenticated requests must include the Authorization token header
4. Dates are returned in ISO 8601 format
5. All list endpoints support pagination 
from rest_framework import permissions

class IsOrganizationMember(permissions.BasePermission):
    """
    Custom permission to only allow members of an organization to access its objects.
    """
    def has_permission(self, request, view):
        return request.user and request.user.organization is not None

    def has_object_permission(self, request, view, obj):
        # Check if user belongs to the same organization as the object
        if hasattr(obj, 'created_by'):
            return obj.created_by.organization == request.user.organization
        elif hasattr(obj, 'organization'):
            return obj.organization == request.user.organization
        return False

class IsOrganizationAdmin(permissions.BasePermission):
    """
    Custom permission to only allow organization admins to perform certain actions.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_organization_admin

class IsWorkflowOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow workflow owners or organization admins to modify workflows.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.created_by.organization == request.user.organization
        return obj.created_by == request.user or request.user.is_organization_admin 
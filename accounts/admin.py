from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Organization, OrganizationInvite, APIKey

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'organization', 'role', 'is_organization_admin')
    list_filter = ('is_staff', 'is_active', 'role', 'organization')
    fieldsets = UserAdmin.fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role', 'is_organization_admin', 'phone_number')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role', 'is_organization_admin', 'phone_number')}),
    )

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'subscription_plan', 'is_active', 'created_at')
    list_filter = ('subscription_plan', 'is_active')
    search_fields = ('name',)

@admin.register(OrganizationInvite)
class OrganizationInviteAdmin(admin.ModelAdmin):
    list_display = ('email', 'organization', 'role', 'invited_by', 'is_accepted', 'created_at')
    list_filter = ('role', 'is_accepted', 'organization')
    search_fields = ('email', 'organization__name')

@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ('key_name', 'organization', 'created_by', 'is_active', 'created_at')
    list_filter = ('is_active', 'organization')
    search_fields = ('key_name', 'organization__name')

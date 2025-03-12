from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

class Organization(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    subscription_plan = models.CharField(max_length=50, choices=[
        ('FREE', 'Free Plan'),
        ('BASIC', 'Basic Plan'),
        ('PRO', 'Professional Plan'),
        ('ENTERPRISE', 'Enterprise Plan'),
    ], default='FREE')
    subscription_end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, related_name='members', null=True, blank=True)
    role = models.CharField(max_length=50, choices=[
        ('ADMIN', 'Administrator'),
        ('MANAGER', 'Manager'),
        ('DEVELOPER', 'Developer'),
        ('VIEWER', 'Viewer'),
    ], default='VIEWER')
    is_organization_admin = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email.split('@')[0]

class APIKey(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='api_keys')
    key_name = models.CharField(max_length=100)
    key_value = models.CharField(max_length=64, unique=True)
    created_by = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    allowed_ips = models.JSONField(default=list, blank=True, help_text="List of allowed IP addresses")

    def __str__(self):
        return f"{self.key_name} ({self.organization.name})"

class OrganizationInvite(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='invites')
    email = models.EmailField()
    invited_by = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='sent_invites')
    role = models.CharField(max_length=50, choices=[
        ('ADMIN', 'Administrator'),
        ('MANAGER', 'Manager'),
        ('DEVELOPER', 'Developer'),
        ('VIEWER', 'Viewer'),
    ])
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_accepted = models.BooleanField(default=False)
    accepted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Invite for {self.email} to {self.organization.name}"

class InformaticaCredentials(models.Model):
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  # This will be encrypted
    security_domain = models.CharField(max_length=255, blank=True, null=True)
    pod_url = models.URLField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = 'Informatica Credentials'
        verbose_name_plural = 'Informatica Credentials'

    def __str__(self):
        return f"Informatica credentials for {self.username}"

    def clean(self):
        if not self.pod_url:
            raise ValidationError("Pod URL is required")
        if not self.username:
            raise ValidationError("Username is required")
        if not self.password:
            raise ValidationError("Password is required")

from rest_framework import serializers
from .models import InformaticaCredentials, CustomUser, Organization, OrganizationInvite

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'confirm_password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'organization', 'role']
        read_only_fields = ['id', 'organization', 'role']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 
                 'profile_picture', 'organization', 'role', 'is_organization_admin']
        read_only_fields = ['id', 'email', 'organization', 'role', 'is_organization_admin']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'subscription_plan', 'subscription_end_date', 
                 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['id', 'created_at', 'updated_at']

class OrganizationInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationInvite
        fields = ['id', 'organization', 'email', 'role', 'token', 'created_at', 'expires_at', 
                 'is_accepted', 'accepted_at']
        read_only_fields = ['id', 'organization', 'token', 'created_at', 'expires_at', 
                          'is_accepted', 'accepted_at']

class InformaticaCredentialsSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = InformaticaCredentials
        fields = ['id', 'username', 'password', 'security_domain', 'pod_url', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'username': {'required': True},
            'password': {'required': True},
            'pod_url': {'required': True}
        } 
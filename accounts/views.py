from django.shortcuts import render, redirect
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
import uuid
from .models import Organization, OrganizationInvite, CustomUser, InformaticaCredentials
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    OrganizationSerializer, OrganizationInviteSerializer, UserSerializer,
    InformaticaCredentialsSerializer
)
from workflow_engine.permissions import IsOrganizationAdmin, IsOrganizationMember
from django.utils.decorators import method_decorator
from rest_framework.authentication import TokenAuthentication
from .informatica_cloud import get_informatica_api

# Create your views here.

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': UserProfileSerializer(user).data
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).delete()
            return Response({'message': 'Successfully logged out'})
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]

    def get_queryset(self):
        return Organization.objects.filter(members=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'invite_member']:
            return [IsAuthenticated(), IsOrganizationAdmin()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def invite_member(self, request, pk=None):
        organization = self.get_object()
        serializer = OrganizationInviteSerializer(data=request.data)
        if serializer.is_valid():
            # Generate unique token and set expiry
            token = str(uuid.uuid4())
            expires_at = timezone.now() + timedelta(days=7)
            
            invite = serializer.save(
                organization=organization,
                invited_by=request.user,
                token=token,
                expires_at=expires_at
            )
            # Here you would typically send an email with the invitation link
            # The link would include the token for verification
            return Response(OrganizationInviteSerializer(invite).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def accept_invite(self, request, pk=None):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invite = OrganizationInvite.objects.get(
                token=token,
                is_accepted=False,
                expires_at__gt=timezone.now()
            )
            request.user.organization = invite.organization
            request.user.role = invite.role
            request.user.save()
            
            invite.is_accepted = True
            invite.accepted_at = timezone.now()
            invite.save()
            
            return Response({'message': 'Successfully joined organization'})
        except OrganizationInvite.DoesNotExist:
            return Response({'error': 'Invalid or expired invite'}, status=status.HTTP_400_BAD_REQUEST)

class OrganizationInviteViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationInviteSerializer
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def get_queryset(self):
        return OrganizationInvite.objects.filter(organization__members=self.request.user)

    def perform_create(self, serializer):
        organization = self.request.user.organization
        token = str(uuid.uuid4())
        expires_at = timezone.now() + timedelta(days=7)
        
        serializer.save(
            organization=organization,
            invited_by=self.request.user,
            token=token,
            expires_at=expires_at
        )

    @action(detail=True, methods=['post'])
    def accept_invite(self, request, pk=None):
        invite = self.get_object()
        
        if invite.is_accepted:
            return Response({'error': 'Invite already accepted'}, status=status.HTTP_400_BAD_REQUEST)
            
        if invite.expires_at < timezone.now():
            return Response({'error': 'Invite has expired'}, status=status.HTTP_400_BAD_REQUEST)
            
        request.user.organization = invite.organization
        request.user.role = invite.role
        request.user.save()
        
        invite.is_accepted = True
        invite.accepted_at = timezone.now()
        invite.save()
        
        return Response({'message': 'Successfully joined organization'})

# Web Views
@csrf_protect
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                login(request, user)
                messages.success(request, 'Successfully logged in!')
                return redirect('dashboard')
            else:
                messages.error(request, 'Invalid password')
        except CustomUser.DoesNotExist:
            messages.error(request, 'User does not exist')
    return render(request, 'accounts/login.html')

@csrf_protect
def signup_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'accounts/signup.html')
            
        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'accounts/signup.html')
            
        user = CustomUser.objects.create_user(
            email=email,
            password=password
        )
        login(request, user)
        messages.success(request, 'Account created successfully!')
        return redirect('dashboard')
        
    return render(request, 'accounts/signup.html')

@login_required
def logout_view(request):
    logout(request)
    messages.info(request, 'Successfully logged out!')
    return redirect('login')

@login_required
def dashboard_view(request):
    return render(request, 'accounts/dashboard.html')

# API Views
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = CustomUser.objects.get(email=email)
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({
                'token': token.key,
                'user': serializer.data
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({
            'error': 'User does not exist'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_logout(request):
    request.user.auth_token.delete()
    return Response({
        'message': 'Successfully logged out'
    })

@method_decorator(csrf_exempt, name='dispatch')
class InformaticaCredentialsViewSet(viewsets.ModelViewSet):
    serializer_class = InformaticaCredentialsSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return InformaticaCredentials.objects.all()

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def get_credentials(self, request):
        try:
            credentials = InformaticaCredentials.objects.latest('created_at')
            serializer = self.get_serializer(credentials)
            return Response(serializer.data)
        except InformaticaCredentials.DoesNotExist:
            return Response(
                {'error': 'No credentials found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def get_connections(self, request):
        try:
            credentials = InformaticaCredentials.objects.latest('created_at')
            api = get_informatica_api(credentials)
            
            if not api:
                return Response(
                    {'error': 'Failed to initialize Informatica API'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            connections = api.get_connections()
            return Response({
                'connections': connections
            })
        except InformaticaCredentials.DoesNotExist:
            return Response(
                {'error': 'No credentials found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def test_connection(self, request):
        try:
            credentials = InformaticaCredentials.objects.latest('created_at')
            api = get_informatica_api(credentials)
            
            if not api:
                return Response(
                    {'error': 'Failed to initialize Informatica API'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            if api.test_connection():
                return Response({'message': 'Connection successful'})
            else:
                return Response(
                    {'error': 'Connection failed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except InformaticaCredentials.DoesNotExist:
            return Response(
                {'error': 'No credentials found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def create_connection(self, request):
        try:
            credentials = InformaticaCredentials.objects.latest('created_at')
            api = get_informatica_api(credentials)
            
            if not api:
                return Response(
                    {'error': 'Failed to initialize Informatica API'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            connection_data = {
                'name': request.data.get('name'),
                'type': request.data.get('type'),
                'description': request.data.get('description', '')
            }

            result = api.create_connection(connection_data)
            return Response(result)
        except InformaticaCredentials.DoesNotExist:
            return Response(
                {'error': 'No credentials found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

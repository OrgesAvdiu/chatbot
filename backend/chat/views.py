import os
import json
import time
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import StreamingHttpResponse
from openai import OpenAI
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer, ConversationDetailSerializer, UserSerializer
from .authentication import CsrfExemptSessionAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    login(request, user)
    
    return Response({
        'user': UserSerializer(user).data,
        'message': 'Registration successful'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current logged-in user"""
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversations_list_view(request):
    """List all conversations for current user"""
    conversations = Conversation.objects.filter(user=request.user)
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_detail_view(request, pk):
    """Get conversation with all messages"""
    try:
        # Admins can view any conversation, regular users can only view their own
        if request.user.is_staff:
            conversation = Conversation.objects.get(pk=pk)
        else:
            conversation = Conversation.objects.get(pk=pk, user=request.user)
        serializer = ConversationDetailSerializer(conversation)
        return Response(serializer.data)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def conversation_create_view(request):
    """Create a new conversation"""
    title = request.data.get('title', 'New Conversation')
    conversation = Conversation.objects.create(user=request.user, title=title)
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_view(request):
    """Admin dashboard - all conversations from all users"""
    conversations = Conversation.objects.all().select_related('user')
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    """
    Handle chat messages with streaming support. Receives user message, streams OpenAI response,
    saves both user and assistant messages to database.
    """
    try:
        user_message = request.data.get('message')
        conversation_id = request.data.get('conversation_id')
        
        if not user_message:
            return Response(
                {'error': 'Message field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create conversation
        if conversation_id:
            try:
                conversation = Conversation.objects.get(pk=conversation_id, user=request.user)
            except Conversation.DoesNotExist:
                return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Create new conversation with AI-generated title
            conversation = Conversation.objects.create(
                user=request.user,
                title=user_message[:50] + '...' if len(user_message) > 50 else user_message
            )
        
        # Save user message
        Message.objects.create(conversation=conversation, role='user', text=user_message)
        
        # Call OpenAI API
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return Response(
                {'error': 'OpenAI API key not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        client = OpenAI(api_key=api_key)
        
        # Retrieve chat history for this conversation
        messages_history = conversation.messages.all().values('role', 'text')
        formatted_history = [
            {'role': msg['role'], 'content': msg['text']} 
            for msg in messages_history
        ]
        
        # System prompt
        system_prompt = """You are an expert AI assistant specialized in technology, computer science, and programming.

Purpose:
Help users understand technical concepts, solve programming problems, and make informed software development decisions.

Capabilities:
- Explain concepts from beginner to advanced level
- Provide accurate, structured, and up-to-date explanations
- Write clean, readable, and well-commented code
- Support multiple programming languages (Python, Java, C#, JavaScript, SQL, etc.)
- Assist with:
  - Algorithms & data structures
  - Web & backend development
  - Databases & system design
  - APIs & architectures
  - DevOps, cloud computing, version control
  - Debugging and error analysis

Guidelines:
- Use simple language unless advanced detail is requested
- Avoid unnecessary jargon
- Always explain why, not just how
- Explain all code snippets clearly
- Provide real-world examples

Tone:
- Professional, friendly, supportive
- Clear, concise, educational

Restrictions:
- Do not provide incorrect or misleading information
- Do not assume user expertise"""
        
        # Generator function to stream response
        def stream_response():
            full_response = ""
            
            try:
                # Send conversation ID first
                yield f"data: {json.dumps({'conversation_id': conversation.id})}\n\n"
                
                # Stream OpenAI response
                stream = client.chat.completions.create(
                    model='gpt-4o-mini',
                    messages=[
                        {'role': 'system', 'content': system_prompt},
                        *formatted_history
                    ],
                    stream=True
                )
                
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        full_response += content
                        # Send chunk as Server-Sent Event
                        yield f"data: {json.dumps({'content': content})}\n\n"
                
                # Save assistant message after streaming is complete
                Message.objects.create(conversation=conversation, role='assistant', text=full_response)
                
                # Update conversation timestamp
                conversation.save()
                
                # Send done signal
                yield f"data: {json.dumps({'done': True})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        response = StreamingHttpResponse(
            stream_response(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

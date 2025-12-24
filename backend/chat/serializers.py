from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Message, Conversation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'role', 'text', 'created']
        read_only_fields = ['id', 'created']


class ConversationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'title', 'created', 'updated', 'message_count', 'last_message']
        read_only_fields = ['id', 'created', 'updated']
    
    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        return last_msg.text[:100] if last_msg else None


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'title', 'created', 'updated', 'messages']
        read_only_fields = ['id', 'created', 'updated']

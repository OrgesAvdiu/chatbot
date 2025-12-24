from django.contrib import admin
from .models import Message, Conversation


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'created', 'updated']
    list_filter = ['user', 'created']
    search_fields = ['title', 'user__username']
    readonly_fields = ['created', 'updated']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'role', 'text_preview', 'created']
    list_filter = ['role', 'created', 'conversation__user']
    search_fields = ['text', 'conversation__title']
    readonly_fields = ['created']
    
    def text_preview(self, obj):
        return obj.text[:100] + '...' if len(obj.text) > 100 else obj.text
    text_preview.short_description = 'Message'

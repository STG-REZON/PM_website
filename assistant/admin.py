from django.contrib import admin
from .models import FAQ, ChatSession, ChatMessage

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_active', 'views']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer', 'keywords']

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'created_at', 'last_active']
    readonly_fields = ['session_id', 'created_at', 'last_active']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'is_user', 'message', 'created_at']
    list_filter = ['is_user', 'created_at']
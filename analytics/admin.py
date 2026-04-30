from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Count
from datetime import datetime, timedelta
import json
from .models import PageView, SearchQuery, ChatAnalytics, UserSession


# ========================================
# ДАШБОРД АНАЛИТИКИ
# ========================================

def analytics_dashboard(request):
    today = datetime.now()
    last_30_days = today - timedelta(days=30)
    
    # Просмотры по дням
    views_by_day = PageView.objects.filter(
        created_at__gte=last_30_days
    ).extra({'day': "date(created_at)"}).values('day').annotate(count=Count('id')).order_by('day')
    
    # Поиски по дням
    searches_by_day = SearchQuery.objects.filter(
        created_at__gte=last_30_days
    ).extra({'day': "date(created_at)"}).values('day').annotate(count=Count('id')).order_by('day')
    
    # Чаты по дням
    chats_by_day = ChatAnalytics.objects.filter(
        created_at__gte=last_30_days
    ).extra({'day': "date(created_at)"}).values('day').annotate(count=Count('id')).order_by('day')
    
    # Источники ответов
    chat_sources = ChatAnalytics.objects.filter(
        created_at__gte=last_30_days
    ).values('response_source').annotate(count=Count('id'))
    
    # Популярные страницы
    popular_pages = PageView.objects.filter(
        created_at__gte=last_30_days
    ).values('page_url', 'page_title').annotate(count=Count('id')).order_by('-count')[:10]
    
    # Популярные поиски
    popular_searches = SearchQuery.objects.filter(
        created_at__gte=last_30_days
    ).values('query').annotate(count=Count('id')).order_by('-count')[:10]
    
    # Общая статистика
    total_views = PageView.objects.count()
    total_searches = SearchQuery.objects.count()
    total_chats = ChatAnalytics.objects.count()
    total_sessions = UserSession.objects.count()
    
    context = {
        'title': 'Дашборд аналитики',
        'views_by_day': json.dumps(list(views_by_day)),
        'searches_by_day': json.dumps(list(searches_by_day)),
        'chats_by_day': json.dumps(list(chats_by_day)),
        'chat_sources': json.dumps(list(chat_sources)),
        'popular_pages': popular_pages,
        'popular_searches': popular_searches,
        'total_views': total_views,
        'total_searches': total_searches,
        'total_chats': total_chats,
        'total_sessions': total_sessions,
    }
    
    return TemplateResponse(request, 'admin/analytics_dashboard.html', context)


# ========================================
# РЕГИСТРАЦИЯ МОДЕЛЕЙ
# ========================================

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ['page_url', 'created_at', 'ip_address']
    list_filter = ['created_at']
    search_fields = ['page_url', 'ip_address']
    readonly_fields = ['page_url', 'page_title', 'user_agent', 'ip_address', 'referer', 'session_id']
    
    def has_add_permission(self, request):
        return False


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ['query', 'results_count', 'created_at', 'ip_address']
    list_filter = ['created_at']
    search_fields = ['query', 'ip_address']
    readonly_fields = ['query', 'results_count', 'ip_address', 'session_id']
    
    def has_add_permission(self, request):
        return False


@admin.register(ChatAnalytics)
class ChatAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['user_message_short', 'response_source', 'response_time', 'created_at']
    list_filter = ['response_source', 'created_at']
    search_fields = ['user_message', 'bot_response']
    readonly_fields = ['session_id', 'user_message', 'bot_response', 'response_source', 'response_time']
    
    def user_message_short(self, obj):
        return obj.user_message[:50] + '...' if len(obj.user_message) > 50 else obj.user_message
    user_message_short.short_description = 'Сообщение'
    
    def has_add_permission(self, request):
        return False


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id_short', 'pages_viewed', 'first_visit', 'last_visit']
    list_filter = ['first_visit']
    readonly_fields = ['session_id', 'ip_address', 'user_agent', 'pages_viewed', 'first_visit', 'last_visit']
    
    def session_id_short(self, obj):
        return obj.session_id[:20]
    session_id_short.short_description = 'ID сессии'
    
    def has_add_permission(self, request):
        return False


# ========================================
# ДОБАВЛЯЕМ URL ДЛЯ ДАШБОРДА
# ========================================

original_get_urls = admin.site.get_urls

def get_urls():
    urls = original_get_urls()
    custom_urls = [
        path('analytics-dashboard/', admin.site.admin_view(analytics_dashboard), name='analytics_dashboard'),
    ]
    return custom_urls + urls

admin.site.get_urls = get_urls
# Добавляем кнопку в главное меню админки (простой способ)
admin.site.index_title = 'Панель управления'

from django.utils.safestring import mark_safe

# Переопределяем шаблон через дополнительный контекст
original_each_context = admin.site.each_context

def each_context(request):
    context = original_each_context(request)
    context['analytics_link'] = mark_safe(
        '<div style="margin: 20px 0; padding: 15px; background: #5B3A99; border-radius: 8px; text-align: center;">'
        '<a href="/admin/analytics-dashboard/" style="color: white; font-weight: bold; text-decoration: none; font-size: 16px;">'
        '📊 Перейти к дашборду аналитики'
        '</a>'
        '</div>'
    )
    return context

admin.site.each_context = each_context
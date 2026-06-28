import json
from datetime import timedelta
from urllib.parse import urlparse

from django.contrib import admin
from django.contrib.auth import logout
from django.db import connection
from django.db.models import Avg, Count
from django.db.models.functions import TruncDate, TruncHour
from django.shortcuts import redirect
from django.template.response import TemplateResponse
from django.urls import path
from django.utils import timezone

from .models import ChatAnalytics, PageView, SearchQuery, UserEvent, UserSession


def analytics_dashboard(request):
    now = timezone.now()
    last_30_days = now - timedelta(days=30)
    last_7_days = now - timedelta(days=7)

    views_30 = PageView.objects.filter(created_at__gte=last_30_days)
    searches_30 = SearchQuery.objects.filter(created_at__gte=last_30_days)
    chats_30 = ChatAnalytics.objects.filter(created_at__gte=last_30_days)
    events_table_ready = model_table_exists(UserEvent)
    events_30 = UserEvent.objects.filter(created_at__gte=last_30_days) if events_table_ready else UserEvent.objects.none()

    views_by_day = views_30.annotate(day=TruncDate('created_at')).values('day').annotate(count=Count('id')).order_by('day')
    searches_by_day = searches_30.annotate(day=TruncDate('created_at')).values('day').annotate(count=Count('id')).order_by('day')
    chats_by_day = chats_30.annotate(day=TruncDate('created_at')).values('day').annotate(count=Count('id')).order_by('day')
    events_by_day = events_30.annotate(day=TruncDate('created_at')).values('day').annotate(count=Count('id')).order_by('day')
    views_by_hour = views_30.annotate(hour=TruncHour('created_at')).values('hour').annotate(count=Count('id')).order_by('hour')

    popular_pages = views_30.values('page_url', 'page_title').annotate(count=Count('id')).order_by('-count')[:10]
    popular_searches = searches_30.values('query').annotate(count=Count('id')).order_by('-count')[:10]
    zero_searches = searches_30.filter(results_count=0).values('query').annotate(count=Count('id')).order_by('-count')[:10]
    popular_events = events_30.values('event_type', 'event_label').annotate(count=Count('id')).order_by('-count')[:12]
    search_clicks_30 = events_30.filter(event_type='search_result_click')
    search_result_clicks = search_clicks_30.values('event_label', 'target_url').annotate(count=Count('id')).order_by('-count')[:10]
    chat_sources = chats_30.values('response_source').annotate(count=Count('id')).order_by('-count')

    page_groups = group_pages(views_30)
    device_stats = group_user_agents(views_30, mode='device')
    browser_stats = group_user_agents(views_30, mode='browser')
    funnel_stats = build_funnel(views_30, events_30)

    avg_response_time = chats_30.aggregate(value=Avg('response_time'))['value'] or 0
    zero_search_count = searches_30.filter(results_count=0).count()
    total_searches_30 = searches_30.count()
    search_clicks_count = search_clicks_30.count()
    zero_search_rate = round((zero_search_count / total_searches_30) * 100, 1) if total_searches_30 else 0
    search_click_rate = round((search_clicks_count / total_searches_30) * 100, 1) if total_searches_30 else 0

    context = {
        'title': 'Панель аналитики',
        'views_by_day': json.dumps(format_date_rows(views_by_day, 'day')),
        'searches_by_day': json.dumps(format_date_rows(searches_by_day, 'day')),
        'chats_by_day': json.dumps(format_date_rows(chats_by_day, 'day')),
        'events_by_day': json.dumps(format_date_rows(events_by_day, 'day')),
        'views_by_hour': json.dumps(format_datetime_rows(views_by_hour, 'hour')),
        'chat_sources': json.dumps(list(chat_sources)),
        'page_groups_json': json.dumps(page_groups),
        'device_stats_json': json.dumps(device_stats),
        'browser_stats_json': json.dumps(browser_stats),
        'popular_pages': popular_pages,
        'popular_searches': popular_searches,
        'zero_searches': zero_searches,
        'popular_events': popular_events,
        'search_result_clicks': search_result_clicks,
        'page_groups': page_groups,
        'device_stats': device_stats,
        'browser_stats': browser_stats,
        'funnel_stats': funnel_stats,
        'total_views': PageView.objects.count(),
        'total_searches': SearchQuery.objects.count(),
        'total_chats': ChatAnalytics.objects.count(),
        'total_sessions': UserSession.objects.count(),
        'total_events': UserEvent.objects.count() if events_table_ready else 0,
        'events_7_days': UserEvent.objects.filter(created_at__gte=last_7_days).count() if events_table_ready else 0,
        'analytics_events_ready': events_table_ready,
        'avg_response_time': round(avg_response_time, 2),
        'zero_search_count': zero_search_count,
        'zero_search_rate': zero_search_rate,
        'search_clicks_count': search_clicks_count,
        'search_click_rate': search_click_rate,
    }

    return TemplateResponse(request, 'admin/analytics_dashboard.html', context)


def model_table_exists(model):
    return model._meta.db_table in connection.introspection.table_names()


def format_date_rows(rows, key):
    return [{'day': row[key].strftime('%d.%m') if row[key] else '', 'count': row['count']} for row in rows]


def format_datetime_rows(rows, key):
    return [{'hour': row[key].strftime('%d.%m %H:00') if row[key] else '', 'count': row['count']} for row in rows]


def group_pages(queryset):
    groups = {
        'Главная': 0,
        'Продукция': 0,
        'Услуги': 0,
        'Контакты': 0,
        'Документы': 0,
        'Новости': 0,
        'Другое': 0,
    }
    for item in queryset.values('page_url').annotate(count=Count('id')):
        path = urlparse(item['page_url']).path
        if path == '/':
            groups['Главная'] += item['count']
        elif path.startswith('/product'):
            groups['Продукция'] += item['count']
        elif path.startswith('/service'):
            groups['Услуги'] += item['count']
        elif path.startswith('/contacts'):
            groups['Контакты'] += item['count']
        elif path.startswith('/documents') or path.startswith('/instructions'):
            groups['Документы'] += item['count']
        elif path.startswith('/news'):
            groups['Новости'] += item['count']
        else:
            groups['Другое'] += item['count']
    return [{'name': name, 'count': count} for name, count in groups.items() if count]


def group_user_agents(queryset, mode):
    groups = {}
    for item in queryset.values('user_agent').annotate(count=Count('id')):
        name = detect_device(item['user_agent']) if mode == 'device' else detect_browser(item['user_agent'])
        groups[name] = groups.get(name, 0) + item['count']
    return [{'name': name, 'count': count} for name, count in sorted(groups.items(), key=lambda pair: pair[1], reverse=True)]


def detect_device(user_agent):
    ua = (user_agent or '').lower()
    if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
        return 'Mobile'
    if 'ipad' in ua or 'tablet' in ua:
        return 'Tablet'
    return 'Desktop'


def detect_browser(user_agent):
    ua = (user_agent or '').lower()
    if 'edg/' in ua:
        return 'Edge'
    if 'chrome/' in ua and 'chromium' not in ua:
        return 'Chrome'
    if 'firefox/' in ua:
        return 'Firefox'
    if 'safari/' in ua and 'chrome/' not in ua:
        return 'Safari'
    if 'opr/' in ua or 'opera' in ua:
        return 'Opera'
    return 'Other'


def build_funnel(views, events):
    home_sessions = set(views.filter(page_url='/').values_list('session_id', flat=True))
    product_sessions = set(views.filter(page_url__startswith='/product').values_list('session_id', flat=True))
    service_sessions = set(views.filter(page_url__startswith='/service').values_list('session_id', flat=True))
    contact_sessions = set(views.filter(page_url__startswith='/contacts').values_list('session_id', flat=True))
    phone_sessions = set(events.filter(event_type='phone_click').values_list('session_id', flat=True))

    return [
        {'name': 'Главная', 'count': len(home_sessions)},
        {'name': 'Продукция', 'count': len(product_sessions)},
        {'name': 'Услуги', 'count': len(service_sessions)},
        {'name': 'Контакты', 'count': len(contact_sessions)},
        {'name': 'Клик по телефону', 'count': len(phone_sessions)},
    ]


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ['page_url', 'page_title', 'created_at', 'ip_address']
    list_filter = ['created_at']
    search_fields = ['page_url', 'page_title', 'ip_address']
    readonly_fields = ['page_url', 'page_title', 'user_agent', 'ip_address', 'referer', 'session_id']

    def has_add_permission(self, request):
        return False


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ['query', 'results_count', 'created_at', 'ip_address']
    list_filter = ['created_at', 'results_count']
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
    list_filter = ['first_visit', 'last_visit']
    search_fields = ['session_id', 'ip_address']
    readonly_fields = ['session_id', 'ip_address', 'user_agent', 'pages_viewed', 'first_visit', 'last_visit']

    def session_id_short(self, obj):
        return obj.session_id[:20]
    session_id_short.short_description = 'ID сессии'

    def has_add_permission(self, request):
        return False


@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'event_label', 'page_url', 'target_url', 'created_at']
    list_filter = ['event_type', 'created_at']
    search_fields = ['event_type', 'event_label', 'page_url', 'target_url']
    readonly_fields = ['event_type', 'event_label', 'page_url', 'target_url', 'metadata', 'ip_address', 'session_id', 'user_agent']

    def has_add_permission(self, request):
        return False


original_get_urls = admin.site.get_urls


def admin_logout_redirect(request):
    logout(request)
    return redirect('/admin/login/')


def get_urls():
    urls = original_get_urls()
    custom_urls = [
        path('logout/', admin_logout_redirect, name='logout'),
        path('analytics-dashboard/', admin.site.admin_view(analytics_dashboard), name='analytics_dashboard'),
    ]
    return custom_urls + urls


admin.site.get_urls = get_urls

admin.site.site_header = 'PASCAL MEDICAL'
admin.site.site_title = 'PASCAL MEDICAL'
admin.site.index_title = 'Панель управления'

import json

from django.db import OperationalError, ProgrammingError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ChatAnalytics, SearchQuery, UserEvent


@csrf_exempt
@require_http_methods(["POST"])
def save_search(request):
    """Сохраняет поисковый запрос."""
    try:
        data = json.loads(request.body)
        query = data.get('query', '')[:500]
        results_count = int(data.get('results_count', 0) or 0)

        SearchQuery.objects.create(
            query=query,
            results_count=results_count,
            ip_address=get_client_ip(request),
            session_id=get_session_id(request),
        )

        return JsonResponse({'status': 'ok'})
    except Exception as exc:
        return JsonResponse({'status': 'error', 'message': str(exc)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_event(request):
    """Сохраняет клики и важные действия пользователя."""
    try:
        data = json.loads(request.body)

        UserEvent.objects.create(
            event_type=data.get('event_type', '')[:80],
            event_label=data.get('event_label', '')[:500],
            page_url=data.get('page_url', '')[:500],
            target_url=data.get('target_url', '')[:500],
            metadata=data.get('metadata') if isinstance(data.get('metadata'), dict) else {},
            ip_address=get_client_ip(request),
            session_id=get_session_id(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
        )

        return JsonResponse({'status': 'ok'})
    except (OperationalError, ProgrammingError):
        return JsonResponse({'status': 'skipped', 'reason': 'events_table_missing'})
    except Exception as exc:
        return JsonResponse({'status': 'error', 'message': str(exc)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_chat(request):
    """Сохраняет аналитику чата."""
    try:
        data = json.loads(request.body)

        ChatAnalytics.objects.create(
            session_id=data.get('session_id', '')[:100],
            user_message=data.get('user_message', '')[:1000],
            bot_response=data.get('bot_response', '')[:2000],
            response_source=data.get('response_source', '')[:50],
            response_time=data.get('response_time', 0) or 0,
        )

        return JsonResponse({'status': 'ok'})
    except Exception as exc:
        return JsonResponse({'status': 'error', 'message': str(exc)}, status=500)


def get_session_id(request):
    if not request.session.session_key:
        request.session.save()
    return request.session.session_key or request.COOKIES.get('sessionid', '')


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')

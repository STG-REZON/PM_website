import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import SearchQuery, ChatAnalytics


@csrf_exempt
@require_http_methods(["POST"])
def save_search(request):
    """API для сохранения поискового запроса"""
    try:
        data = json.loads(request.body)
        query = data.get('query', '')[:500]
        results_count = data.get('results_count', 0)
        
        session_id = request.COOKIES.get('sessionid', '')
        
        SearchQuery.objects.create(
            query=query,
            results_count=results_count,
            ip_address=get_client_ip(request),
            session_id=session_id
        )
        
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_chat(request):
    """API для сохранения аналитики чата"""
    try:
        data = json.loads(request.body)
        
        session_id = data.get('session_id', '')
        user_message = data.get('user_message', '')[:1000]
        bot_response = data.get('bot_response', '')[:2000]
        response_source = data.get('response_source', '')
        response_time = data.get('response_time', 0)
        
        ChatAnalytics.objects.create(
            session_id=session_id,
            user_message=user_message,
            bot_response=bot_response,
            response_source=response_source,
            response_time=response_time
        )
        
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def get_client_ip(request):
    """Получение IP адреса пользователя"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
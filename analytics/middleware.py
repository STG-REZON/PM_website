from .models import PageView, UserSession

class AnalyticsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Игнорируем админку, статику и API
        ignored_paths = ['/admin/', '/static/', '/media/', '/assistant/', '/analytics/']
        for path in ignored_paths:
            if request.path.startswith(path):
                return response
        
        # Получаем или создаём сессию
        session_id = request.session.session_key
        if not session_id:
            request.session.save()
            session_id = request.session.session_key
        
        # Обновляем сессию пользователя
        user_session, created = UserSession.objects.get_or_create(session_id=session_id)
        user_session.pages_viewed += 1
        user_session.ip_address = get_client_ip(request)
        user_session.user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        user_session.save()
        
        # Сохраняем просмотр страницы
        PageView.objects.create(
            page_url=request.path,
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            ip_address=get_client_ip(request),
            referer=request.META.get('HTTP_REFERER', '')[:500],
            session_id=session_id
        )
        
        return response


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
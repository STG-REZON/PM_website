import json
import time

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from analytics.models import ChatAnalytics
from assistant.models import ChatMessage, ChatSession, FAQ
from assistant.services.chat_engine import chat_engine


def get_suggestions(message: str) -> list[dict[str, str]]:
    message_lower = message.lower()

    if any(w in message_lower for w in ['шприц', 'игла']):
        return [
            {'question': 'Какие бывают иглы?', 'category': 'Продукция'},
            {'question': 'Какой срок годности?', 'category': 'Продукция'},
            {'question': 'Что такое трёхкомпонентный шприц?', 'category': 'Продукция'},
        ]
    if any(w in message_lower for w in ['цен', 'стоим']):
        return [
            {'question': 'Как узнать актуальные цены?', 'category': 'Покупка'},
            {'question': 'Есть ли оптовые скидки?', 'category': 'Покупка'},
            {'question': 'Как получить прайс-лист?', 'category': 'Покупка'},
        ]
    if 'доставк' in message_lower:
        return [
            {'question': 'Сколько стоит доставка?', 'category': 'Доставка'},
            {'question': 'Какие ТК работают?', 'category': 'Доставка'},
            {'question': 'Можно самовывоз?', 'category': 'Доставка'},
        ]

    return [
        {'question': 'Какие шприцы вы производите?', 'category': 'Продукция'},
        {'question': 'Где купить продукцию?', 'category': 'Покупка'},
        {'question': 'Есть ли доставка?', 'category': 'Доставка'},
        {'question': 'Как получить сертификаты?', 'category': 'Документы'},
    ]


def _detect_response_source(user_message: str, answer: str) -> str:
    if FAQ.objects.filter(is_active=True, question__icontains=user_message[:80]).exists():
        return 'faq'
    if answer and 'info@pascal-med.ru' not in answer:
        return 'ai'
    return 'fallback'


@csrf_exempt
@require_http_methods(["POST"])
def chat_api(request):
    start_time = time.time()

    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', '')

        if not user_message:
            return JsonResponse({'error': 'Сообщение не может быть пустым'}, status=400)

        answer = chat_engine.get_response(user_message, session_id)

        if session_id:
            session, _ = ChatSession.objects.get_or_create(session_id=session_id)
            ChatMessage.objects.create(session=session, is_user=True, message=user_message[:500])
            ChatMessage.objects.create(session=session, is_user=False, message=answer[:500])

        ChatAnalytics.objects.create(
            session_id=session_id or 'anonymous',
            user_message=user_message[:1000],
            bot_response=answer[:2000],
            response_source=_detect_response_source(user_message, answer),
            response_time=round(time.time() - start_time, 2),
        )

        return JsonResponse(
            {
                'answer': answer,
                'suggestions': get_suggestions(user_message),
                'status': 'success',
            }
        )
    except Exception as e:
        return JsonResponse({'error': str(e), 'status': 'error'}, status=500)


def get_faq_list(request):
    faqs = FAQ.objects.filter(is_active=True).values('id', 'question', 'category')
    return JsonResponse(list(faqs), safe=False)

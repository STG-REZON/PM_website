import json
import re
import time
import requests
from difflib import SequenceMatcher
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import FAQ, ChatSession, ChatMessage


# ========================================
# РАСШИРЕННАЯ БАЗА ЗНАНИЙ
# ========================================

KNOWLEDGE_BASE = {
    'шприцы': {
        'keywords': ['шприц', 'шприцы', 'объем', 'размер', 'какой шприц', 'какие шприцы', '1 мл', '2 мл', '3 мл', '5 мл', '10 мл', '20 мл'],
        'answer': '''🩸 **НАШИ ШПРИЦЫ:**

| Объем | Игла | Применение |
|-------|------|------------|
| 1 мл | 27G | Инъекции малых доз, инсулин |
| 2 мл | 23G | Универсальный, вакцинация |
| 3 мл | 22G | Стандартные инъекции |
| 5 мл | 22G | Вязкие растворы |
| 10 мл | 21G | Большие объёмы |
| 20 мл | 21G | Инфузии, промывания |

✅ **Характеристики:**
• Трехкомпонентные (цилиндр + поршень + манжета)
• Стерильные, индивидуальная упаковка
• Силиконовое покрытие поршня
• Соответствуют ГОСТ ISO 7886-1
• Срок годности: 5 лет

💉 **Также есть:** инсулиновые шприцы (U-100) и шприцы с двумя иглами'''
    },
    'инсулин': {
        'keywords': ['инсулин', 'инсулиновый', 'диабет', 'u-100', 'инсулиновый шприц'],
        'answer': '''💉 **ИНСУЛИНОВЫЕ ШПРИЦЫ:**

• **Объём:** 1 мл (100 ЕД)
• **Шкала:** U-100 (калибровка в единицах)
• **Игла:** 27G (0,4×13 мм) или 29G
• **Тип соединения:** Луер-слип

✅ **Особенности:**
• Тонкая игла для безболезненных инъекций
• Чёткая градуировка
• Стерильный, индивидуальная упаковка
• Цветовая кодировка колпачка

📦 Упаковка: 100 штук/коробка'''
    },
    'иглы': {
        'keywords': ['игла', 'иглы', 'размер иглы', 'gauge', 'канюля', 'толщина иглы'],
        'answer': '''🪡 **НАШИ ИГЛЫ (размеры):**

| Размер (G) | Диаметр (мм) | Применение |
|------------|--------------|------------|
| 18G | 1.2 мм | Толстые, для вязких растворов |
| 21G | 0.8 мм | Стандартные, внутримышечно |
| 22G | 0.7 мм | Тонкие, внутривенно |
| 23G | 0.6 мм | Очень тонкие, подкожно |
| 24G | 0.55 мм | Детские |
| 27G | 0.4 мм | Инсулиновые |

✅ **Характеристики:**
• Стерильные и нестерильные
• Трехгранная заточка (атравматичная)
• Силиконовое покрытие
• Цветовая кодировка по стандарту ГОСТ Р ИСО 6009
• Материал канюли: нержавеющая сталь AISI 304

📦 **Длина игл:** 13 мм, 25 мм, 30 мм, 40 мм'''
    },
    'где купить': {
        'keywords': ['купить', 'приобрести', 'заказать', 'цена', 'стоимость', 'где купить', 'магазин', 'маркетплейс', 'оптом'],
        'answer': '''🛒 **ГДЕ КУПИТЬ НАШУ ПРОДУКЦИЮ:**

🏪 **Интернет-магазины (розница):**
• Яндекс Маркет
• Сбер Аптека
• Аптека.ру
• Здравсити

🏢 **Дистрибьюторы (опт):**
• Авеста Фармацевтика
• Катрен
• Шаклин (Сибирь и ДВ)
• Магнит Фарма

📦 **Прямые продажи:**
• Самовывоз со склада (г. Дубна)
• Отгрузка транспортными компаниями

📞 **Отдел продаж:** +7 495 150 20 80
✉️ **Email:** info@pascal-med.ru

💰 Для получения актуального прайс-листа свяжитесь с нашими менеджерами!'''
    },
    'доставка': {
        'keywords': ['доставка', 'отправка', 'получение', 'тк', 'почта', 'транспорт', 'перевозка', 'самовывоз', 'курьер'],
        'answer': '''🚚 **ДОСТАВКА ПО РОССИИ:**

📦 **Способы доставки:**
• **Транспортные компании:** Деловые линии, ПЭК, КИТ, ЖелДорЭкспедиция
• **Почта России** (для малых партий)
• **Самовывоз:** г. Дубна, ул. Электронная, д. 8, к. 1

📍 **Наш склад:**
141981, Московская обл., г. Дубна, ул. Электронная, д. 8, к. 1

⏱ **Сроки доставки:**
• Москва и область: 1-2 дня
• Регионы: 3-10 дней (зависит от ТК)

💰 **Стоимость:** рассчитывается индивидуально
📞 Для расчёта стоимости позвоните менеджерам!

🚛 **Оптовые заказы:** отправка ТК по всей России'''
    },
    'документы': {
        'keywords': ['документ', 'сертификат', 'регистрация', 'разрешение', 'рз', 'декларация', 'гост', 'исо', 'удостоверение'],
        'answer': '''📄 **ДОКУМЕНТАЦИЯ И СЕРТИФИКАТЫ:**

📁 **На сайте (раздел "Документы"):**
• Регистрационные удостоверения (РЗ)
• Сертификаты соответствия
• Декларации о соответствии
• Паспорта качества

🏅 **Система качества:**
• ISO 13485 (медицинские изделия)
• GMP (надлежащая производственная практика)
• ГОСТ ISO 7886-1 (шприцы инъекционные)

📎 **Как получить документы:**
1. Скачать на странице "Документы"
2. Запросить по email: info@pascal-med.ru
3. Запросить по телефону: +7 495 150 20 80

📋 **Каждая партия сопровождается:**
• Паспортом качества
• Сертификатом соответствия
• Протоколом испытаний'''
    },
    'вакансии': {
        'keywords': ['вакансия', 'работа', 'сотрудник', 'устроиться', 'резюме', 'hr', 'карьера', 'трудоустройство'],
        'answer': '''💼 **ТЕКУЩИЕ ВАКАНСИИ:**

👷 **Упаковщик** (сменный график 2/2)
• Зарплата: от 40 000 ₽
• Оформление по ТК РФ
• Полный соцпакет

⚙️ **Оператор производственной линии** (5/2)
• Зарплата: от 50 000 ₽
• Обучение на рабочем месте
• Оформление по ТК РФ

🔧 **Механик** (5/2)
• Зарплата: от 60 000 ₽
• Обслуживание оборудования
• Опыт от 2 лет

📞 **Контакт:** Янчук Елена Анатольевна
📞 **Телефон:** +7 495 150 20 80 (доб. 111)
🕐 **Время:** 10:00 - 14:00
✉️ **Email:** e.yanchuk@pascal-med.ru

📍 **Место работы:** г. Дубна, ОЭЗ "Дубна"'''
    },
    'контакты': {
        'keywords': ['контакт', 'телефон', 'email', 'адрес', 'связаться', 'позвонить', 'написать', 'отдел продаж', 'поддержка'],
        'answer': '''📞 **НАШИ КОНТАКТЫ:**

🏢 **Юридический и фактический адрес:**
141981, РФ, Московская обл., г. Дубна, ул. Электронная, д. 8, к. 1

📞 **Телефоны:**
• Основной: +7 495 150 20 80
• Отдел продаж: +7 495 150 20 80 (доб. 111)
• Бухгалтерия: +7 495 150 20 80 (доб. 112)

📧 **Email:**
• Общие вопросы: info@pascal-med.ru
• Отдел продаж: sales@pascal-med.ru
• Кадры: hr@pascal-med.ru
• Бухгалтерия: accounting@pascal-med.ru

🕐 **Режим работы:**
• ПН-ПТ: 9:00 - 18:00
• СБ-ВС: выходной

💬 **Мы в соцсетях:**
• Rutube: @pascal_medical

📱 **Мессенджеры:** +7 495 150 20 80 (WhatsApp, Telegram)'''
    }
}


# ========================================
# ИНТЕГРАЦИЯ С YANDEX GPT
# ========================================

class YandexGPT:
    """Интеграция с Yandex GPT через API"""
    
    def __init__(self):
        # ТВОИ ДАННЫЕ ДЛЯ YANDEX GPT
        self.api_key = "AQVN3uYFXuX2rL15c0lb-9RAynzH6604FTQ8uB-p"  # ← ТВОЙ API-КЛЮЧ
        self.folder_id = "b1gnol3luvnsj5d3bjk3"                 # ← ТВОЙ FOLDER ID (default)
        self.use_ai = True  # Включаем ИИ - меняй на False если хочешь отключить
    
    def get_response(self, message):
        """Отправка запроса в Yandex GPT"""
        if not self.use_ai:
            return None
        
        url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
        headers = {
            "Authorization": f"Api-Key {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Системный промпт - настройки для ассистента
        system_prompt = """Ты - виртуальный ассистент компании Pascal Medical (производство медицинских изделий). 
Отвечай кратко, по делу, дружелюбно. Используй эмодзи. Не выдумывай информацию.
Если не знаешь ответа - предложи связаться с поддержкой +7 495 150 20 80 или info@pascal-med.ru"""
        
        data = {
            "modelUri": f"gpt://{self.folder_id}/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.6,
                "maxTokens": 500
            },
            "messages": [
                {"role": "system", "text": system_prompt},
                {"role": "user", "text": message}
            ]
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                return result['result']['alternatives'][0]['message']['text']
            else:
                print(f"Yandex GPT error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Yandex GPT error: {e}")
        
        return None


# ========================================
# УМНЫЙ ДВИЖОК ЧАТА
# ========================================

class SmartChatEngine:
    """Гибридный движок чата: сначала своя база, потом ИИ"""
    
    def __init__(self):
        self.context = {}
        self.yandex_gpt = YandexGPT()
    
    def get_response(self, message, session_id=None):
        """Главный метод получения ответа"""
        message_lower = message.lower()
        
        # 1. Поиск в расширенной базе знаний
        response = self.search_knowledge_base(message_lower)
        if response:
            return response
        
        # 2. Поиск в FAQ из базы данных
        response = self.search_faq(message_lower)
        if response:
            return response
        
        # 3. Распознавание намерений (intent detection)
        intent = self.detect_intent(message_lower)
        if intent:
            return self.get_intent_response(intent)
        
        # 4. Контекстный ответ
        if session_id and session_id in self.context:
            response = self.get_context_response(session_id, message_lower)
            if response:
                return response
        
        # 5. ИИ-ответ (если не нашли в своей базе)
        response = self.yandex_gpt.get_response(message)
        if response:
            return response
        
        # 6. Fallback ответ
        return self.get_fallback_response(message_lower)
    
    def search_knowledge_base(self, message):
        """Поиск по расширенной базе знаний"""
        best_match = None
        best_score = 0
        
        for key, data in KNOWLEDGE_BASE.items():
            for keyword in data['keywords']:
                if keyword in message:
                    score = len(keyword) / max(1, len(message)) * 10
                    if message == keyword or message.startswith(keyword):
                        score += 5
                    if score > best_score and score > 3:
                        best_score = score
                        best_match = data['answer']
        
        return best_match
    
    def search_faq(self, message):
        """Поиск в FAQ из базы данных"""
        faqs = FAQ.objects.filter(is_active=True)
        best_match = None
        best_score = 0
        
        for faq in faqs:
            if faq.question.lower() in message or message in faq.question.lower():
                score = 0.8
            else:
                score = SequenceMatcher(None, message, faq.question.lower()).ratio()
            
            if faq.keywords:
                keywords = [k.strip().lower() for k in faq.keywords.split(',')]
                for keyword in keywords:
                    if keyword in message:
                        score += 0.3
            
            if score > best_score and score > 0.35:
                best_score = score
                best_match = faq
        
        if best_match:
            best_match.views += 1
            best_match.save(update_fields=['views'])
            return best_match.answer
        
        return None
    
    def detect_intent(self, message):
        """Распознавание намерений"""
        intents = {
            'greeting': ['привет', 'здравствуй', 'добрый день', 'доброе утро', 'хай', 'прив', 'здрасте'],
            'thanks': ['спасиб', 'благодар', 'отлично', 'супер', 'класс', 'хорошо'],
            'bye': ['пока', 'до свидания', 'всего доброго', 'удачи', 'покеда'],
            'help': ['помощь', 'help', 'что ты умеешь', 'возможности'],
            'price': ['цена', 'стоимость', 'почём', 'сколько стоит', 'прайс'],
            'catalog': ['каталог', 'ассортимент', 'список', 'что есть', 'продукция'],
            'time': ['время работы', 'режим', 'часы работы', 'когда открыто'],
        }
        
        for intent, keywords in intents.items():
            for keyword in keywords:
                if keyword in message:
                    return intent
        return None
    
    def get_intent_response(self, intent):
        """Ответы на основе намерений"""
        responses = {
            'greeting': '👋 **Здравствуйте!** Я виртуальный помощник **Pascal Medical** с поддержкой ИИ.\n\nЧем могу помочь?\n\n• 💉 **Какие шприцы вы производите?**\n• 🛒 **Где купить продукцию?**\n• 🚚 **Есть ли доставка?**\n• 📄 **Как получить документы?**\n• 💼 **Есть ли вакансии?**\n\n✨ **Или просто задайте вопрос своими словами!**',
            'thanks': '😊 **Пожалуйста!** Обращайтесь, если нужна помощь!',
            'bye': '👋 **До свидания!** Хорошего дня и крепкого здоровья!',
            'help': '🤖 **Я умею отвечать на вопросы о:**\n\n• продукции (шприцы, иглы)\n• ценах и покупке\n• доставке\n• документах\n• вакансиях\n\n✨ **Задайте вопрос своими словами!**',
            'price': '💰 Цены зависят от объёма заказа. Свяжитесь с отделом продаж:\n\n📞 +7 495 150 20 80\n✉️ sales@pascal-med.ru',
            'catalog': '📋 **Каталог продукции** в разделе "Продукция" на сайте.\n\nОсновное: шприцы 1-20 мл, иглы, инсулиновые шприцы, инфузионные системы.',
            'time': '🕐 **Режим работы:** ПН-ПТ 9:00-18:00\n\nВ выходные оставьте заявку - свяжемся!'
        }
        return responses.get(intent)
    
    def get_context_response(self, session_id, message):
        """Контекстный ответ"""
        context = self.context.get(session_id, {})
        last_topic = context.get('last_topic')
        
        if last_topic:
            if 'цена' in message or 'сколько' in message:
                return self.get_intent_response('price')
            if 'купить' in message:
                return KNOWLEDGE_BASE.get('где купить', {}).get('answer')
            if 'адрес' in message or 'где' in message:
                return KNOWLEDGE_BASE.get('контакты', {}).get('answer')
        
        return None
    
    def get_fallback_response(self, message):
        """Ответ по умолчанию"""
        if '?' in message:
            return "🤔 **Не совсем понял вопрос.**\n\nПопробуйте переформулировать или обратитесь по телефону **+7 495 150 20 80**"
        else:
            return "🙋 **Задайте вопрос!**\n\nНапример:\n• 💉 **Какие шприцы?**\n• 🛒 **Где купить?**\n• 🚚 **Доставка?**\n• 📄 **Сертификаты?**"


# Создаём экземпляр умного движка
chat_engine = SmartChatEngine()


# ========================================
# ВЬЮХИ (VIEWS)
# ========================================

def assistant_page(request):
    """Страница с ассистентом"""
    return render(request, 'assistant/assistant.html')


def get_widget(request):
    """Виджет чата для вставки на страницы"""
    return render(request, 'assistant/widget.html')


@csrf_exempt
@require_http_methods(["POST"])
def chat_api(request):
    """API для обработки сообщений"""
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', '')
        
        if not user_message:
            return JsonResponse({'error': 'Сообщение не может быть пустым'}, status=400)
        
        # Получаем ответ
        answer = chat_engine.get_response(user_message, session_id)
        
        # Сохраняем в БД
        if session_id:
            session, _ = ChatSession.objects.get_or_create(session_id=session_id)
            ChatMessage.objects.create(session=session, is_user=True, message=user_message[:500])
            ChatMessage.objects.create(session=session, is_user=False, message=answer[:500])
        
        # Предложения
        suggestions = get_suggestions(user_message)
        
        return JsonResponse({
            'answer': answer,
            'suggestions': suggestions,
            'status': 'success'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e), 'status': 'error'}, status=500)


def get_suggestions(message):
    """Предлагает похожие вопросы"""
    message_lower = message.lower()
    
    if any(w in message_lower for w in ['шприц', 'игла']):
        return [
            {'question': 'Какие бывают иглы?', 'category': 'Продукция'},
            {'question': 'Какой срок годности?', 'category': 'Продукция'},
            {'question': 'Что такое трёхкомпонентный шприц?', 'category': 'Продукция'}
        ]
    elif any(w in message_lower for w in ['цен', 'стоим']):
        return [
            {'question': 'Как узнать актуальные цены?', 'category': 'Покупка'},
            {'question': 'Есть ли оптовые скидки?', 'category': 'Покупка'},
            {'question': 'Как получить прайс-лист?', 'category': 'Покупка'}
        ]
    elif any(w in message_lower for w in ['доставк']):
        return [
            {'question': 'Сколько стоит доставка?', 'category': 'Доставка'},
            {'question': 'Какие ТК работают?', 'category': 'Доставка'},
            {'question': 'Можно самовывоз?', 'category': 'Доставка'}
        ]
    else:
        return [
            {'question': 'Какие шприцы вы производите?', 'category': 'Продукция'},
            {'question': 'Где купить продукцию?', 'category': 'Покупка'},
            {'question': 'Есть ли доставка?', 'category': 'Доставка'},
            {'question': 'Как получить сертификаты?', 'category': 'Документы'}
        ]


def get_faq_list(request):
    """API для получения списка FAQ"""
    faqs = FAQ.objects.filter(is_active=True).values('id', 'question', 'category')
    return JsonResponse(list(faqs), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def chat_api(request):
    """API для обработки сообщений чата"""
    start_time = time.time()  # ← ЗАМЕРЯЕМ ВРЕМЯ ОТВЕТА
    
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', '')
        
        if not user_message:
            return JsonResponse({'error': 'Сообщение не может быть пустым'}, status=400)
        
        # Получаем ответ от умного движка
        answer = chat_engine.get_response(user_message, session_id)
        
        # Сохраняем в БД чата
        if session_id:
            session, created = ChatSession.objects.get_or_create(session_id=session_id)
            ChatMessage.objects.create(
                session=session,
                is_user=True,
                message=user_message[:500]
            )
            ChatMessage.objects.create(
                session=session,
                is_user=False,
                message=answer[:500]
            )
        
        # ========================================
        # СОХРАНЯЕМ В АНАЛИТИКУ
        # ========================================
        response_time = time.time() - start_time
        
        # Определяем источник ответа
        response_source = 'fallback'
        
        # Проверяем, из какого источника пришёл ответ
        if any(word in answer for word in ['🩸 **НАШИ ШПРИЦЫ:**', '🪡 **НАШИ ИГЛЫ**', '🚚 **ДОСТАВКА**']):
            response_source = 'knowledge_base'
        elif 'база знаний' in answer.lower() or 'вопрос' in answer.lower():
            response_source = 'knowledge_base'
        elif any(faq.question in user_message for faq in FAQ.objects.filter(is_active=True)[:10]):
            response_source = 'faq'
        elif 'yandex' in str(answer).lower() or 'GPT' in str(answer):
            response_source = 'ai'
        else:
            response_source = 'fallback'
        
        # Отправляем данные в аналитику
        try:
            import requests as http_requests
            analytics_url = '/analytics/api/chat/'
            full_url = f"http://127.0.0.1:8000{analytics_url}" if not request.is_secure() else f"https://{request.get_host()}{analytics_url}"
            
            # Используем внутренний запрос
            from django.test import RequestFactory
            from analytics.views import save_chat
            
            # Создаём фейковый запрос
            rf = RequestFactory()
            fake_request = rf.post('/analytics/api/chat/', data={
                'session_id': session_id or '',
                'user_message': user_message,
                'bot_response': answer,
                'response_source': response_source,
                'response_time': round(response_time, 2)
            }, content_type='application/json')
            fake_request.COOKIES = request.COOKIES
            fake_request.META = request.META
            
            # Вызываем функцию сохранения
            save_chat(fake_request)
            
        except Exception as e:
            print(f"Analytics save error: {e}")
        # ========================================
        
        # Получаем предложения
        suggestions = get_suggestions(user_message)
        
        return JsonResponse({
            'answer': answer,
            'suggestions': suggestions,
            'status': 'success'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e), 'status': 'error'}, status=500)
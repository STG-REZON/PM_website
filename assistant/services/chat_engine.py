from difflib import SequenceMatcher

import requests
from django.conf import settings

from assistant.models import FAQ


FALLBACK_RESPONSE = (
    "Не удалось точно определить запрос. "
    "Уточните вопрос или свяжитесь с нами: +7 495 150 20 80, info@pascal-med.ru"
)


class YandexGPT:
    def __init__(self) -> None:
        self.api_key = settings.YANDEX_API_KEY
        self.folder_id = settings.YANDEX_FOLDER_ID
        self.use_ai = bool(self.api_key and self.folder_id)

    def get_response(self, message: str) -> str | None:
        if not self.use_ai:
            return None

        url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
        headers = {
            "Authorization": f"Api-Key {self.api_key}",
            "Content-Type": "application/json",
        }
        data = {
            "modelUri": f"gpt://{self.folder_id}/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.6,
                "maxTokens": 500,
            },
            "messages": [
                {
                    "role": "system",
                    "text": (
                        "Ты виртуальный ассистент компании Pascal Medical. "
                        "Отвечай кратко, вежливо, без выдуманных фактов."
                    ),
                },
                {"role": "user", "text": message},
            ],
        }

        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            if response.status_code != 200:
                return None
            result = response.json()
            return result["result"]["alternatives"][0]["message"]["text"]
        except Exception:
            return None


class SmartChatEngine:
    def __init__(self) -> None:
        self.yandex_gpt = YandexGPT()

    def search_faq(self, message: str) -> str | None:
        faqs = FAQ.objects.filter(is_active=True)
        best_match = None
        best_score = 0.0

        for faq in faqs:
            question = faq.question.lower()
            if question in message or message in question:
                score = 0.8
            else:
                score = SequenceMatcher(None, message, question).ratio()

            if faq.keywords:
                keywords = [k.strip().lower() for k in faq.keywords.split(',') if k.strip()]
                if any(keyword in message for keyword in keywords):
                    score += 0.3

            if score > best_score and score > 0.35:
                best_match = faq
                best_score = score

        if not best_match:
            return None

        best_match.views += 1
        best_match.save(update_fields=["views"])
        return best_match.answer

    def get_response(self, message: str, session_id: str | None = None) -> str:
        message_lower = message.lower().strip()

        faq_answer = self.search_faq(message_lower)
        if faq_answer:
            return faq_answer

        ai_answer = self.yandex_gpt.get_response(message)
        if ai_answer:
            return ai_answer

        return FALLBACK_RESPONSE


chat_engine = SmartChatEngine()

import json

from django.test import TestCase
from django.urls import reverse

from analytics.models import ChatAnalytics
from assistant.models import FAQ


class AssistantApiTests(TestCase):
    def setUp(self):
        FAQ.objects.create(
            question='Какие шприцы есть?',
            answer='Есть шприцы 1, 2, 5, 10, 20 мл',
            keywords='шприцы,продукция',
            is_active=True,
        )

    def test_chat_api_returns_success(self):
        response = self.client.post(
            reverse('assistant:chat_api'),
            data=json.dumps({'message': 'Какие шприцы есть?', 'session_id': 'test-session'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload['status'], 'success')
        self.assertIn('answer', payload)
        self.assertTrue(ChatAnalytics.objects.exists())

    def test_chat_api_validates_empty_message(self):
        response = self.client.post(
            reverse('assistant:chat_api'),
            data=json.dumps({'message': '   '}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

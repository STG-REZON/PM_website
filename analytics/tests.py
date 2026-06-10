import json

from django.test import TestCase
from django.urls import reverse

from .models import ChatAnalytics, SearchQuery, UserEvent


class AnalyticsApiTests(TestCase):
    def test_save_search(self):
        response = self.client.post(
            reverse('analytics:save_search'),
            data=json.dumps({'query': 'шприцы', 'results_count': 5}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SearchQuery.objects.count(), 1)

    def test_save_chat(self):
        response = self.client.post(
            reverse('analytics:save_chat'),
            data=json.dumps(
                {
                    'session_id': 'test-session',
                    'user_message': 'Привет',
                    'bot_response': 'Здравствуйте',
                    'response_source': 'faq',
                    'response_time': 0.21,
                }
            ),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ChatAnalytics.objects.count(), 1)

    def test_save_event(self):
        response = self.client.post(
            reverse('analytics:save_event'),
            data=json.dumps(
                {
                    'event_type': 'product_click',
                    'event_label': 'Шприцы инъекционные',
                    'page_url': '/',
                    'target_url': '/product-category/?cat=1',
                    'metadata': {'source': 'test'},
                }
            ),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserEvent.objects.count(), 1)
        event = UserEvent.objects.get()
        self.assertEqual(event.event_type, 'product_click')
        self.assertEqual(event.metadata['source'], 'test')

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from .models import News


class NewsViewsTests(TestCase):
    def setUp(self):
        self.news = News.objects.create(
            title='Тестовая новость',
            excerpt='Кратко',
            content='Полный текст',
            image=SimpleUploadedFile('news.jpg', b'filecontent', content_type='image/jpeg'),
            is_published=True,
        )

    def test_news_list_returns_200(self):
        response = self.client.get(reverse('news_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Тестовая новость')

    def test_news_detail_increments_views(self):
        start_views = self.news.views
        response = self.client.get(reverse('news_detail', args=[self.news.id]))
        self.news.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.news.views, start_views + 1)

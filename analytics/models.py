from django.db import models


class PageView(models.Model):
    """Просмотры страниц."""
    page_url = models.CharField('URL страницы', max_length=500)
    page_title = models.CharField('Заголовок страницы', max_length=500, blank=True)
    user_agent = models.TextField('User Agent', blank=True)
    ip_address = models.GenericIPAddressField('IP адрес', blank=True, null=True)
    referer = models.CharField('Откуда пришёл', max_length=500, blank=True)
    session_id = models.CharField('ID сессии', max_length=100, blank=True)
    created_at = models.DateTimeField('Время просмотра', auto_now_add=True)

    class Meta:
        verbose_name = 'Просмотр страницы'
        verbose_name_plural = 'Просмотры страниц'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.page_url} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class SearchQuery(models.Model):
    """Поисковые запросы."""
    query = models.CharField('Поисковый запрос', max_length=500)
    results_count = models.IntegerField('Количество результатов', default=0)
    ip_address = models.GenericIPAddressField('IP адрес', blank=True, null=True)
    session_id = models.CharField('ID сессии', max_length=100, blank=True)
    created_at = models.DateTimeField('Время поиска', auto_now_add=True)

    class Meta:
        verbose_name = 'Поисковый запрос'
        verbose_name_plural = 'Поисковые запросы'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.query} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class ChatAnalytics(models.Model):
    """Аналитика чата."""
    SOURCE_CHOICES = [
        ('knowledge_base', 'База знаний'),
        ('faq', 'FAQ из БД'),
        ('ai', 'Yandex GPT'),
        ('fallback', 'Запасной ответ'),
    ]

    session_id = models.CharField('ID сессии', max_length=100)
    user_message = models.TextField('Сообщение пользователя')
    bot_response = models.TextField('Ответ бота', blank=True)
    response_source = models.CharField('Источник ответа', max_length=50, blank=True, choices=SOURCE_CHOICES)
    response_time = models.FloatField('Время ответа (сек)', default=0)
    created_at = models.DateTimeField('Время запроса', auto_now_add=True)

    class Meta:
        verbose_name = 'Сообщение чата'
        verbose_name_plural = 'Аналитика чата'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user_message[:50]} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class UserSession(models.Model):
    """Пользовательские сессии."""
    session_id = models.CharField('ID сессии', max_length=100, unique=True)
    ip_address = models.GenericIPAddressField('IP адрес', blank=True, null=True)
    user_agent = models.TextField('User Agent', blank=True)
    pages_viewed = models.IntegerField('Просмотрено страниц', default=0)
    first_visit = models.DateTimeField('Первое посещение', auto_now_add=True)
    last_visit = models.DateTimeField('Последнее посещение', auto_now=True)

    class Meta:
        verbose_name = 'Сессия пользователя'
        verbose_name_plural = 'Сессии пользователей'
        ordering = ['-last_visit']

    def __str__(self):
        return f"{self.session_id[:20]} - {self.last_visit.strftime('%d.%m.%Y %H:%M')}"


class UserEvent(models.Model):
    """Клики и важные действия пользователя."""
    event_type = models.CharField('Тип события', max_length=80)
    event_label = models.CharField('Название события', max_length=500, blank=True)
    page_url = models.CharField('URL страницы', max_length=500, blank=True)
    target_url = models.CharField('Целевой URL', max_length=500, blank=True)
    metadata = models.JSONField('Метаданные', default=dict, blank=True)
    ip_address = models.GenericIPAddressField('IP адрес', blank=True, null=True)
    session_id = models.CharField('ID сессии', max_length=100, blank=True)
    user_agent = models.TextField('User Agent', blank=True)
    created_at = models.DateTimeField('Время события', auto_now_add=True)

    class Meta:
        verbose_name = 'Событие пользователя'
        verbose_name_plural = 'События пользователей'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type}: {self.event_label or self.page_url}"

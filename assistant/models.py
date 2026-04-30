from django.db import models

class FAQ(models.Model):
    """База знаний с частыми вопросами"""
    CATEGORY_CHOICES = [
        ('products', 'Продукция'),
        ('delivery', 'Доставка'),
        ('payment', 'Оплата'),
        ('contacts', 'Контакты'),
        ('documents', 'Документы'),
        ('other', 'Другое'),
    ]
    
    question = models.CharField('Вопрос', max_length=500)
    answer = models.TextField('Ответ')
    keywords = models.CharField('Ключевые слова (через запятую)', max_length=500, blank=True)
    category = models.CharField('Категория', max_length=100, blank=True, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    views = models.IntegerField('Просмотры', default=0)

    class Meta:
        verbose_name = 'Часто задаваемый вопрос'
        verbose_name_plural = 'Часто задаваемые вопросы'
        ordering = ['-views', 'id']

    def __str__(self):
        return self.question[:50]

class ChatSession(models.Model):
    """Хранение сессий чата"""
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_id}"

class ChatMessage(models.Model):
    """Хранение сообщений чата"""
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    is_user = models.BooleanField('Сообщение от пользователя', default=True)
    message = models.TextField('Текст сообщения')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'User' if self.is_user else 'Bot'}: {self.message[:50]}"
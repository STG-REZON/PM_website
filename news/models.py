from django.db import models

class News(models.Model):
    title = models.CharField('Заголовок', max_length=200)
    excerpt = models.TextField('Краткое описание', max_length=500)
    content = models.TextField('Полный текст')
    image = models.ImageField('Изображение', upload_to='news/')
    date = models.DateTimeField('Дата публикации', auto_now_add=True)
    is_published = models.BooleanField('Опубликовано', default=True)
    views = models.IntegerField('Просмотры', default=0)
    
    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-date']
    
    def __str__(self):
        return self.title
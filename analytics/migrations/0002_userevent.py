# Generated manually for extended analytics.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_type', models.CharField(max_length=80, verbose_name='Тип события')),
                ('event_label', models.CharField(blank=True, max_length=500, verbose_name='Название события')),
                ('page_url', models.CharField(blank=True, max_length=500, verbose_name='URL страницы')),
                ('target_url', models.CharField(blank=True, max_length=500, verbose_name='Целевой URL')),
                ('metadata', models.JSONField(blank=True, default=dict, verbose_name='Метаданные')),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True, verbose_name='IP адрес')),
                ('session_id', models.CharField(blank=True, max_length=100, verbose_name='ID сессии')),
                ('user_agent', models.TextField(blank=True, verbose_name='User Agent')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время события')),
            ],
            options={
                'verbose_name': 'Событие пользователя',
                'verbose_name_plural': 'События пользователей',
                'ordering': ['-created_at'],
            },
        ),
    ]

from django.contrib import admin
from .models import News

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'is_published', 'views']
    list_filter = ['is_published', 'date']
    search_fields = ['title', 'content']
    fields = ['title', 'excerpt', 'content', 'image', 'is_published']
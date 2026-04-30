from django.shortcuts import render, get_object_or_404
from .models import News

def news_list(request):
    news = News.objects.filter(is_published=True)
    return render(request, 'news/news_list.html', {'news': news})

def news_detail(request, news_id):
    news = get_object_or_404(News, id=news_id, is_published=True)
    news.views += 1
    news.save()
    return render(request, 'news/news_detail.html', {'news': news})
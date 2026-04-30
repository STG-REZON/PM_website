from django.shortcuts import render
from django.http import HttpResponse

def home_page(request):
    """Главная страница"""
    return render(request, 'index.html')

def about_page(request):
    """Страница О компании"""
    return render(request, 'about.html')

def contacts_page(request):
    """Страница Контакты"""
    return render(request, 'contacts.html')

def gallery_page(request):
    """Страница Фотогалерея"""
    return render(request, 'gallery.html')

def documents_page(request):
    """Страница Документы"""
    return render(request, 'documents.html')

def instructions_page(request):
    """Страница Информационные материалы"""
    return render(request, 'instructions.html')

def vacancies_page(request):
    """Страница Вакансии"""
    return render(request, 'vacancies.html')

def product_category_page(request):
    """Страница категории товаров"""
    return render(request, 'product-category.html')

def product_detail_page(request):
    """Страница детального просмотра товара"""
    return render(request, 'product-detail.html')

def product_variant_page(request):
    """Страница варианта товара"""
    return render(request, 'product-variant.html')

def service_page(request):
    """Страница услуги"""
    return render(request, 'service.html')
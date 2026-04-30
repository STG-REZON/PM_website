"""
URL configuration for mysite project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_page, name='home'),
    path('about/', views.about_page, name='about'),
    path('contacts/', views.contacts_page, name='contacts'),
    path('gallery/', views.gallery_page, name='gallery'),
    path('documents/', views.documents_page, name='documents'),
    path('instructions/', views.instructions_page, name='instructions'),
    path('vacancies/', views.vacancies_page, name='vacancies'),
    path('product-category/', views.product_category_page, name='product_category'),
    path('product-detail/', views.product_detail_page, name='product_detail'),
    path('product-variant/', views.product_variant_page, name='product_variant'),
    path('service/', views.service_page, name='service'),
    path('news/', include('news.urls')),
    path('assistant/', include('assistant.urls')),
    path('analytics/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
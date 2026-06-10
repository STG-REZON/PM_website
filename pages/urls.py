from django.urls import path

from . import views

urlpatterns = [
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
]

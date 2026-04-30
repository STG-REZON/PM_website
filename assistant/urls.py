from django.urls import path
from . import views

app_name = 'assistant'

urlpatterns = [
    path('', views.assistant_page, name='assistant_page'),
    path('widget/', views.get_widget, name='widget'),
    path('api/chat/', views.chat_api, name='chat_api'),
    path('api/faq/', views.get_faq_list, name='faq_list'),
]
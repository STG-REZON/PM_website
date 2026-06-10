from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('api/search/', views.save_search, name='save_search'),
    path('api/event/', views.save_event, name='save_event'),
    path('api/chat/', views.save_chat, name='save_chat'),
]

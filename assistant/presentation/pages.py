from django.shortcuts import render


def assistant_page(request):
    return render(request, 'assistant/assistant.html')


def get_widget(request):
    return render(request, 'assistant/widget.html')

from django.shortcuts import render


def home_page(request):
    return render(request, 'index.html')


def about_page(request):
    return render(request, 'about.html')


def contacts_page(request):
    return render(request, 'contacts.html')


def gallery_page(request):
    return render(request, 'gallery.html')


def documents_page(request):
    return render(request, 'documents.html')


def instructions_page(request):
    return render(request, 'instructions.html')


def vacancies_page(request):
    return render(request, 'vacancies.html')


def product_category_page(request):
    return render(request, 'product-category.html')


def product_detail_page(request):
    return render(request, 'product-detail.html')


def product_variant_page(request):
    return render(request, 'product-variant.html')


def service_page(request):
    return render(request, 'service.html')

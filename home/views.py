from django.shortcuts import render


def home(request):
    context = {"page": "Home"}
    return render(request, "index.html", context)


def about(request):
    context = {"page": "About"}
    return render(request, "about.html", context)


def contact(request):
    context = {"page": "Contact"}
    return render(request, "contact.html", context)

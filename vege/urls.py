from django.urls import path

from vege import views

urlpatterns = [path("", views.recipes)]

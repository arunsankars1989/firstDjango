from django.urls import path

from vege import views

urlpatterns = [
    path("", views.recipes),
    path("save-recipe", views.save_recipe),
]

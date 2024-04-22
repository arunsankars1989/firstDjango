from django.urls import path

from vege import views

urlpatterns = [
    path("", views.recipes),
    path("save-recipe", views.save_recipe),
    path("get-recipe", views.get_recipe),
    path("get-recipe/<int:id>", views.get_recipe_by_id),
    path("delete-recipe/<int:id>", views.delete_recipe),
    path("update-recipe/<int:id>", views.update_recipe),
]

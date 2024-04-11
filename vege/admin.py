from django.contrib import admin

from vege.models import Recipe


class RecipeAdmin(admin.ModelAdmin):
    list_display = ("recipe_name", "recipe_description", "recipe_image")


admin.site.register(Recipe, RecipeAdmin)

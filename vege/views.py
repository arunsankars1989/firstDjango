from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render

from vege.models import Recipe


def recipes(request):
    return render(request, "recipes.html")


def save_recipe(request):
    if request.method == "POST":
        data = request.POST
        recipe_name = data.get("recipeName")
        recipe_description = data.get("recipeDescription")
        recipe_image = request.FILES.get("recipeImage")
        try:
            Recipe.objects.create(
                recipe_name=recipe_name,
                recipe_description=recipe_description,
                recipe_image=recipe_image,
            )
            return JsonResponse(
                {"status": "success", "message": "Recipe successfully created"}
            )
        except IntegrityError:
            return JsonResponse({"status": "error", "message": "DB integrity error"})
        except ValidationError as e:
            # Handle validation error
            return JsonResponse({"status": "error", "message": "Validation error"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Something went wrong!!"})

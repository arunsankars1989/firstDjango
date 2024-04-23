from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from vege.models import Recipe


@login_required
@require_GET
def recipes(request):
    context = {"page": "Recipes", "pageTitle": "Recipes"}
    return render(request, "recipes.html", context)


@login_required
@require_POST
def save_recipe(request):
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
            {"status": "success", "message": "Recipe successfully created!"}
        )
    except IntegrityError:
        return JsonResponse({"status": "error", "message": "DB integrity error"})
    except ValidationError as e:
        # Handle validation error
        return JsonResponse({"status": "error", "message": "Validation error"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": "Failed to save recipe"})


@login_required
@require_GET
def get_recipe(request):
    all_recipes = Recipe.objects.all()
    data = list(all_recipes.values())
    return JsonResponse({"data": data}, safe=False)


@login_required
@require_GET
def get_recipe_by_id(request, id):
    try:
        recipe = Recipe.objects.get(id=id)
        recipe_dict = model_to_dict(recipe)
        if recipe_dict["recipe_image"]:
            recipe_dict["recipe_image"] = recipe_dict["recipe_image"].url
        else:
            recipe_dict["recipe_image"] = None
        return JsonResponse({"status": "success", "data": recipe_dict})
    except Recipe.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Recipe not found"})


@login_required
def update_recipe(request, id):
    if request.method == "PUT":
        try:
            recipe = Recipe.objects.get(id=id)
            recipe.recipe_name = request.PUT.get("recipeName")
            recipe.recipe_description = request.PUT.get("recipeDescription")

            recipe.save()

            return JsonResponse({"status": "success", "message": "Recipe updated!"})
        except Recipe.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Recipe not found"})
        except ValidationError as e:
            return JsonResponse({"status": "error", "message": "Validation error"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": "Something went wrong!"})
    else:
        return JsonResponse({"status": "error", "message": "Something went wrong!"})


@login_required
def delete_recipe(request, id):
    if request.method == "DELETE":
        try:
            Recipe.objects.get(id=id).delete()
            return JsonResponse(
                {"status": "success", "message": "Recipe successfully deleted!"}
            )
        except IntegrityError:
            return JsonResponse({"status": "error", "message": "DB integrity error"})
        except Exception as e:
            return JsonResponse(
                {"status": "error", "message": "Failed to delete recipe"}
            )
    else:
        return JsonResponse({"status": "error", "message": "Something went wrong!"})

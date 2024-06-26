from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST, require_GET
from pymysql import IntegrityError

from utils.common import validate_password


@require_GET
def index(request):
    if request.user.is_authenticated:
        return redirect("/vege")

    context = {"title": "Sign In"}
    return render(request, "login.html", context)


@require_POST
def login_submit(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    username_data = User.objects.filter(username=username)

    username_exists = username_data.exists()

    user_auth = authenticate(username=username, password=password)

    if (user_auth is None) or (not username_exists):
        return JsonResponse(
            {"status": "error", "message": "Incorrect username or password"}
        )
    else:
        login(request, user_auth)
        return JsonResponse({"status": "success", "message": "Login Successful!"})


@require_GET
def register_page(request):
    context = {"title": "Sign Up"}
    return render(request, "register.html", context)


@require_POST
def submit_register(request):
    first_name = request.POST.get("firstName")
    last_name = request.POST.get("lastName")
    email = request.POST.get("email")
    username = request.POST.get("username")
    password = request.POST.get("password")
    confirm_password = request.POST.get("confirmPassword")

    user = User.objects.filter(username=username)

    if user.exists():
        return JsonResponse({"status": "error", "message": "User already exists"})

    if (password == confirm_password) and validate_password(password):
        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=username,
            )
            user.set_password(password)
            user.save()
            return JsonResponse(
                {
                    "status": "success",
                    "message": "User registered successfully! Please try to login now",
                }
            )
        except IntegrityError:
            return JsonResponse({"status": "error", "message": "DB integrity error"})
        except ValidationError as e:
            return JsonResponse({"status": "error", "message": "Validation error"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": "Something went wrong!"})


def logout_page(request):
    logout(request)
    return redirect("/")

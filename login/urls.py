from django.urls import path

from login import views

urlpatterns = [
    path("", views.index),
    path("login/", views.index),
    path("logout/", views.logout_page),
    path("submit-login/", views.login_submit),
    path("register/", views.register_page),
    path("submit-register/", views.submit_register),
]

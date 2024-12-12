from django.urls import path
from .views import *

urlpatterns = [
    path('login', login),
    path('', get_user),
    path('add', add_user),
    path('delete', delete_user),
    path('edit', edit_user)
]
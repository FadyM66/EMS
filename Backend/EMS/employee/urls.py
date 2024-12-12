from django.urls import path
from .views import *

urlpatterns = [
    path('', get_all),
    path('<int:id>/', get_employee),
    path('add', add_employee),
    path('delete/<int:id>', delete_employee),
    path('edit/<int:id>', edit_employee)
]
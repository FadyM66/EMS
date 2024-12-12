from django.urls import path
from .views import *

urlpatterns = [
    path('', get_all),
    path('<int:id>/', get_department),
    path('add', add_department),
    path('delete/<int:id>', delete_department),
    path('edit/<int:id>', edit_department)
]
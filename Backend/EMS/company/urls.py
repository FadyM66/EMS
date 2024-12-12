from django.urls import path
from .views import *

urlpatterns = [
    path('', get_all),
    path('<int:id>/', get_company),
    path('add', add_company),
    path('delete/<int:id>', delete_company),
    path('edit/<int:id>', edit_company)
]
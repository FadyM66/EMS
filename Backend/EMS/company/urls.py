from django.urls import path

from .views import get_all, get_company, add_company, delete_company, edit_company

urlpatterns = [
    path('', get_all),
    path('<int:id>/', get_company),
    path('add', add_company),
    path('delete/<int:id>', delete_company),
    path('edit/<int:id>', edit_company),
]

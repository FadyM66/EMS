from django.db import models
from department.models import Department
from employee.models import Employee

# Create your models here.
class Company(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    
    @property
    def number_of_departments(self):
        return Department.objects.filter(company=self).count()

    @property
    def number_of_employees(self):
        return Employee.objects.filter(department__company=self).count()

    def __str__(self):
        return self.name
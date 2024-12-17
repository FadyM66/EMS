from django.db import models
from employee.models import Employee


class Department(models.Model):
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    company = models.ForeignKey('company.Company', related_name="departments", on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('name', 'company')
        
    @property
    def number_of_employees(self):
        return Employee.objects.filter(department=self).count()
        
    def __str__(self):
        return f"{self.name} - {self.company.name}"
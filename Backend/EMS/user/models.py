from django.db import models
from django.utils import timezone

# Create your models here.
class User(models.Model):
    
    role_choices = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee')
    ]
    
    username = models.CharField(max_length=50, blank=False)
    email = models.CharField(max_length=255, primary_key=True, blank=False)
    password = models.CharField(max_length=255, blank=False)
    role = models.CharField(max_length=255, choices=role_choices, blank=False)
    
    def save(self, *args, **kwargs):
        if self.role not in dict(self.role_choices):
            raise ValueError(f"Invalid role value. Must be one of {list(dict(self.role_choices).keys())}")
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
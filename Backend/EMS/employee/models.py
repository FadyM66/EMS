from django.db import models
from django.utils import timezone


class Employee(models.Model):

    # status choices for status. Django accepts choices as list of tuples.
    # each tuple contains a database value and a human readable value.
    status_choices = [
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted')
    ]
    
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey('department.Department', related_name="employees", on_delete=models.CASCADE, blank=False)
    name = models.CharField(max_length=255, blank=False)
    email = models.EmailField(unique=True, blank=False)
    mobile_number = models.CharField(max_length=15, unique=True, blank=False)
    address = models.TextField()
    designation = models.CharField(max_length=255, blank=False)
    status = models.CharField(max_length=20, choices=status_choices, default='application_received', blank=False)
    hired_on = models.DateTimeField(null=True, blank=True)
    days_employed = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        'user.User',
        on_delete=models.CASCADE,
        related_name='user_account',
        null=True,
        blank=True
    )

    @property
    def company(self):
        return self.department.company
    
    def save(self, *args, **kwargs):
        if self.status not in dict(self.status_choices):
            raise ValueError(f"Invalid status value. Must be one of {list(dict(self.status_choices).keys())}")

        if not self.hired_on and self.status == 'hired':
            self.hired_on = timezone.now()
        
        if self.hired_on != None:
            self.days_employed = (timezone.now().date() - self.hired_on.date()).days

        super().save(*args, **kwargs)
            
            
    def __str__(self):
        return f"{self.id} - {self.name}"

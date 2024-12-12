from rest_framework import serializers
from .models import Department

class department_serializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"
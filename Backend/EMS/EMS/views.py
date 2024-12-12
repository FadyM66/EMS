from rest_framework.response import Response
from rest_framework.decorators import api_view
from company.models import Company
from department.models import Department
from employee.models import Employee
from user.models import User
from user.utils import validate_JWT
import logging


logger = logging.getLogger(__name__)


@api_view(['GET'])
def summary(request):
    
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
        
        companies = Company.objects.all().count()
        departments = Department.objects.all().count()
        employees = Employee.objects.all().count()
        users = User.objects.all().count()
        
        return Response({"data": {"companies": companies, "departments": departments, "employees": employees, "users": users}} , status=200)
    
    except Exception as e:

        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Internal server error"} , status=500)   
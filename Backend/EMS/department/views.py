from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Department
from company.models import Company
from .serializer import department_serializer
from .utils import *
import logging
from user.utils import validate_JWT
from user.models import User
from employee.models import Employee

logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_department(request, id):
    
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        department = Department.objects.filter(id=id).first()
        
        if token['role'] == "manager":
            user = Employee.objects.filter(email=token['email']).first()
            if not user or not user.department or user.department.id != department.id:
                return Response({"detail": "No authority"}, status=403)

        if not department:
            return Response({"detail": "Department not found."}, status=404)
        
        data = department_serializer(department)
        
        return Response({"data": data} , status=200)
    
    except Exception as e:

        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Internal server error"} , status=500)   


@api_view(['GET'])
def get_all(request):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)
                    
        params = dict(request.query_params)
        validated_params = validate_fields(params)

        departments = Department.objects.filter(**validated_params)

        data = department_serializer(departments, many=True).data

        for department_data, department in zip(data, departments):
            department_data['number_of_employees'] = department.number_of_employees

        return Response({"detail": {"count": departments.count() , "data": data}}, status=200)
    
    except Exception as e:
        
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    

@api_view(['POST'])
def add_department(request):
    
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        data = request.data.get('data')
        
        if 'name' in data.keys() and 'company_id' in data.keys():
            company = Company.objects.filter(id=data['company_id']).first()
            if not company:
                return Response({"detail": "Company not found."}, status=400)

            new_department = Department(
                                    name = data['name'],
                                    company = company
                                )
            new_department.save()
        else:
            return Response({"detail": "No department name or company id provided"}, status=400)

        added_department = department_serializer(new_department).data

        return Response({"detail": "Department added succcessfully", "data": added_department}, status=200)
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
@api_view(['DELETE'])
def delete_department(request, id):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        department = Department.objects.get(id=id)
        
        department.delete()
        
        return Response({"detail": f"Department deleted succcessfully"}, status=200)

    except Department.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Department not found"}, status=404)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
    
@api_view(['PATCH'])
def edit_department(request, id):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        department = Department.objects.filter(id=id).first()
        
        if token['role'] == "manager":
            user = Employee.objects.filter(email=token['email']).first()
            if not user or not user.department or user.department.id != department.id:
                return Response({"detail": "No authority"}, status=403)
            
        data = request.data.get('data')
        
        department = Department.objects.get(id=id)
        
        if 'name' in data.keys():
            department.name = data['name']
            
        if 'company_id' in data.keys():
            company = Company.objects.filter(id=data["company_id"]).first()
            if not company:
                return Response({"detail": "Company not found."}, status=400)
            department.company = company
        
        
        department.save()
        
        updated_department = department_serializer(department).data
        
        updated_department['number_of_employees'] = department.number_of_employees

        return Response({"detail": f"Company updated succcessfully", "data": updated_department}, status=200)

    except Department.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Department not found"}, status=404)    
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
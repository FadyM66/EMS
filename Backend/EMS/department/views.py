import logging

from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.db import IntegrityError

from user.utils import validate_JWT
from employee.models import Employee

from company.models import Company
from .models import Department
from .serializer import DepartmentSerializer
from .utils import *
from core.utils import validator, validate_params


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
        
        data = DepartmentSerializer(department).data
        data['number of employees'] = department.number_of_employees
        
        company_id = data.pop('company', None)
        company_name = Company.objects.filter(id=company_id).first().name
        
        data['company'] = company_name

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
        validated_params = validate_params(params, 'department')

        departments = Department.objects.filter(**validated_params)

        data = DepartmentSerializer(departments, many=True).data

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
        
        is_valid = validator(data, 'department')

        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
        
        company = Company.objects.filter(id = data['company_id']).first()
        
        if company:
            new_department = Department(
                                    name = data['name'],
                                    company = company
                                )
            new_department.save()
            
        else:
            return Response({"detail": "Company not found"} ,status=400)
        
        added_department = DepartmentSerializer(new_department).data

        return Response({"detail": "Department added succcessfully", "data": added_department}, status=200)

    except IntegrityError:
        return Response({"detail": "Department already exists"},status=409)
    
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
        
        if token['role'] == 'employee' or token['role'] == 'manager':
            return Response({"detail": "No authority"}, status=403)
        
        department = Department.objects.filter(id=id).first()
        data = request.data.get('data')
        is_valid = validator(data, 'department')
        
        if not is_valid['valid']:
            return Response({"detail": is_valid['error']}, status=400)

        department = Department.objects.get(id=id)
        
        if 'company_id' in data.keys():
            company = Company.objects.filter(id=data['company_id']).first()
            if not company:
                return Response({"detail": "Company not found"},status=400)
            
        for field, value in data.items():
            if field == 'company_id':
                setattr(department, field, company)
                continue
            setattr(department, field, value)
        
        department.save()
        
        updated_department = DepartmentSerializer(department).data
        
        updated_department['number_of_employees'] = department.number_of_employees
        return Response({"detail": f"Department updated succcessfully", "data": updated_department}, status=200)

    except Department.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Department not found"}, status=404)    
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
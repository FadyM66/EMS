import logging

from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.db.utils import IntegrityError

from .models import Employee
from department.models import Department
from .serializer import EmployeeSerializer
from .utils import *
from core.utils import validator, validate_params


logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_employee(request, id):
    
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        emp = Employee.objects.filter(id=id)
        
        if not emp:
            return Response({"detail": f"Not found"}, status=404)
        
        permission = has_permission(incoming_token, id)
        if not permission['valid']:
            return Response({"detail": f"{permission['error']}"}, status=permission['status'])
        
        data = EmployeeSerializer(permission['data']).data
        
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

        permission = has_permission(incoming_token, 'all')
        if not permission['valid']:
            logger.error("Error: Not valid")
            return Response({"detail": f"{permission['error']}"}, status=permission['status'])
                
        params = dict(request.query_params)
        validated_params = validate_params(params, 'employee')

        objs = permission['data']
        employees = objs.filter(**validated_params)

        data = EmployeeSerializer(employees, many=True).data

        for employee_data, employee in zip(data, employees):
            employee_data['company'] = employee.company.name
        
        return Response({"detail": {"count": employees.count() , "data": data}}, status=200)
    
    except Exception as e:
        
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

    
@api_view(['POST'])
def add_employee(request):
    
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)

        data = request.data.get('data')

        is_valid = validator(data, 'employee')
        
        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
        
        permission = has_permission(incoming_token, operation='c' ,new_data=data)
        
        if not permission['valid']:
            return Response({"detail": f"{permission['error']}"}, status=permission['status'])
        
        department_id = data.pop('department_id', None)
        
        department = Department.objects.filter(id=department_id).first()
        
        if not department:
            return Response({"detail": "Department not found."}, status=404)

        data['department'] = department
        
        new_employee = Employee(
                                **data
                            )
        new_employee.save()

        added_employee = EmployeeSerializer(new_employee).data

        return Response({"detail": "Employee added succcessfully", "data": added_employee}, status=200)

    except IntegrityError as e:
        logger.error(f"Integrity error: {str(e)}")
        return Response({"detail": "Both email and mobile number must be unique"}, status=400)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

    
@api_view(['DELETE'])
def delete_employee(request, id):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = has_permission(incoming_token, id, 'd')
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=token_validation['status'])
        employee = token_validation['data']
        
        employee.delete()
        
        return Response({"detail": f"Department deleted succcessfully"}, status=200)

    except Employee.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Employee not found"}, status=404)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
    
@api_view(['PATCH'])
def edit_employee(request, id):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        data = request.data.get('data')

        is_valid = validator(data, 'employee')
        
        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
                    
        token_validation = has_permission(incoming_token, id, 'u', data)
        
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=token_validation['status'])

        employee = token_validation['data']

        department_id = data.pop('department_id', None)

        if department_id:
            department = Department.objects.filter(id=department_id).first()
            if not department:
                return Response({"detail": "Department not found."}, status=404)
            data['department'] = department
        
        for key, value in data.items():
            if value:
                setattr(employee, key, value)
        
        employee.save()
        
        updated_employee = EmployeeSerializer(employee).data
        
        updated_employee['company'] = employee.company.name

        return Response({"detail": f"Employee updated succcessfully", "data": updated_employee}, status=200)

    except Department.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Department not found"}, status=404)    
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
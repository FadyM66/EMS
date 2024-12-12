from rest_framework.response import Response
from django.db.utils import IntegrityError
from rest_framework.decorators import api_view
from .models import Employee
from user.models import User
from department.models import Department
from .serializer import employee_serializer
from .utils import *
from user.utils import validate_JWT
import logging


logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_employee(request, id):
    
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
        
        employee = Employee.objects.filter(id=id).first()
        
        if not employee:
            return Response({"detail": "Employee not found."}, status=404)
        
        data = employee_serializer(employee).data
        
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
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        params = dict(request.query_params)
        validated_params = validate_fields(params)

        employees = Employee.objects.filter(**validated_params)

        data = employee_serializer(employees, many=True).data

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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        data = request.data.get('data')
        
        if not validate_request(data):
            return Response({"detail": "All of these field are required: department_id, name, email, mobile_number, address, designation status"}, status=400)
        
        validated_data = validate_fields(data)
        
        department_id = validated_data.pop('department__id', None)
        
        department = Department.objects.filter(id=department_id).first()
        
        if not department:
            return Response({"detail": "Department not found."}, status=404)

        validated_data['department'] = department
        
        new_employee = Employee(
                                **validated_data
                            )
        new_employee.save()

        added_employee = employee_serializer(new_employee).data

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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        employee = Employee.objects.get(id=id)
        
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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
        
        token = token_validation['token']
         
        data = request.data.get('data')
        
        try:
            employee = Employee.objects.get(id=id)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found"}, status=404)
        
        if token['role'] == "employee":
            user = User.objects.filter(email=token['email']).first()
            if not user or user.email != employee.email:
                return Response({"detail": "No authority"}, status=403)
           
        validated_data = validate_fields(data)        
        
        department_id = validated_data.pop('department__id', None)

        if department_id:
            department = Department.objects.filter(id=department_id).first()
            if not department:
                return Response({"detail": "Department not found."}, status=404)
            validated_data['department'] = department
        
        for key, value in validated_data.items():
            setattr(employee, key, value)
        
        employee.save()
        
        updated_employee = employee_serializer(employee).data
        
        updated_employee['company'] = employee.company.name

        return Response({"detail": f"Company updated succcessfully", "data": updated_employee}, status=200)

    except Department.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Department not found"}, status=404)    
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
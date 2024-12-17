import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.db import IntegrityError

from .models import User
from employee.models import Employee

from .serializer import user_serializer
from employee.serializer import EmployeeSerializer

from .utils import *
from core.utils import validator, validate_params


logger = logging.getLogger(__name__)


@api_view(['POST'])
def login(request):
    try:
        data = dict(request.data.get('data'))
        if not 'email' in data.keys() or not 'password' in data.keys():   
            return Response({"details": "Both email and password are required."},status=400)
        
        user = User.objects.get(email=data['email'])
        if not user:
            raise User.DoesNotExist
        
        if user.password != data['password']:
            return Response({"details": "Incorrect credentials"}, status=401)         
        
        token = JWT_generator(
                                email=user.email,
                                username=user.username,
                                role=user.role
                            )
        user_data = user_serializer(user).data
        
        user_data.pop('password')
        
        return Response({"details": "Login successed", "data": {"data": user_data, "token": token}},status=200)         
    
    except User.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"details": "User doesn't exist"},status=404)         

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"details": "Test."},status=400)         
    
@api_view(['POST'])
def add_user(request):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
                        
        data = request.data.get('data')

        is_valid = validator(data,'user')
        
        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
                        
        if User.objects.filter(email=data['email']).exists():
            return Response({"detail": "User already exists"}, status=409)

        is_permitted = has_permission(incoming_token, data["email"], data['role'])
        
        if not is_permitted['valid']:
            return Response({"detail": is_permitted['error']}, status=is_permitted['status'])
        
        new_user = User(**data)
        new_user.save()
        data = user_serializer(new_user).data
        
        return Response({"detail": "User created successfully", "data": data},status=201)

    except IntegrityError as e:
        logger.error(f"Integrity error: {str(e)}")
        return Response({"detail": "Database integrity error"}, status=400)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

@api_view(['DELETE'])
def delete_user(request):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        data = request.data.get('data')
        user_data = validate_params(data, 'user')
        
        if 'email' not in user_data:
            return Response({"detail": "Email is required"}, status=400)
        
        is_exists = User.objects.filter(email=user_data['email']).first()
        
        if not is_exists:
            return Response({"detail": "User not found"}, status=404)

        is_permitted = has_permission(incoming_token, user_data['email'], is_exists.role)
        
        if not is_permitted['valid']:
            return Response({"detail": f"{is_permitted['error']}"}, status=is_permitted['status'])

        new_user = User(**user_data)
        new_user.delete()
        
        return Response({"detail": "User deleted successfully"},status=200)
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
@api_view(['GET'])
def get_user(request):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token = validate_JWT(incoming_token)        
        
        data = dict(request.data.get('data'))
        user_data = validate_params(data, 'user')

        if 'email' not in user_data:
            return Response({"detail": "Email is required"}, status=400)

        user = User.objects.get(email=user_data['email'])
        
        if user_data['email'] != token['email']:
            is_permitted = has_permission(incoming_token, user_data['email'], user.role)
            if not is_permitted['valid']:
                return Response({"detail": f"{is_permitted['error']}"}, status=is_permitted['status'])
        
        employee = Employee.objects.filter(email=user_data["email"]).first()
        
        data = user_serializer(user).data
        data.pop('password')
        
        if employee:
            employee_data = EmployeeSerializer(employee).data

            return Response({"detail": {"data": {"user": data, "employee": employee_data}}}, status=200)
        
        return Response({"detail": {"data": data}}, status=200)

    except User.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"details": "User doesn't exist"},status=400)         

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

@api_view(['PATCH'])
def edit_user(request):
    try:
        incoming_token = request.headers.get('token')
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
                
        data = dict(request.data.get('data'))
        
        is_valid = validator(data, 'user')

        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
                
        is_exists = User.objects.filter(email=data['email']).first()
        
        if not is_exists:
            return Response({"detail": "User not found"}, status=404)

        is_permitted = has_permission(incoming_token, data['email'], is_exists.role)
        
        if not is_permitted['valid']:
            return Response({"detail": f"{is_permitted['error']}"}, status=is_permitted['status'])
        
        for key, value in data.items():
            setattr(is_exists, key, value)
            
        is_exists.save()
        
        data = user_serializer(is_exists).data
        return Response({"detail": "User updated successfully" ,"data": data}, status=200)
    
    except User.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"details": "User doesn't exist"},status=400)         
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

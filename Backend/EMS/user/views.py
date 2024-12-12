from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from .models import User
from employee.models import Employee
from employee.serializer import employee_serializer
from .utils import *
from .serializer import user_serializer
import logging


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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)

        data = request.data.get('data')
        user_data = validate_fields(data)
        
        if not validate_request(data):
            return Response({"detail": "All fields needed: username, email, password, role"}, status=400)
        
        if User.objects.filter(email=user_data['email']).exists():
            return Response({"detail": "User already exists"}, status=400)

        new_user = User(**user_data)
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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        data = request.data.get('data')
        user_data = validate_fields(data)
        
        if 'email' not in user_data:
            return Response({"detail": "Email is required"}, status=400)
        
        if not User.objects.filter(email=user_data['email']).exists():
            return Response({"detail": "User not found"}, status=404)

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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
        
        data = dict(request.data.get('data'))
        user_data = validate_fields(data)

        if 'email' not in user_data:
            return Response({"detail": "Email is required"}, status=400)

        user = User.objects.get(email=user_data['email'])
        
        employee = Employee.objects.filter(email=user_data["email"]).first()
        
        data = user_serializer(user).data
        data.pop('password')
        
        if employee:
            employee_data = employee_serializer(employee).data

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
        
        token_validation = validate_JWT(incoming_token)
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        if token['role'] == 'employee':
            return Response({"detail": "No authority"}, status=403)
        
        data = dict(request.data.get('data'))
        user_data = validate_fields(data)

        if 'email' not in user_data:
            return Response({"detail": "Email is required"}, status=400)

        user = User.objects.get(email=user_data['email'])
        
        for key, value in user_data.items():
            setattr(user, key, value)
            
        user.save()
        
        data = user_serializer(user).data
        return Response({"detail": {"data": data}}, status=200)
    
    except User.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"details": "User doesn't exist"},status=400)         
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)

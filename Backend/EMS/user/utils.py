from .models import User
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from rest_framework.response import Response
import logging


logger = logging.getLogger(__name__)

def validate_fields(data: dict):
    valid = {}
    for key, value in data.items():
        if hasattr(User, key):
            if isinstance(value, list):
                value = value[0]
            else:
                valid[key] = value 
    return valid

def validate_request(data: dict):
    required_fields = ['username', 'email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return False
    return True

def JWT_generator(**kwargs):

        payload = {key: value for key, value in kwargs.items()}
        
        payload["exp"] = datetime.now(timezone.utc) + timedelta(days=30)
        payload["iat"] = datetime.now(timezone.utc) 

        token = jwt.encode(payload, settings.SECRET_KEY_JWT, algorithm="HS256")

        return token
    
def validate_JWT(token):
    try:
        if not token:
            return {"valid": False, "error": "Token is missing"}    
        decoded_token = jwt.decode(token, settings.SECRET_KEY_JWT, algorithms=["HS256"])

        return {"valid": True, "token": decoded_token}

    except ExpiredSignatureError:
        logger.error(f"Error: {str(e)}")    
        return {"valid": False, "error": "Token has expired"}
    except InvalidTokenError as e:
        logger.error(f"Error: {str(e)}")    
        return {"valid": False, "error": "Invalid token"}

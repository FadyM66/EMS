import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from employee.models import Employee
from core.utils import validate_JWT
import logging


logger = logging.getLogger(__name__)


def JWT_generator(**kwargs):

        payload = {key: value for key, value in kwargs.items()}
        
        payload["exp"] = datetime.now(timezone.utc) + timedelta(days=30)
        payload["iat"] = datetime.now(timezone.utc) 

        token = jwt.encode(payload, settings.SECRET_KEY_JWT, algorithm="HS256")

        return token

def has_permission(token: str, new_user_email: str, new_user_role: str):
    
    token_validor = validate_JWT(token)
    
    if not token_validor['valid']:
        return {'valid': False, 'error': token_validor['error'], "status": 401}
    
    asker_role = token_validor['token']['role']
    asker_email = token_validor['token']['email']
    
    if asker_role == 'employee':
        return {'valid': False, 'error': "unauthorized - admins and manager only can add or edit or delete users", "status": 403}
    
    if new_user_role == 'admin' or new_user_role == 'manager':
        if asker_role == 'manager':
            return {'valid': False, 'error': "unauthorized - admins only can add or edit or delete adminastrative users", "status": 403}
                
    is_existed = Employee.objects.filter(email=new_user_email).first()
    
    if new_user_role == 'admin':
        return {'valid': True, 'token': token_validor['token']}
    
    if not is_existed:
        return {'valid': False, 'error': "the new user needs to be registered as employee", "status": 400}
    
    if new_user_role == 'employee':
        if asker_role == 'manager':
            
            manager = Employee.objects.filter(email=asker_email).first()
            
            if manager and manager.department == is_existed.department:
                return {'valid': True, 'token': token_validor['token']}
            
            else:
                return {'valid': False, 'error': "unauthorized - manager has authority on the same department employees only", "status": 403}
    
    return {'valid': True, 'token': token_validor['token']}

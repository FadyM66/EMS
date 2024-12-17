from .models import Employee
from core.utils import validate_JWT
import logging


logger = logging.getLogger(__name__)


def has_auth(token: str):
    token_validator = validate_JWT(token)

    if not token_validator['valid']:
        return {"valid": False, "error": f"{token_validator['error']}", "status": 401}

    elif token_validator['token']['role'] == 'employee':
        token_validator['operations'] = ['r', 'u']
        return token_validator
  
    elif token_validator['token']['role'] == 'admin':
        token_validator['operations'] = ['r', 'u', 'd', 'c']
        return token_validator
  
    elif token_validator['token']['role'] == 'manager':
        token_validator['operations'] = ['r', 'u', 'd', 'c']
        return token_validator

    
def has_permission(token:str, onWho=None, operation: str = 'r', new_data: dict = None):

    token = has_auth(token)
    
    if token['valid'] != True:
        token['status'] = 401
        return token
    
    asker_role = token['token']['role']
    asker_email = token['token']['email']
    
    if asker_role == 'employee' and operation in token['operations']:
        if onWho == 'all':
            return {"valid": False, "error": "employee can access only his record", "status": 403}
        else:
            emp = Employee.objects.filter(id=onWho).first()
            if emp and emp.email and emp.email == asker_email:
                return {"valid": True, "data": emp}
            else:
                return {"valid": False, "error": "employee can access only his record", "status": 403}

    elif asker_role == 'admin':
        
        if operation == 'u' or operation == 'd':
            emp = Employee.objects.filter(id=onWho).first()
            if emp:
                return {'valid': True, "data":emp}
            else:
                return {"valid": False, "error": "not found", "status": 404}
        
        if operation == 'c':
            return {'valid': True, "token": token}
        
        if onWho == 'all':
            emp = Employee.objects.all()
            return {'valid': True, "data":emp}
        else:
            emp = Employee.objects.filter(id=onWho).first()
            return {'valid': True, "data":emp}
        
    
    elif asker_role == 'manager':

        manager = Employee.objects.filter(email= asker_email).first()
        if operation == 'u' or operation == 'd':
            emp = Employee.objects.filter(id=onWho).first()
            if emp and manager.department == emp.department:
                return {'valid': True, "data":emp}
        
        if operation == 'c':
            if new_data['department__id'] and str(manager.department.id) == str(new_data['department__id']):
                return {'valid': True, "token": token}
            else:
                return {"valid": False, "error": "Manager add only to his department", "status": 403}

        if onWho == 'all':
            emp = Employee.objects.filter(department=manager.department)
            return {'valid': True, "data":emp}
        
        if onWho:
            emp = Employee.objects.filter(id=onWho,department=manager.department).first()
            return {'valid': True, "data":emp}
        
    return {"valid": False, "error": "unauthorized", "status": 403}
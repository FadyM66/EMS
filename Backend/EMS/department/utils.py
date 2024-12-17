from .models import Department
from core.utils import validate_JWT


def hsa_permission(token:str, department_id: int):
    
    token = validate_JWT(token)
    
    if not token['valid']:
        return {"valid": False, "error": token['error'], "status":400}
    
    if token['token']['role'] != 'admin':
        return {"valid": False, "error": "You don't have authority", "status": 403}

    return {"valid": True, "token": token['token']}
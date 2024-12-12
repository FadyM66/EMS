from .models import Employee


def validate_fields(data: dict):
    valid = {}
    for key, value in data.items():
        if hasattr(Employee, key):
            if isinstance(value, list):
                value = value[0]
            if key == 'company_id':
                valid["department__company_id"] = value 
            if key == 'department_id':
                valid["department__id"] = value 
            else:
                valid[key] = value 
    return valid

def validate_request(data: dict):
    required_fields = ['department_id', 'name', 'email', 'mobile_number', 'address', 'designation', 'status']
    for field in required_fields:
        if field not in data:
            return False
    return True

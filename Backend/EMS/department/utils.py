from .models import Department


def validate_fields(data: dict):
    valid = {}
    for key, value in data.items():
        if hasattr(Department, key):
            if isinstance(value, list):
                value = value[0]
            if key == 'company_id':
                valid["company__id"] = value 
            else:
                valid[key] = value 
    return valid
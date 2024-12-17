import logging
import re
import jwt

from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.conf import settings

from user.models import User
from company.models import Company
from department.models import Department
from employee.models import Employee

from typing import Literal


logger = logging.getLogger(__name__)


def validate_JWT(token):
    try:
        if not token:
            return {"valid": False, "error": "Token is missing"}    
    
        decoded_token = jwt.decode(token, settings.SECRET_KEY_JWT, algorithms=["HS256"])

        return {"valid": True, "token": decoded_token}

    except ExpiredSignatureError as e:
        logger.error(f"Error: {str(e)}")    
        return {"valid": False, "error": "Token has expired"}
    
    except InvalidTokenError as e:
        logger.error(f"Error: {str(e)}")    
        return {"valid": False, "error": "Invalid token"}


def validator(data: dict, which_to_validate: Literal['company', 'department', 'employee', 'user']):
    ammo = {
        "company": {
            "name": r'^[A-Za-z\s]{3,}$'
        },
        "department": {
            "name": r'^[A-Za-z\s]{3,}$',
            "company_id": r'^\d+$'
        },
        "employee": {
            "department_id": r'^\d$',
            "name": r'^[A-Za-z][A-Za-z\s]{3,}$',
            "email": r'^[A-Za-z][\w\.-]+@[\w\.-]+\.\w{2,}$',
            "mobile_number": r'^01[0-2,5]{1}[0-9]{8}$',
            "address": r'^[A-Za-z\s]{3,}$',
            "designation": r'^[A-Za-z\s]{2,}$',
            "status": r'^(application_received|interview_scheduled|hired|not_accepted)$'
        },
        "user": {
            "username": r'^[A-Za-z][A-Za-z\s]{2,}$',
            "email": r'^[A-Za-z][\w\.-]*@[\w\.-]+\.\w{2,}$',
            "password": r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
            "role": r'^(admin|manager|employee)$'
        }
    }

    invalids = []
    
    if which_to_validate == 'company':
        model = Company
    elif which_to_validate == 'department':
        model = Department
    elif which_to_validate == 'employee':
        model = Employee
    elif which_to_validate == 'user':
        model = User
    else:
        return {"valid": False, "error": ["Invalid category"]}

    for field, value in data.items():
        if hasattr(model, field):
            if field in ammo[which_to_validate]:
                pattern = ammo[which_to_validate][field]
                if not re.match(pattern, value):
                    invalids.append(field)
                    
    if len(invalids) > 0:
        return {"valid": False, "error": f"the fields {invalids} are invalid"}

    return {"valid": True}


def validate_params(data: dict, model: str):
    valid = {}

    if model == 'employee':
        model_class = Employee
    elif model == 'department':
        model_class = Department
    elif model == 'user':
        model_class = User
    elif model == 'company':
        model_class = Company
    else:
        return {"valid": False, "error": "Invalid model"}

    for key, value in data.items():
        if hasattr(model_class, key):
            if isinstance(value, list):
                value = value[0]

            if key == 'company_id' and model == 'employee':
                valid["department__company_id"] = value
            elif key == 'department_id' and model == 'employee':
                valid["department__id"] = value
            elif key == 'company_id' and model == 'department':
                valid["company__id"] = value
            else:
                valid[key] = value

    return valid

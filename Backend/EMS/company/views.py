import logging

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Company
from .serializer import CompanySerializer

from user.utils import validate_JWT
from core.utils import validator


logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_company(request, id):
    
    try:
        
        incoming_token = request.headers.get('token')
        
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        company = Company.objects.filter(id=id).first()
        
        if not company:
            return Response({"detail": "Company not found."}, status=404)
        
        data = CompanySerializer(company).data
        data['number_of_departments'] = company.number_of_departments
        data['number_of_employees'] = company.number_of_employees
        
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
        
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        companies = Company.objects.all()
        
        data = CompanySerializer(companies, many=True).data

        for company_data, company in zip(data, companies):
            company_data['number_of_departments'] = company.number_of_departments
            company_data['number_of_employees'] = company.number_of_employees

        return Response({"detail": {"data": data}}, status=200)
    
    except Exception as e:        
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    

@api_view(['POST'])
def add_company(request):
    
    try:
        
        incoming_token = request.headers.get('token')
        
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        data = request.data.get('data')
        
        is_valid = validator(data, 'company')

        if not is_valid['valid']:
            return Response({"detail": is_valid['error']},status=400)
        
        new_record = Company(**data)
        new_record.save()
        
        added_company = CompanySerializer(new_record).data

        return Response({"detail": "Company added succcessfully", "data": added_company}, status=200)
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
    
@api_view(['DELETE'])
def delete_company(request, id):
    
    try:
        
        incoming_token = request.headers.get('token')
        
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        company = Company.objects.get(id=id)
        
        company.delete()
        
        return Response({"detail": f"Company deleted succcessfully"}, status=200)

    except Company.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Company not found"}, status=404)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
    
    
@api_view(['PATCH'])
def edit_company(request, id):
    
    try:
        
        incoming_token = request.headers.get('token')
        
        if not incoming_token:
            logger.error("Error: No token found")    
            return Response({"detail": "No token provided"}, status=401)
        
        token_validation = validate_JWT(incoming_token)
        
        if not token_validation['valid']:
            return Response({"message": token_validation["error"]}, status=401)
                    
        token = token_validation['token']
        
        if token['role'] != 'admin':
            return Response({"detail": "No authority"}, status=403)

        data = request.data.get('data')
        
        is_valid = validator(data, 'company')
        
        if not is_valid['valid']:
            return Response({"detail": is_valid['error']}, status=400)
        
        company = Company.objects.get(id=id)
        
        for field, value in data.items():
            setattr(company, field, value)
            
        company.save()
        
        updated_company = CompanySerializer(company).data
        
        updated_company['number_of_departments'] = company.number_of_departments
        updated_company['number_of_employees'] = company.number_of_employees

        return Response({"detail": f"Company updated succcessfully", "data": updated_company}, status=200)

    except Company.DoesNotExist as e:
        logger.error(f"Error: {str(e)}")
        return Response({"detail": "Company not found"}, status=404)    
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response({"detail": str(e)}, status=400)

    except Exception as e:
        logger.error(f"Error: {str(e)}")    
        return Response({"detail": "Internal server error"}, status=500)
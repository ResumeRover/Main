import azure.functions as func
import logging
import json
from datetime import datetime

# Import the app module for functionality
from app import (
    # Auth functions
    login_for_access_token,
    register_user,
    # Forwarding functions
    forward_to_resume_service,
    forward_to_jobs_service,
    # Helper functions
    Token,
    User,
    UserCreate,
    OAuth2PasswordRequestForm,
    ResumeSubmission
)

# Initialize the function app with newer programming model
function_app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Health check endpoint
@function_app.route(route="api/health", methods=["GET"])
async def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint"""
    result = {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    return func.HttpResponse(
        body=json.dumps(result),
        mimetype="application/json",
        status_code=200
    )


# Auth endpoints
@function_app.route(route="auth/token", methods=["POST"])
async def token_endpoint(req: func.HttpRequest) -> func.HttpResponse:
    """Endpoint for users to login and obtain access token"""
    try:
        body = req.get_json()
        form_data = OAuth2PasswordRequestForm(
            username=body.get("username"),
            password=body.get("password"),
            scope=""
        )
        token_result = await login_for_access_token(form_data)
        return func.HttpResponse(
            body=json.dumps(token_result.dict()),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error in token endpoint: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"detail": str(e)}),
            mimetype="application/json",
            status_code=401
        )

@function_app.route(route="auth/register", methods=["POST"])
async def register_endpoint(req: func.HttpRequest) -> func.HttpResponse:
    """Endpoint for admin to register new users"""
    try:
        # Get token from authorization header
        auth_header = req.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return func.HttpResponse(
                body=json.dumps({"detail": "Not authenticated"}),
                mimetype="application/json",
                status_code=401
            )
        
        token = auth_header.split(' ')[1]
        
        # Get user data from request body
        body = req.get_json()
        user_create = UserCreate(**body)
        user_create.is_admin = False # Check if the user has admin privileges
        
        # Register user (has_role check is inside the function)
        user_result = await register_user(user_create, token)
        
        return func.HttpResponse(
            body=json.dumps(user_result),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error in register endpoint: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"detail": str(e)}),
            mimetype="application/json",
            status_code=400 if "already registered" in str(e) else 500
        )






# Resume service gateway endpoints
@function_app.route(route="api/resumes/{path}", methods=["GET", "POST", "PUT", "DELETE"])
async def resume_gateway(req: func.HttpRequest) -> func.HttpResponse:
    """Gateway for resume service"""
    try:
        # Get the path parameter
        path = req.route_params.get("path", "")
        
        # Get token from authorization header
        auth_header = req.headers.get('Authorization')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        # Forward the request
        response = await forward_to_resume_service(
            path=path,
            method=req.method,
            headers=dict(req.headers),
            data=req.get_json() if req.get_body() else None,
            params=dict(req.params),
            token=token
        )
        
        return func.HttpResponse(
            body=response["content"],
            headers=response["headers"],
            status_code=response["status_code"]
        )
    except Exception as e:
        logging.error(f"Error in resume gateway: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"detail": str(e)}),
            mimetype="application/json",
            status_code=502
        )

# Jobs service gateway endpoints
@function_app.route(route="api/jobs/{path}", methods=["GET", "POST", "PUT", "DELETE"])
async def jobs_gateway(req: func.HttpRequest) -> func.HttpResponse:
    """Gateway for jobs service"""
    try:
        # Get the path parameter
        path = req.route_params.get("path", "")
        
        # Get token from authorization header
        auth_header = req.headers.get('Authorization')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        # Forward the request
        response = await forward_to_jobs_service(
            path=path,
            method=req.method,
            headers=dict(req.headers),
            data=req.get_json() if req.get_body() else None,
            params=dict(req.params),
            token=token
        )
        
        return func.HttpResponse(
            body=response["content"],
            headers=response["headers"],
            status_code=response["status_code"]
        )
    except Exception as e:
        logging.error(f"Error in jobs gateway: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"detail": str(e)}),
            mimetype="application/json",
            status_code=502
        )

# Public resume submission endpoint (no auth required)
@function_app.route(route="api/public/submit-resume", methods=["POST"])
async def public_submit_resume(req: func.HttpRequest) -> func.HttpResponse:
    """Public endpoint for submitting resumes"""
    try:
        # Get data from request body
        body = req.get_json()
        resume_submission = ResumeSubmission(**body)
        
        # Forward to resume service
        response = await forward_to_resume_service(
            path="submit",
            method="POST",
            headers=dict(req.headers),
            data=resume_submission.dict(),
            params={},
            token=None  # No token for public submissions
        )
        
        return func.HttpResponse(
            body=response["content"],
            headers=response["headers"],
            status_code=response["status_code"]
        )
    except Exception as e:
        logging.error(f"Error in public resume submission: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"detail": str(e)}),
            mimetype="application/json",
            status_code=400
        )
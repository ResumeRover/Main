import azure.functions as func
import logging
import json
from app import (
    create_job_impl,
    list_jobs_impl,
    get_job_impl,
    apply_for_job_impl,
    health_check_impl
)

# Define the function app
app = func.FunctionApp()

@app.function_name(name="CreateJob")
@app.route(route="jobs", methods=["POST"], auth_level=func.AuthLevel.FUNCTION)
async def create_job(req: func.HttpRequest) -> func.HttpResponse:
    """
    Endpoint: https://resumeparserjobscs3023.azurewebsites.net/api/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==
    body:
        {
        "title": "Software Engineer",
        "company": "Tech Innovators Ltd.",
        "location": "Colombo, Sri Lanka",
        "description": "We are looking for a skilled software engineer to develop high-quality applications.",
        "required_skills": ["Python", "Django", "React.js", "SQL"],
        "required_experience": 2,
        "required_education": "Bachelor's in Computer Science or related field",
        "salary_range": "LKR 100,000 - 150,000",
        "job_type": "Full-time",
        "remote": "True"
    }
    """
    try:
        job_data = json.loads(req.get_body())
        return await create_job_impl(job_data)
    except Exception as e:
        logging.error(f"Error creating job: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )

@app.function_name(name="ListJobs")
@app.route(route="jobs", methods=["GET"], auth_level=func.AuthLevel.FUNCTION)
async def list_jobs(req: func.HttpRequest) -> func.HttpResponse:
    """
    Endpoint: https://resumeparserjobscs3023.azurewebsites.net/api/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==
    """
    try:
        # Get query parameters
        active = req.params.get("active", "true").lower() == "true"
        location = req.params.get("location")
        job_type = req.params.get("job_type")
        remote = req.params.get("remote")
        search = req.params.get("search")
        skip = int(req.params.get("skip", 0))
        limit = min(int(req.params.get("limit", 10)), 100)
        
        return await list_jobs_impl(
            active=active,
            location=location,
            job_type=job_type,
            remote=remote,
            search=search,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        logging.error(f"Error listing jobs: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )

@app.function_name(name="GetJob")
@app.route(route="jobs/{job_id}", methods=["GET"], auth_level=func.AuthLevel.FUNCTION)
async def get_job(req: func.HttpRequest) -> func.HttpResponse:
    """
    Endpoint: https://resumeparserjobscs3023.azurewebsites.net/api/jobs/{job_id}?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==
    """
    try:
        job_id = req.route_params.get("job_id")
        return await get_job_impl(job_id)
    except Exception as e:
        logging.error(f"Error getting job: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )

@app.function_name(name="ApplyForJob")
@app.route(route="jobs/{job_id}/apply", methods=["POST"], auth_level=func.AuthLevel.FUNCTION)
async def apply_for_job(req: func.HttpRequest) -> func.HttpResponse:
    try:
        job_id = req.route_params.get("job_id")
        application_data = json.loads(req.get_body())
        return await apply_for_job_impl(job_id, application_data)
    except Exception as e:
        logging.error(f"Error applying for job: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )

@app.function_name(name="HealthCheck")
@app.route(route="health", methods=["GET"], auth_level=func.AuthLevel.FUNCTION)
async def health_check(req: func.HttpRequest) -> func.HttpResponse:
    return await health_check_impl()
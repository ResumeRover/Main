# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Path,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from config import MONGO_URL, DB_NAME, COLLECTION_NAME
from datetime import datetime
from collections import Counter
from bson.decimal128 import Decimal128
from dateutil import parser
from dateutil.relativedelta import relativedelta
from typing import List,Dict

app = FastAPI()


# CORS setup
origins = ["*"]  # Update with your frontend URL in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await collection.insert_one({"message": data})
            for client in connected_clients:
                await client.send_text(f"New: {data}")
    except WebSocketDisconnect:
        connected_clients.remove(websocket)'''

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]
job_collection = db["jobs"]

# WebSocket clients (optional, uncomment to use)
connected_clients = []

def get_job_id_by_role(role: str):
    job = job_collection.find_one({"title": role}, {"_id": 1})
    return str(job["_id"]) if job else None

@app.get("/stats/summary/{job_role}")
def get_cv_summary(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    query = {"job_id": job_id}
    total_submitted = collection.count_documents(query)
    total_processed = collection.count_documents({**query, "status": {"$in": ["saved", "processed"]}})
    total_passed = collection.count_documents({**query, "status": "passed"})
    total_rejected = collection.count_documents({**query, "status": "rejected"})

    return {
        "job_role": job_role,
        "submitted": total_submitted,
        "processed": total_processed,
        "passed": total_passed,
        "rejected": total_rejected
    }

@app.get("/stats/score-distribution/{job_role}")
def get_score_distribution(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    bins = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for doc in collection.find({"job_id": job_id}, {"ranking_score": 1}):
        score = doc.get("ranking_score", 0)
        score = float(score.to_decimal()) if isinstance(score, Decimal128) else score
        if score <= 20:
            bins["0-20"] += 1
        elif score <= 40:
            bins["21-40"] += 1
        elif score <= 60:
            bins["41-60"] += 1
        elif score <= 80:
            bins["61-80"] += 1
        else:
            bins["81-100"] += 1
    return bins

@app.get("/stats/experience-distribution/{job_role}")
def get_experience_distribution(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    buckets = {"0-1": 0, "2-4": 0, "5-8": 0, "9+": 0}

    for doc in collection.find({"job_id": job_id}, {"work_experience": 1}):
        total_months = calculate_total_experience_months(doc.get("work_experience", []))

        # Place into bucket
        if total_months < 12:
            buckets["0-1"] += 1
        elif total_months <= 48:
            buckets["2-4"] += 1
        elif total_months <= 96:
            buckets["5-8"] += 1
        else:
            buckets["9+"] += 1

    return buckets


def calculate_total_experience_months(work_experience: list) -> int:
    total_months = 0
    now = datetime.now()

    for exp in work_experience:
        dates = exp.get("dates", "")
        if not dates:
            continue

        # Normalize dash
        dates = dates.replace("–", "-")

        try:
            parts = [p.strip() for p in dates.split("-")]
            if len(parts) != 2:
                continue

            start_date = parser.parse(parts[0])
            end_str = parts[1].lower()

            if "present" in end_str:
                end_date = now
            else:
                end_date = parser.parse(parts[1])

            # Use relativedelta for accurate diff
            delta = relativedelta(end_date, start_date)
            months = delta.years * 12 + delta.months
            if months > 0:
                total_months += months
        except Exception:
            continue

    return total_months


@app.get("/stats/degree-distribution/{job_role}")
def get_degree_distribution(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    counters = Counter()
    for doc in collection.find({"job_id": job_id}, {"education": 1}):
        for edu in doc.get("education", []):
            deg = edu.get("degree", "").lower()
            if "bachelor" in deg or "bsc" in deg:
                counters["Bachelors"] += 1
            elif "master" in deg or "msc" in deg:
                counters["Masters"] += 1
            elif "diploma" in deg or "dip" in deg:
                counters["Diploma"] += 1
            elif "phd" in deg:
                counters["PhD"] += 1
            else:
                counters["Other"] += 1
    return counters

@app.get("/jobs/titles")
async def get_job_titles():
    titles = job_collection.distinct("title")
    return {"titles": titles}

@app.get("/stats/skill-distribution/{job_role}")
def get_skill_distribution(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    skill_counts = Counter()
    for doc in collection.find({"job_id": job_id}, {"skills": 1}):
        for skill in doc.get("skills", []):
            skill_normalized = skill.strip().lower().capitalize()
            skill_counts[skill_normalized] += 1

    return dict(skill_counts.most_common()) 

@app.get("/candidates/by-job/{job_role}")
def get_candidates_by_job(job_role: str = Path(..., description="Job role name")):
    job_id = get_job_id_by_role(job_role)
    candidates = collection.find({"job_id": job_id})
    result = []

    for c in candidates:
        result.append({
            "id": str(c["_id"]),
            "name": c.get("name"),
            "email": c.get("email"),
            "phone": c.get("phone"),
            "skills": c.get("skills", []),
            "education": c.get("education", []),
            "work_experience": c.get("work_experience", []),
            "upload_date": c.get("upload_date")
        })

    if not result:
        raise HTTPException(status_code=404, detail="No candidates found for this job")

    return result

@app.get("/candidates/score-buckets/{job_role}")
def get_candidates_by_score_buckets(job_role: str = Path(..., description="Job role name")):
    # Fetch the job ID based on the job role
    job_id = get_job_id_by_role(job_role)
    if not job_id:
        return {"error": f"Job role '{job_role}' not found"}

    # Define score ranges
    score_ranges = {
        "0-20": (0, 20),
        "21-40": (21, 40),
        "41-60": (41, 60),
        "61-80": (61, 80),
        "81-100": (81, 100),
    }

    # Initialize grouped candidates
    grouped_candidates: Dict[str, List[dict]] = {key: [] for key in score_ranges}

    # Query resumes for the specific job_id and valid scores
    query = {"job_id": job_id, "ranking_score": {"$gte": 0}}
    for doc in collection.find(query):
        score = doc.get("ranking_score", 0)
        name = doc.get("name", "Unknown")
        email = doc.get("email", "N/A")
        phone = doc.get("phone", "N/A")
        education_list = doc.get("education", [])
        experience_list = doc.get("work_experience", [])
        cv_filename = doc.get("original_filename", "")

        # Extract latest education
        education = (
            education_list[-1]["degree"]
            if education_list and "degree" in education_list[-1]
            else "N/A"
        )

        # Estimate experience duration from work_experience
        experience = f"{len(experience_list)} job(s)" if experience_list else "0 jobs"

        # Generate CV link
        cv_link = f"/static/cvs/{cv_filename}"

        # Create candidate object
        candidate = {
            "name": name,
            "email": email,
            "phone": phone,
            "education": education,
            "experience": experience,
            "cvLink": cv_link,
            "score": score,
        }

        # Place into appropriate score bin
        for label, (low, high) in score_ranges.items():
            if low <= score <= high:
                grouped_candidates[label].append(candidate)
                break

    return grouped_candidates
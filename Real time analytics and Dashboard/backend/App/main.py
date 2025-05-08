# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter,Path
from pymongo import MongoClient
from config import MONGO_URL, DB_NAME, COLLECTION_NAME
from datetime import datetime
from collections import Counter
#from db import collection

app = FastAPI()
origins = [""] 

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]
job_collection = db['jobs']

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

connected_clients = []

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
    for doc in collection.find({"job_id": job_id}, {"score": 1}):
        score = doc.get("score", 0)
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
    current_year = datetime.now().year

    for doc in collection.find({"job_id": job_id}, {"work_experience": 1}):
        total_years = 0
        for exp in doc.get("work_experience", []):
            dates = exp.get("dates", "")
            try:
                if "Present" in dates:
                    start_year = int(dates.split()[-3])
                    end_year = current_year
                else:
                    parts = dates.split()
                    start_year = int(parts[1])
                    end_year = int(parts[-1])
                total_years += max(0, end_year - start_year)
            except:
                continue

        if total_years <= 1:
            buckets["0-1"] += 1
        elif total_years <= 4:
            buckets["2-4"] += 1
        elif total_years <= 8:
            buckets["5-8"] += 1
        else:
            buckets["9+"] += 1
    return buckets

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
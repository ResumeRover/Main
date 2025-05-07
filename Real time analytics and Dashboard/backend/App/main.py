# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from db import collection

app = FastAPI()
origins = [""] 

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

connected_clients = []

@app.websocket("/ws")
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
        connected_clients.remove(websocket)

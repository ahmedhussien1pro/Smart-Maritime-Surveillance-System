from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI(
    title="Smart Maritime AI Detection Service",
    description="YOLOv8-Sea Computer Vision Microservice for Naval Target Detection",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "system": "Smart Maritime AI Vision Engine",
        "model": "YOLOv8-Sea Naval Target Detector",
        "status": "active",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "online", "model_loaded": True, "gpu_acceleration": True}

@app.post("/detect")
def detect_targets():
    """Simulate YOLOv8-Sea detection on maritime camera frame"""
    detected = random.random() > 0.4
    if detected:
        target_class = random.choice(["Hostile Speedboat", "Unidentified Vessel", "Patrol Boat"])
        confidence = round(random.uniform(0.75, 0.98), 2)
        bbox = {
            "x": random.randint(25, 55),
            "y": random.randint(20, 45),
            "width": random.randint(20, 35),
            "height": random.randint(20, 35)
        }
    else:
        target_class = "Clear"
        confidence = 0.0
        bbox = None

    return {
        "timestamp": time.time(),
        "detected": detected,
        "class": target_class,
        "confidence": confidence,
        "tracking": detected,
        "fps": random.randint(26, 32),
        "bbox": bbox
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

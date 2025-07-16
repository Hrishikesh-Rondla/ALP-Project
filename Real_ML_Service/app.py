
#     app.run(host='0.0.0.0', port=8000)

# Real_ML_Service/app.py (FINAL CORRECTED VERSION)

import torch
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from model import FaceEmotionTransformer

# --- Server Setup ---
app = Flask(__name__)
CORS(app) 

device = torch.device("cpu")

emotion_labels = {
    0: "angry", 1: "disgust", 2: "fear",
    3: "happy", 4: "sad", 5: "surprise", 6: "neutral"
}

# --- Load Your Model ---
print("Loading PyTorch model...")
model = FaceEmotionTransformer(num_classes=7)
model.load_state_dict(torch.load("face_transformer_model.pt", map_location=device))
model.to(device)
model.eval()
print("✅ Model loaded successfully!")


# --- API Endpoint for Predictions ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    coords = np.array(data['landmarks'])

    # --- THIS IS THE FIX! ---
    # The front-end sends 478 landmarks, but the model was trained on 468.
    # We simply take the first 468 landmarks to match what the model expects.
    coords = coords[:468]
    # --- END OF FIX ---

    # Pre-process landmarks exactly like you did in training
    coords = coords - coords[1] 
    coords = coords / np.linalg.norm(coords, axis=1).max()
    
    input_tensor = torch.tensor([coords], dtype=torch.float32).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        prediction_index = torch.argmax(output).item()
        emotion = emotion_labels[prediction_index]

    return jsonify({'emotion': emotion})


# --- Start the Server ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)




# #     app.run(host='0.0.0.0', port=8000)

# # Real_ML_Service/app.py (FINAL CORRECTED VERSION)

# import torch
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# from model import FaceEmotionTransformer

# # --- Server Setup ---
# app = Flask(__name__)
# CORS(app) 

# device = torch.device("cpu")

# emotion_labels = {
#     0: "angry", 1: "disgust", 2: "fear",
#     3: "happy", 4: "sad", 5: "surprise", 6: "neutral"
# }

# # --- Load Your Model ---
# print("Loading PyTorch model...")
# model = FaceEmotionTransformer(num_classes=7)
# model.load_state_dict(torch.load("face_transformer_model.pt", map_location=device))
# model.to(device)
# model.eval()
# print("✅ Model loaded successfully!")


# # --- API Endpoint for Predictions ---
# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     coords = np.array(data['landmarks'])

#     # --- THIS IS THE FIX! ---
#     # The front-end sends 478 landmarks, but the model was trained on 468.
#     # We simply take the first 468 landmarks to match what the model expects.
#     coords = coords[:468]
#     # --- END OF FIX ---

#     # Pre-process landmarks exactly like you did in training
#     coords = coords - coords[1] 
#     coords = coords / np.linalg.norm(coords, axis=1).max()
    
#     input_tensor = torch.tensor([coords], dtype=torch.float32).to(device)

#     with torch.no_grad():
#         output = model(input_tensor)
#         prediction_index = torch.argmax(output).item()
#         emotion = emotion_labels[prediction_index]

#     return jsonify({'emotion': emotion})


# # --- Start the Server ---
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8000)

# Real_ML_Service/app.py (DEFINITIVE, SENSITIVE PREDICTIONS)

import torch
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from model import FaceEmotionTransformer

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})
device = torch.device("cpu")
emotion_labels = { 0: "angry", 1: "disgust", 2: "fear", 3: "happy", 4: "sad", 5: "surprise", 6: "neutral" }

print("Loading PyTorch model...")
model = FaceEmotionTransformer(num_classes=7)
model.load_state_dict(torch.load("face_transformer_model.pt", map_location=device))
model.to(device)
model.eval()
print("✅ Model loaded successfully!")

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    try:
        data = request.get_json()
        coords = np.array(data['landmarks'], dtype=np.float32)
        if coords.shape[0] != 468:
            coords = coords[:468]

        coords = coords - coords[1]
        norm = np.linalg.norm(coords, axis=1).max()
        if norm > 0:
            coords = coords / norm
        
        input_tensor = torch.from_numpy(coords).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
            top_prob, top_idx = torch.topk(probs, 2)
            predicted_emotion = emotion_labels[top_idx[0].item()]
            
            # If "neutral" is the top choice but the model isn't very sure (less than 70% confident),
            # then choose the second best option. This makes the tracker more expressive.
            if predicted_emotion == 'neutral' and top_prob[0] < 0.70:
                predicted_emotion = emotion_labels[top_idx[1].item()]

        return jsonify({'emotion': predicted_emotion})
    
    except Exception as e:
        print(f"!!! PREDICTION FAILED: {e}")
        return jsonify({'error': 'Prediction failed on server'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

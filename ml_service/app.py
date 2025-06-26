# ml_service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import base64
import io
# import tensorflow as tf # Uncomment this when you have your model

app = Flask(__name__)
CORS(app) # This is crucial to allow requests from your React app

# --- MODEL LOADING ---
# Load your trained transformer model here. This is done only ONCE.
# model = tf.keras.models.load_model('path/to/your/model.h5')
# emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
print("ML Service is running. NOTE: Using DUMMY model logic.")
# ---------------------

def preprocess_image(image_data_base64):
    image_bytes = base64.b64decode(image_data_base64)
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert('L')  # Convert to grayscale
    image = image.resize((48, 48)) # Resize for FER-2013
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=-1) # Add channel dimension
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        image_data = data['image'].split(',')[1]
        processed_image = preprocess_image(image_data)

        # --- PREDICTION LOGIC ---
        # Replace this dummy logic with your actual model prediction
        # prediction = model.predict(processed_image)
        # predicted_index = np.argmax(prediction)
        # predicted_emotion = emotion_labels[predicted_index]
        
        # Dummy logic for now: Cycle through emotions
        import random
        emotions = ["happy", "sad", "neutral", "surprised", "angry"]
        predicted_emotion = random.choice(emotions)
        # --- END OF DUMMY LOGIC ---
        
        return jsonify({'emotion': predicted_emotion})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
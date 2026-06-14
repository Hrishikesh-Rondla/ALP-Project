# ALP-Project
In today's rapidly evolving educational landscape, personalized learning approaches are the way to go, especially for children with learning difficulties. Traditional educational methods often fall short in addressing the diverse needs of such learners, leading to disengagement and limited progress. With advancements in artificial intelligence and deep learning, particularly in transformer-based models, there is an opportunity to create intelligent systems that can better understand and respond to a child's unique emotional and behavioral cues. ALP (Adaptive Learning Path) is an adaptive educational platform that uses transformer-based models to analyze facial expressions and gameplay behaviors of children with learning difficulties. This system will dynamically adapt the learning path of the child following challenges and feedback based on the detected emotional states promoting sustained engagement and improved learning outcomes. While the system adjusts the learning path in real-time, it will always prioritize and adhere to the therapists recommended path, ensuring that the adaptive process remains aligned with professional therapeutic goals.
In today's rapidly evolving educational landscape, personalized learning approaches are the way to go, especially for children with learning difficulties. Traditional educational methods often fall short in addressing the diverse needs of such learners, leading to disengagement and limited progress. With advancements in artificial intelligence and deep learning, particularly in transformer-based models, there is an opportunity to create intelligent systems that can better understand and respond to a child's unique emotional and behavioral cues.
**ALP (Adaptive Learning Path)** is an adaptive educational platform that uses transformer-based models to analyze facial expressions and gameplay behaviors of children with learning difficulties. This system dynamically adapts the learning path of the child following challenges and feedback based on the detected emotional states, promoting sustained engagement and improved learning outcomes. While the system adjusts the learning path in real-time, it will always prioritize and adhere to the therapist's recommended path, ensuring that the adaptive process remains aligned with professional therapeutic goals.
---
## 🏛️ Project Architecture
The project consists of three main components:
1. **Frontend (`front_end/my-app`)**: A React application that provides the user interface for students, teachers, therapists, and administrators. It captures facial landmarks using MediaPipe and sends them to the ML service.
2. **Backend (`back_end`)**: An Express/Node.js server handling user authentication, quiz data, user progress, and dashboard analytics. It interacts with MongoDB.
3. **ML Service (`Real_ML_Service`)**: A Flask web service running a PyTorch-based Face Emotion Transformer model to classify emotions from facial landmarks in real-time.
---
## 🚀 Getting Started & Startup Workflow
Follow these steps to get the application cloned, configured, and running locally.
### 📋 Prerequisites
Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3.8+](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
---
### Step 1: Clone the Repository
Clone the repository from GitHub and navigate into the project directory:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ALP-Project.git
cd ALP-Project
```
---
### Step 2: Set Up and Run the Backend
1. Navigate to the backend directory:
   ```bash
   cd back_end
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `back_end` folder and configure the following variables (you can use your MongoDB connection string and choose secure credentials):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   SUPERADMIN_USERNAME=admin
   SUPERADMIN_PASSWORD=admin_password
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The backend will run on [http://localhost:5000](http://localhost:5000).*
---
### Step 3: Set Up and Run the Machine Learning Service
1. Open a new terminal window/tab, navigate to the `Real_ML_Service` directory:
   ```bash
   cd Real_ML_Service
   ```
2. Create and activate a Python virtual environment:
   * **Windows (Command Prompt):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install the required Python packages:
   ```bash
   pip install torch numpy flask flask-cors
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
   *The ML service will run on [http://localhost:8000](http://localhost:8000).*
---
### Step 4: Set Up and Run the Frontend React Application
1. Open another terminal window/tab, navigate to the frontend directory:
   ```bash
   cd front_end/my-app
   ```
2. Install the frontend Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The frontend will compile and open automatically on [http://localhost:3000](http://localhost:3000).*
---
## 🚦 Port & URL reference
|
 Service 
|
 Address 
|
 Description 
|
|
:---
|
:---
|
:---
|
|
**
Frontend
**
|
`http://localhost:3000`
|
 User portal, quizzes & dashboard UI 
|
|
**
Backend API
**
|
`http://localhost:5000`
|
 Express REST API & Database controller 
|
|
**
ML Service
**
|
`http://localhost:8000`
|
 Flask / PyTorch face landmark classification 
|

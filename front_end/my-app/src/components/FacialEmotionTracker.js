


// frontend/src/components/FacialEmotionTracker.js (FINAL, STABLE VERSION)

import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Smile, Frown, Meh, Angry, AlertCircle } from 'lucide-react';

const FacialEmotionTracker = ({ currentEmotion, onEmotionChange }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    const predictWebcam = useCallback(async (faceLandmarker) => {
        if (!faceLandmarker) return;

        // --- SAFETY CHECK TO PREVENT "DIVIDE BY ZERO" CRASH ---
        if (
            videoRef.current &&
            videoRef.current.readyState >= 4 &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
        ) {
            const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                const landmarks = results.faceLandmarks[0].map(lm => [lm.x, lm.y, lm.z]);
                try {
                    const res = await axios.post('http://localhost:8000/predict', { landmarks });
                    if (onEmotionChange) onEmotionChange(res.data.emotion);
                    setError(null);
                } catch (err) {
                    setError("API Error");
                }
            }
        }

        requestAnimationFrame(() => predictWebcam(faceLandmarker));
    }, [onEmotionChange]);


    useEffect(() => {
        let faceLandmarker;

        const createFaceLandmarker = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                startCamera();

            } catch (err) {
                console.error("Error creating FaceLandmarker:", err);
                setError("Init Failed");
            }
        };

        const startCamera = () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                            videoRef.current.addEventListener('loadeddata', () => predictWebcam(faceLandmarker));
                        }
                    })
                    .catch(err => {
                        console.error("Camera access denied:", err);
                        setError("Camera Denied");
                    });
            }
        };

        createFaceLandmarker();

    }, [predictWebcam]);

    const EmotionDisplay = {
        happy: { icon: <Smile className="text-success" />, text: "Happy" },
        sad: { icon: <Frown className="text-primary" />, text: "Sad" },
        neutral: { icon: <Meh className="text-muted" />, text: "Neutral" },
        angry: { icon: <Angry className="text-danger" />, text: "Angry" },
        surprise: { icon: <AlertCircle className="text-warning" />, text: "Surprised" },
        fear: { icon: <Frown className="text-secondary" />, text: "Fear" },
        disgust: { icon: <Angry className="text-info" />, text: "Disgust" },
        'loading...': { icon: <div className="spinner-border spinner-border-sm" />, text: "Loading..." },
    };

    const display = EmotionDisplay[currentEmotion] || EmotionDisplay['neutral'];

    return (
        <div className="card shadow-lg rounded-4 position-fixed bottom-0 end-0 m-3" style={{ width: '200px', zIndex: 1050 }}>
            <div className="card-header bg-dark text-white small p-2 text-center">Emotion Tracker</div>
            <div className="card-body p-1 position-relative">
                <video ref={videoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)', width: '100%', height: 'auto', borderRadius: '0.5rem', background: '#222' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', minHeight: '40px' }}>
                    <div className="text-white d-flex align-items-center">
                        {error ? <AlertCircle className="text-danger me-2" size={16} /> : display.icon}
                        <span className="fw-bold ms-2 text-capitalize small">{error || display.text}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacialEmotionTracker;







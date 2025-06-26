// import React, { useRef, useEffect, useState } from 'react';
// import * as faceapi from 'face-api.js';
// import { Smile, Frown, Meh, Angry, AlertCircle, Video } from 'lucide-react';

// const FacialEmotionTracker = () => {
//     const videoRef = useRef();
//     const [currentEmotion, setCurrentEmotion] = useState('loading...');
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // --- Step 1: Prioritize starting the camera ---
//         const startVideo = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             } catch (err) {
//                 console.error("Camera access denied:", err);
//                 setError("Camera access was denied. Please allow camera permissions.");
//             }
//         };

//         startVideo();
//     }, []);

//     // --- Step 2: Attempt to load models and start detection only after the video plays ---
//     useEffect(() => {
//         const loadModelsAndDetect = async () => {
//             // This function will only run if the camera is working and the video starts playing.
//             try {
//                 // Set initial state to loading
//                 setCurrentEmotion('loading models...');

//                 await Promise.all([
//                     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//                     faceapi.nets.faceExpressionNet.loadFromUri('/models')
//                 ]);

//                 // If models loaded, start the detection interval
//                 const detectionInterval = setInterval(async () => {
//                     if (videoRef.current && !videoRef.current.paused) {
//                         const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
//                         if (detections) {
//                             const expressions = detections.expressions;
//                             const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
//                             setError(null); // Clear any previous model errors
//                             setCurrentEmotion(dominantEmotion);
//                         } else {
//                             setCurrentEmotion('no face');
//                         }
//                     }
//                 }, 1000); // Check for emotions every second

//                 return () => clearInterval(detectionInterval);
//             } catch (err) {
//                 console.error("Error loading face-api models:", err);
//                 // Set a specific error for model loading failure
//                 setError("AI models not found. Face tracking is disabled.");
//                 setCurrentEmotion('error');
//             }
//         };

//         const videoEl = videoRef.current;
//         if (videoEl) {
//             // The 'play' event fires when the video stream from the camera begins.
//             videoEl.addEventListener('play', loadModelsAndDetect);
//         }

//         return () => {
//             if (videoEl) {
//                 videoEl.removeEventListener('play', loadModelsAndDetect);
//             }
//         };
//     }, []);

//     const EmotionDisplay = {
//         happy: { icon: <Smile className="text-success" />, text: "Happy" },
//         sad: { icon: <Frown className="text-primary" />, text: "Sad" },
//         neutral: { icon: <Meh className="text-muted" />, text: "Neutral" },
//         angry: { icon: <Angry className="text-danger" />, text: "Angry" },
//         surprised: { icon: <AlertCircle className="text-warning" />, text: "Surprised" },
//         'loading models...': { icon: <div className="spinner-border spinner-border-sm text-white" />, text: "Loading AI..." },
//         'no face': { icon: <Video className="text-white" />, text: "No Face" },
//         error: { icon: <AlertCircle className="text-danger" />, text: "Error" },
//         default: { icon: <Meh className="text-muted" />, text: "Neutral" },
//     };

//     const display = EmotionDisplay[currentEmotion] || EmotionDisplay.default;

//     return (
//         <div className="card shadow-lg rounded-4 position-fixed bottom-0 end-0 m-3" style={{ width: '200px', zIndex: 1050 }}>
//             <div className="card-header bg-dark text-white small p-2 text-center">
//                 Emotion Tracker
//             </div>
//             <div className="card-body p-1 position-relative">
//                 {/* The video element is always rendered, waiting for the stream */}
//                 <video ref={videoRef} autoPlay muted playsInline width="190" height="140" style={{ borderRadius: '0.5rem', backgroundColor: '#000' }} />

//                 <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
//                     {/* Display a specific error message if it exists */}
//                     {error ? (
//                         <>
//                             <AlertCircle className="text-danger me-2" size={16} />
//                             <span className="text-white small fw-bold">Model Error</span>
//                         </>
//                     ) : (
//                         <>
//                             {display.icon}
//                             <span className="text-white fw-bold ms-2 text-capitalize small">{display.text}</span>
//                         </>
//                     )}
//                 </div>
//             </div>
//             {/* Show a more detailed error tooltip if there's an issue */}
//             {error && <div className="card-footer small p-2 bg-danger text-white text-center">{error}</div>}
//         </div>
//     );
// };

// export default FacialEmotionTracker;

// src/components/FacialEmotionTracker.js

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Smile, Frown, Meh, Angry, AlertCircle, Video } from 'lucide-react';

const FacialEmotionTracker = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null); // We need a canvas to capture frames
    const [currentEmotion, setCurrentEmotion] = useState('loading...');
    const [error, setError] = useState(null);

    // Start the camera when the component mounts
    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setError("Camera access was denied.");
                setCurrentEmotion('error');
            }
        };
        startVideo();
    }, []);

    // Set up an interval to send frames to the ML server
    useEffect(() => {
        const intervalId = setInterval(async () => {
            // Make sure the video is playing and we have a canvas
            if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert the canvas image to a Base64 string
                const imageData = canvas.toDataURL('image/jpeg');
                
                try {
                    // API CALL to our Flask server's /predict endpoint
                    const res = await axios.post('http://localhost:8000/predict', { image: imageData });
                    
                    setCurrentEmotion(res.data.emotion);
                    setError(null); // Clear previous errors on success

                } catch (apiError) {
                    console.error("ML API Error:", apiError);
                    setError("API Error"); // Set a generic error state
                    setCurrentEmotion('error');
                }
            }
        }, 2000); // Send a frame every 2 seconds

        // Cleanup function to stop the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once

    const EmotionDisplay = {
        happy: { icon: <Smile className="text-success" />, text: "Happy" },
        sad: { icon: <Frown className="text-primary" />, text: "Sad" },
        neutral: { icon: <Meh className="text-muted" />, text: "Neutral" },
        angry: { icon: <Angry className="text-danger" />, text: "Angry" },
        surprised: { icon: <AlertCircle className="text-warning" />, text: "Surprised" },
        'loading...': { icon: <div className="spinner-border spinner-border-sm text-white" />, text: "Loading..." },
        'no face': { icon: <Video className="text-white" />, text: "No Face" },
        error: { icon: <AlertCircle className="text-danger" />, text: "Error" },
        default: { icon: <Meh className="text-muted" />, text: "Neutral" },
    };

    const display = EmotionDisplay[currentEmotion] || EmotionDisplay.default;

    return (
        <div className="card shadow-lg rounded-4 position-fixed bottom-0 end-0 m-3" style={{ width: '200px', zIndex: 1050 }}>
            <div className="card-header bg-dark text-white small p-2 text-center">
                Emotion Tracker
            </div>
            <div className="card-body p-1 position-relative">
                <video ref={videoRef} autoPlay muted playsInline width="190" height="140" style={{ borderRadius: '0.5rem', backgroundColor: '#000' }} />
                {/* Add a hidden canvas used for capturing frames */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    {error ? (
                        <>
                            <AlertCircle className="text-danger me-2" size={16} />
                            <span className="text-white small fw-bold">{error}</span>
                        </>
                    ) : (
                        <>
                            {display.icon}
                            <span className="text-white fw-bold ms-2 text-capitalize small">{display.text}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacialEmotionTracker;
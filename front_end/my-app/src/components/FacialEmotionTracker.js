


// // frontend/src/components/FacialEmotionTracker.js (FINAL, STABLE VERSION)

// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
// import { Smile, Frown, Meh, Angry, AlertCircle } from 'lucide-react';

// const FacialEmotionTracker = ({ currentEmotion, onEmotionChange }) => {
//     const videoRef = useRef(null);
//     const [error, setError] = useState(null);

//     const predictWebcam = useCallback(async (faceLandmarker) => {
//         if (!faceLandmarker) return;

//         // --- SAFETY CHECK TO PREVENT "DIVIDE BY ZERO" CRASH ---
//         if (
//             videoRef.current &&
//             videoRef.current.readyState >= 4 &&
//             videoRef.current.videoWidth > 0 &&
//             videoRef.current.videoHeight > 0
//         ) {
//             const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());

//             if (results.faceLandmarks && results.faceLandmarks.length > 0) {
//                 const landmarks = results.faceLandmarks[0].map(lm => [lm.x, lm.y, lm.z]);
//                 try {
//                     const res = await axios.post('http://localhost:8000/predict', { landmarks });
//                     if (onEmotionChange) onEmotionChange(res.data.emotion);
//                     setError(null);
//                 } catch (err) {
//                     setError("API Error");
//                 }
//             }
//         }

//         requestAnimationFrame(() => predictWebcam(faceLandmarker));
//     }, [onEmotionChange]);


//     useEffect(() => {
//         let faceLandmarker;

//         const createFaceLandmarker = async () => {
//             try {
//                 const filesetResolver = await FilesetResolver.forVisionTasks(
//                     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
//                 );

//                 faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//                     baseOptions: {
//                         modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
//                         delegate: "GPU"
//                     },
//                     runningMode: "VIDEO",
//                     numFaces: 1
//                 });

//                 startCamera();

//             } catch (err) {
//                 console.error("Error creating FaceLandmarker:", err);
//                 setError("Init Failed");
//             }
//         };

//         const startCamera = () => {
//             if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//                 navigator.mediaDevices.getUserMedia({ video: true })
//                     .then(stream => {
//                         if (videoRef.current) {
//                             videoRef.current.srcObject = stream;
//                             videoRef.current.addEventListener('loadeddata', () => predictWebcam(faceLandmarker));
//                         }
//                     })
//                     .catch(err => {
//                         console.error("Camera access denied:", err);
//                         setError("Camera Denied");
//                     });
//             }
//         };

//         createFaceLandmarker();

//     }, [predictWebcam]);

//     const EmotionDisplay = {
//         happy: { icon: <Smile className="text-success" />, text: "Happy" },
//         sad: { icon: <Frown className="text-primary" />, text: "Sad" },
//         neutral: { icon: <Meh className="text-muted" />, text: "Neutral" },
//         angry: { icon: <Angry className="text-danger" />, text: "Angry" },
//         surprise: { icon: <AlertCircle className="text-warning" />, text: "Surprised" },
//         fear: { icon: <Frown className="text-secondary" />, text: "Fear" },
//         disgust: { icon: <Angry className="text-info" />, text: "Disgust" },
//         'loading...': { icon: <div className="spinner-border spinner-border-sm" />, text: "Loading..." },
//     };

//     const display = EmotionDisplay[currentEmotion] || EmotionDisplay['neutral'];

//     return (
//         <div className="card shadow-lg rounded-4 position-fixed bottom-0 end-0 m-3" style={{ width: '200px', zIndex: 1050 }}>
//             <div className="card-header bg-dark text-white small p-2 text-center">Emotion Tracker</div>
//             <div className="card-body p-1 position-relative">
//                 <video ref={videoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)', width: '100%', height: 'auto', borderRadius: '0.5rem', background: '#222' }} />
//                 <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', minHeight: '40px' }}>
//                     <div className="text-white d-flex align-items-center">
//                         {error ? <AlertCircle className="text-danger me-2" size={16} /> : display.icon}
//                         <span className="fw-bold ms-2 text-capitalize small">{error || display.text}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FacialEmotionTracker;


// frontend/src/components/FacialEmotionTracker.js (DEFINITIVE, STABLE ARCHITECTURE)

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Smile, Frown, Meh, Angry, AlertCircle, Camera, CameraOff } from 'lucide-react';

const FacialEmotionTracker = ({ onEmotionChange }) => {
    const videoRef = useRef(null);
    const onEmotionChangeRef = useRef(onEmotionChange);

    // Keep a ref to the latest callback to prevent stale closures in the loop
    useEffect(() => {
        onEmotionChangeRef.current = onEmotionChange;
    }, [onEmotionChange]);

    const [error, setError] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('loading...');

    useEffect(() => {
        let landmarker;
        let predictionInterval;

        const initialize = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
                
                // --- THIS IS THE DEFINITIVE FIX ---
                // We are forcing MediaPipe to use its most stable backend (WASM)
                // instead of the potentially unstable GPU or XNNPACK delegates.
                // This prevents the low-level crashes you are experiencing.
                landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "WASM" // Use the stable WASM delegate
                    },
                    runningMode: "VIDEO",
                    numFaces: 1
                });
                // --- END OF FIX ---

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        setIsCameraOn(true);
                        // Start a controlled, throttled loop
                        predictionInterval = setInterval(async () => {
                            if (videoRef.current && landmarker) {
                                const results = landmarker.detectForVideo(videoRef.current, performance.now());
                                if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                                    const landmarks = results.faceLandmarks[0].map(lm => [lm.x, lm.y, lm.z]);
                                    try {
                                        const res = await axios.post('http://localhost:8000/predict', { landmarks });
                                        setCurrentEmotion(res.data.emotion);
                                        if (onEmotionChangeRef.current) {
                                            onEmotionChangeRef.current(res.data.emotion);
                                        }
                                        setError(null);
                                    } catch (err) {
                                        setError("API Error");
                                    }
                                }
                            }
                        }, 500); // Predict twice per second
                    };
                }
            } catch (err) {
                console.error("Initialization Failed:", err);
                setError("Camera/Init Failed");
            }
        };

        initialize();

        // Cleanup function
        return () => {
            clearInterval(predictionInterval);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (landmarker) {
                landmarker.close();
            }
        };
    }, []); // Empty dependency array ensures this runs only once.

    // ... (The JSX for rendering is unchanged)
    const EmotionDisplay = { happy: { icon: <Smile className="text-success" />, text: "Happy" }, sad: { icon: <Frown className="text-primary" />, text: "Sad" }, neutral: { icon: <Meh style={{color: 'var(--text-secondary)'}} />, text: "Neutral" }, angry: { icon: <Angry className="text-danger" />, text: "Angry" }, surprise: { icon: <AlertCircle className="text-warning" />, text: "Surprised" }};
    const display = EmotionDisplay[currentEmotion] || { icon: <CameraOff style={{color: 'var(--text-secondary)'}} />, text: "..." };
    return (
        <div className="card shadow-lg rounded-4 position-fixed bottom-0 end-0 m-3" style={{ width: '200px', zIndex: 1050, backgroundColor: 'var(--background-card)', border: '1px solid var(--border-color)'}}>
            <div className="card-header border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}><span className="small fw-bold" style={{ color: 'var(--text-primary)'}}>Emotion Tracker</span>{isCameraOn ? <Camera size={16} className="text-success" /> : <CameraOff size={16} style={{color: 'var(--text-secondary)'}} />}</div>
            <div className="card-body p-1 position--relative">
                <video ref={videoRef} autoPlay playsInline muted style={{ transform: 'scaleX(-1)', width: '100%', borderRadius: '0.5rem', background: '#222' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', minHeight: '40px' }}><div className="text-white d-flex align-items-center">{error ? <AlertCircle className="text-danger me-2" size={16} /> : display.icon}<span className="fw-bold ms-2 text-capitalize small">{error || (isCameraOn ? display.text : 'Inactive')}</span></div></div>
            </div>
        </div>
    );
};

export default FacialEmotionTracker;







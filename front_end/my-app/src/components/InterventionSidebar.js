import React, { useState } from 'react';
import { Coffee, Gamepad2, ChevronsRight } from 'lucide-react';
import BreathingAnimation from './BreathingAnimation';
import FlappyBirdGame from './FlappyBirdGame';

const InterventionSidebar = ({ show, onClose }) => {
    const [mode, setMode] = useState('options'); // 'options', 'break', or 'game'
    const handleClose = () => { setMode('options'); onClose(); };
    const handleTakeBreak = () => setMode('break');
    const handlePlayGame = () => setMode('game');
    
    return (
        <div style={{ position: 'fixed', top: 0, right: show ? '0' : '-400px', width: '350px', height: '100vh', backgroundColor: 'var(--background-card)', boxShadow: '-5px 0px 15px rgba(0,0,0,0.1)', transition: 'right 0.5s ease-in-out', zIndex: 1100, borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div className="p-4 flex-grow-1 d-flex flex-column">
                {mode === 'options' && (<>
                    <h3 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Feeling Stuck?</h3>
                    <p style={{ color: 'var(--text-secondary)'}}>It's completely okay. Take a moment for yourself.</p>
                    <div className="list-group mt-3">
                        <button onClick={handleTakeBreak} className="list-group-item list-group-item-action d-flex align-items-center mb-2 border-1 rounded-3"><Coffee className="me-3 text-warning" /><div><p className="mb-0 fw-bold">Take a 1-Minute Break</p><small>A short breathing exercise to reset.</small></div></button>
                        <button onClick={handlePlayGame} className="list-group-item list-group-item-action d-flex align-items-center mb-2 border-1 rounded-3"><Gamepad2 className="me-3 text-info" /><div><p className="mb-0 fw-bold">Play a Quick Game</p><small>A fun distraction to clear your head.</small></div></button>
                        <button onClick={handleClose} className="list-group-item list-group-item-action d-flex align-items-center border-1 rounded-3"><ChevronsRight className="me-3 text-primary" /><div><p className="mb-0 fw-bold">I'm Okay, Continue Quiz</p><small>Let's get back to it.</small></div></button>
                    </div>
                </>)}
                {mode === 'break' && (<div className="text-center h-100 d-flex flex-column"><h4 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Focus on your breath</h4><BreathingAnimation /><button onClick={handleClose} className="btn btn-secondary mt-auto">Back to Quiz</button></div>)}
                {mode === 'game' && (<div className="text-center h-100 d-flex flex-column"><h4 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Quick Game Break</h4><div className="d-flex justify-content-center flex-grow-1 align-items-center"><FlappyBirdGame /></div><button onClick={handleClose} className="btn btn-secondary mt-auto">Back to Quiz</button></div>)}
            </div>
        </div>
    );
};
export default InterventionSidebar;

// frontend/src/components/InterventionSidebar.js (UPDATED with Snake Game)

// import React, { useState } from 'react';
// import { Coffee, Gamepad2, ChevronsRight } from 'lucide-react';
// import BreathingAnimation from './BreathingAnimation';
// import SnakeGame from './SnakeGame'; // Import Snake instead of Flappy Bird

// const InterventionSidebar = ({ show, onClose }) => {
//     const [mode, setMode] = useState('options'); // 'options', 'break', or 'game'
//     const handleClose = () => { setMode('options'); onClose(); };
//     const handleTakeBreak = () => setMode('break');
//     const handlePlayGame = () => setMode('game');
    
//     return (
//         <div style={{ position: 'fixed', top: 0, right: show ? '0' : '-400px', width: '350px', height: '100vh', backgroundColor: 'var(--background-card)', boxShadow: '-5px 0px 15px rgba(0,0,0,0.1)', transition: 'right 0.5s ease-in-out', zIndex: 1100, borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
//             <div className="p-4 flex-grow-1 d-flex flex-column">
//                 {mode === 'options' && (<>
//                     <h3 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Feeling Stuck?</h3>
//                     <p style={{ color: 'var(--text-secondary)'}}>It's completely okay. Take a moment for yourself.</p>
//                     <div className="list-group mt-3">
//                         <button onClick={handleTakeBreak} className="list-group-item list-group-item-action d-flex align-items-center mb-2 border-1 rounded-3"><Coffee className="me-3 text-warning" /><div><p className="mb-0 fw-bold">Take a 1-Minute Break</p><small>A short breathing exercise to reset.</small></div></button>
//                         <button onClick={handlePlayGame} className="list-group-item list-group-item-action d-flex align-items-center mb-2 border-1 rounded-3"><Gamepad2 className="me-3 text-info" /><div><p className="mb-0 fw-bold">Play a Quick Game</p><small>A fun distraction to clear your head.</small></div></button>
//                         <button onClick={handleClose} className="list-group-item list-group-item-action d-flex align-items-center border-1 rounded-3"><ChevronsRight className="me-3 text-primary" /><div><p className="mb-0 fw-bold">I'm Okay, Continue Quiz</p><small>Let's get back to it.</small></div></button>
//                     </div>
//                 </>)}
//                 {mode === 'break' && (<div className="text-center h-100 d-flex flex-column"><h4 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Focus on your breath</h4><BreathingAnimation /><button onClick={handleClose} className="btn btn-secondary mt-auto">Back to Quiz</button></div>)}
//                 {mode === 'game' && (<div className="text-center h-100 d-flex flex-column"><h4 className="fw-bold" style={{ color: 'var(--text-primary)'}}>Quick Game Break</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Use Arrow Keys to move</p><div className="d-flex justify-content-center flex-grow-1 align-items-center"><SnakeGame /></div><button onClick={handleClose} className="btn btn-secondary mt-auto">Back to Quiz</button></div>)}
//             </div>
//         </div>
//     );
// };
// export default InterventionSidebar;
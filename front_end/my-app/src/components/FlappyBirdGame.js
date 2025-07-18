import React, { useEffect, useRef } from 'react';
const FlappyBirdGame = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const cvs = canvasRef.current;
        const ctx = cvs.getContext('2d');
        let frames = 0; const DEGREE = Math.PI / 180;
        const bird = {
            x: 50, y: 150, w: 34, h: 24, radius: 12, frame: 0, gravity: 0.15, jump: 3.6, speed: 0, rotation: 0,
            draw: function() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation); ctx.fillStyle = "#FFC107"; ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h); ctx.restore(); },
            flap: function() { this.speed = -this.jump; },
            update: function() { this.speed += this.gravity; this.y += this.speed; this.rotation = Math.min(Math.max(-25, this.speed * 8), 90) * DEGREE; if(this.y + this.h/2 >= cvs.height - 112){ this.y = cvs.height - 112 - this.h/2; if(state.current != state.over) state.current = state.over;} }
        };
        const pipes = {
            position: [], w: 53, h: 400, gap: 100, maxYPos: -150, speed: 2,
            draw: function() { for(let i=0; i<this.position.length; i++){ let p = this.position[i]; let topYPos = p.y; let bottomYPos = p.y + this.h + this.gap; ctx.fillStyle = "#28A745"; ctx.fillRect(p.x, topYPos, this.w, this.h); ctx.fillRect(p.x, bottomYPos, this.w, this.h); } },
            update: function() { if(state.current != state.game) return; if(frames%100 == 0) this.position.push({x: cvs.width, y: this.maxYPos * (Math.random() + 1)}); for(let i=0; i<this.position.length; i++){ let p = this.position[i]; p.x -= this.speed; let bottomPipeYPos = p.y + this.h + this.gap; if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){ state.current = state.over; } if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){ state.current = state.over; } if(p.x + this.w <= 0) this.position.shift(); } }
        };
        const state = { current: 0, getReady: 0, game: 1, over: 2 };
        function clickHandler(){ switch(state.current){ case state.getReady: state.current = state.game; break; case state.game: bird.flap(); break; case state.over: bird.y = 150; bird.speed = 0; pipes.position = []; state.current = state.getReady; break; } }
        cvs.addEventListener("click", clickHandler);
        function draw(){ ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0,0,cvs.width,cvs.height); bird.draw(); pipes.draw(); }
        function update(){ bird.update(); pipes.update(); }
        function loop(){ update(); draw(); frames++; requestAnimationFrame(loop); }
        loop();
        return () => cvs.removeEventListener("click", clickHandler);
    }, []);
    return <canvas ref={canvasRef} width="280" height="400" style={{ borderRadius: '8px', border: '1px solid var(--border-color)'}}></canvas>;
};
export default FlappyBirdGame;
import { useEffect, useRef } from "react"
import { AntsHome } from "./Elements/AntsHome";
import { Food } from "./Elements/Food";
import './App.css';

export const App = () => {
  const antsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const forgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const antsCtx = antsCanvasRef.current?.getContext('2d');
    const backgroundCtx = backgroundCanvasRef.current?.getContext('2d');
    const forgroundCtx = forgroundCanvasRef.current?.getContext('2d');

    if (antsCtx && backgroundCtx && forgroundCtx) {
      backgroundCtx.fillStyle = '#1f1f1f'
      backgroundCtx.fillRect(0, 0, backgroundCtx.canvas.width, backgroundCtx.canvas.height);
      const clearBackground = () => {
        backgroundCtx.fillStyle = '#1f1f1f08'
        backgroundCtx.fillRect(0, 0, backgroundCtx.canvas.width, backgroundCtx.canvas.height);
      }
      
      let animationFrameId: number;
      let oldTimeStamp: number;
      const antsHome = new AntsHome(antsCtx, backgroundCtx, forgroundCtx, 500, 30);
      antsHome.food = [new Food(forgroundCtx, 700, 100)];

      const fpsDisplay = document.getElementById('fps');

      antsHome.food.forEach((f) => {
        f.draw();
      });


      antsHome.ants.forEach((a) => {
        a.walkingTrail.draw();
      })

      const render:FrameRequestCallback = (timeStamp) => {
        clearBackground();
        antsCtx.clearRect(0, 0, antsCtx.canvas.width, antsCtx.canvas.height);
        if (fpsDisplay) {
          const secondsPassed = (timeStamp - (oldTimeStamp || 0)) / 1000;
          oldTimeStamp = timeStamp;
          fpsDisplay.innerHTML = `${Math.round(1 / secondsPassed)}fps`;
        }
        antsHome.drawAnts();
        animationFrameId = window.requestAnimationFrame(render)
      }
      render(Number(new Date()))
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#555',
        textAlign: 'center'
      }}
    >
      <p id="fps">0</p>
      <div style={{ position: 'relative' }}>
        <canvas ref={backgroundCanvasRef} width="1000" height="600" 
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
        <canvas ref={antsCanvasRef} width="1000" height="600" 
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
        <canvas ref={forgroundCanvasRef} width="1000" height="600" 
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
      </div>
      {/* <div className="canvas-container">
        <canvas 
          ref={antsCanvasRef}
          width={1000}
          height={600}
        />
        <canvas 
          ref={back}
          width={1000}
          height={600}
        />
      </div> */}
    </div>
  )
}

import { useEffect, useRef } from "react"
import { AntsHome } from "./Elements/AntsHome";
import { Food } from "./Elements/Food";
import './App.css';

export const App = () => {
  const antsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const antsCtx = antsCanvasRef.current?.getContext('2d');
    if (antsCtx) {
      const clearReact = () => {
        antsCtx.fillStyle = '#1f1f1f'
        antsCtx.fillRect(0, 0, antsCtx.canvas.width, antsCtx.canvas.height);
      }

      let animationFrameId: number;
      let oldTimeStamp: number;
      const antsHome = new AntsHome(antsCtx, 50, 30);
      antsHome.food = [new Food(antsCtx, 700, 100)];

      const fpsDisplay = document.getElementById('fps');

      const render:FrameRequestCallback = (timeStamp) => {
        if (fpsDisplay) {
          const secondsPassed = (timeStamp - (oldTimeStamp || 0)) / 1000;
          oldTimeStamp = timeStamp;
          fpsDisplay.innerHTML = `${Math.round(1 / secondsPassed)}fps`;
        }

        clearReact();
        antsHome.draw();
        antsHome.food.forEach((f) => {
          f.draw();
        })
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
        display: 'grid',
        placeItems: 'center',
        color: 'white'
      }}
    >
      <p id="fps">0</p>
      <div className="canvas-container">
        <canvas 
          ref={antsCanvasRef}
          width={1000}
          height={600}
        />
      </div>
    </div>
  )
}

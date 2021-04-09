import { useEffect, useRef } from "react"
import { AntsHome } from "./Elements/Ant";
import { Food } from "./Elements/Food";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      const clearReact = () => {
        context.fillStyle = '#1f1f1f'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      }

      let animationFrameId: number;
      let oldTimeStamp: number;
      const antsHome = new AntsHome(context, 50, 30);
      antsHome.foods = [new Food(context, 700, 520), new Food(context, 150, 520), new Food(context, 500, 120)];
      const fpsDisplay = document.getElementById('fps');

      const render:FrameRequestCallback = (timeStamp) => {
        if (fpsDisplay) {
          const secondsPassed = (timeStamp - (oldTimeStamp || 0)) / 1000;
          oldTimeStamp = timeStamp;
          fpsDisplay.innerHTML = `${Math.round(1 / secondsPassed)}fps`;
        }

        clearReact();
        antsHome.drawTrail();
        antsHome.foods.forEach(f => {
          f.draw();
        });
        antsHome.escape();
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
      <canvas 
        ref={canvasRef}
        width={1000}
        height={600}
      />
    </div>
  )
}

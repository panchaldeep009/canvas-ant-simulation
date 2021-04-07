import { useEffect, useRef } from "react"
import { WalkingAnt } from "./Elements/Ant";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      const clearReact = () => {
        context.fillStyle = '#444'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      }
      clearReact();
      
      const ants = [...Array(500)].map((_, i, all) => new WalkingAnt(context, ((360 / all.length) * i)));
      ants.forEach(ant => {
        ant.x = context.canvas.width/2;
        ant.y = context.canvas.height/2;
      });

      let animationFrameId: number;
      const render = () => {
        clearReact();
        ants.forEach(ant => {
          ant.walk();
        });
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
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
      <canvas 
        ref={canvasRef}
        width={1000}
        height={600}
      />
    </div>
  )
}

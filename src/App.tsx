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
      const ant = new WalkingAnt(context, 45);
      ant.x = context.canvas.width/2;
      ant.y = context.canvas.height/2;
      setInterval(() => {
        clearReact();
        ant.walk();
      }, 50);
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
        width={800}
        height={600}
      />
    </div>
  )
}

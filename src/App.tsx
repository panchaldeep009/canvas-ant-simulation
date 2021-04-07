import { useEffect, useRef } from "react"

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.fillStyle = '#444'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
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
      <canvas ref={canvasRef} />
    </div>
  )
}

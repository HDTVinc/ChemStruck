import React, { useEffect, useRef } from 'react';
import { CanvasRenderer } from '@chem/render';

export const EditorHost: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const renderer = new CanvasRenderer();
      renderer.drawTestGrid(ctx);
    }
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};

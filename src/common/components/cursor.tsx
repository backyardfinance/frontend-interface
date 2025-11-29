import type React from "react";
import { useEffect, useRef } from "react";

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      pointerEvents: "none",
      zIndex: "9999",
    });

    let fadeTimeout: ReturnType<typeof setTimeout>;
    const maxLineLength = 10;
    const linePoints: { x: number; y: number }[] = [];

    function drawLine(x: number, y: number) {
      if (!ctx) return;
      linePoints.push({ x, y });
      if (linePoints.length > maxLineLength) {
        linePoints.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#C4A8EE";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();

      for (let i = 0; i < linePoints.length - 1; i++) {
        ctx.moveTo(linePoints[i].x, linePoints[i].y);
        ctx.lineTo(linePoints[i + 1].x, linePoints[i + 1].y);
      }
      ctx.stroke();

      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        if (linePoints.length > 0) {
          linePoints.shift();
          drawLine(x, y);
        }
      }, 20);
    }

    const handleMouseMove = (e: MouseEvent) => {
      drawLine(e.clientX, e.clientY);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(fadeTimeout);
      canvas.remove();
    };
  }, []);

  return null;
};

export default CursorTrail;

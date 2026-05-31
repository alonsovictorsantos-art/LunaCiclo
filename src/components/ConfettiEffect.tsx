import React, { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

export default function ConfettiEffect({ onComplete }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high pixel density support
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const colors = [
      '#FF6B8B', // Pink Primary
      '#FF8E53', // Orange Active
      '#34D399', // Mint Green
      '#60A5FA', // Sky Blue
      '#FBBF24', // Amber Gold
    ];

    const particles: Particle[] = [];
    const maxParticles = 120;

    // Generate natural bursts of confetti
    for (let i = 0; i < maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      
      // Some come from left, some from right, some from bottom corners to cross
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? width * 0.1 : width * 0.9;
      const startY = height * 0.7; // low burst
      
      const velocityX = Math.cos(angle) * speed + (fromLeft ? 3 : -3);
      const velocityY = -Math.abs(Math.sin(angle) * speed * 1.5) - 2;

      particles.push({
        x: startX,
        y: startY,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: velocityX,
        speedY: velocityY,
        rotation: Math.random() * 360,
        rotationSpeed: -10 + Math.random() * 20,
        opacity: 1,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.1,
      });
    }

    // Add extra center-drop particles as gentle rain
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: width * 0.2 + Math.random() * width * 0.6,
        y: -20 - Math.random() * 50,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: -1 + Math.random() * 2,
        speedY: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: -5 + Math.random() * 10,
        opacity: 1,
        wobble: Math.random() * 5,
        wobbleSpeed: 0.02 + Math.random() * 0.05,
      });
    }

    let animationId: number;
    let framesActive = 0;
    const totalDuration = 180; // ~3 seconds at 60fps

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      framesActive++;

      let aliveParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.opacity <= 0) continue;
        aliveParticles++;

        // Physics updates
        p.speedY += 0.24; // Gravity
        p.speedX *= 0.96; // Air drag
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Fade out particles near the bottom or after a while
        if (p.y > height - 20 || framesActive > 100) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          // Varied shapes: elegant rectangles & circles
          if (i % 2 === 0) {
            ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.5);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (aliveParticles > 0 && framesActive < totalDuration) {
        animationId = requestAnimationFrame(animate);
      } else {
        if (onComplete) {
          onComplete();
        }
      }
    }

    animate();

    const handleResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      canvas.width = nextWidth * dpr;
      canvas.height = nextHeight * dpr;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <canvas
      id="confetti-canvas"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] w-full h-full"
    />
  );
}

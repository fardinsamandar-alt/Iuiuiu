import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Maximize2, MonitorPlay, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Viewport = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, setIsPlaying, currentTime, fps, tracks } = useEditorStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Render Loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw active clips
      const activeClips = tracks
        .flatMap(t => t.clips)
        .filter(c => currentTime >= c.start && currentTime <= c.start + c.duration)
        .sort((a, b) => a.zIndex - b.zIndex);

      activeClips.forEach(clip => {
        const adj = clip.adjustments;
        const frames = adj.motionBlur > 0 ? 3 : 1;
        const blurStep = adj.motionBlur / 30;

        for (let i = 0; i < frames; i++) {
          ctx.save();
          
          // Motion Blur Simulation: Stagger frames if playing
          let xOffset = 0;
          if (isPlaying && adj.motionBlur > 0) {
            xOffset = (i - (frames - 1) / 2) * blurStep;
          }

          // Transform
          ctx.translate(canvas.width / 2 + clip.position.x + xOffset, canvas.height / 2 + clip.position.y);
          ctx.rotate((clip.rotation * Math.PI) / 180);
          ctx.scale(clip.scale, clip.scale);
          
          // Optical Flow / Smooth Slomo Simulation: Frame Blending
          ctx.globalAlpha = (clip.opacity / 100) / frames;
          if (adj.slowMoSmooth && isPlaying) {
             // Darken slightly to simulate high shutter speed feel
             ctx.globalAlpha *= 0.9;
          }

          // Draw Placeholder
          ctx.fillStyle = clip.type === 'video' ? '#1a1a1a' : '#2a2a2a';
          ctx.fillRect(-160, -90, 320, 180);
          
          ctx.filter = `brightness(${100 + adj.exposure}%) contrast(${100 + adj.contrast}%) saturate(${100 + adj.saturation}%) grayscale(${adj.temperature < -50 ? 50 : 0}%) ${adj.slowMoSmooth ? 'blur(0.5px)' : ''}`;
          
          ctx.strokeStyle = adj.slowMoSmooth ? 'rgba(0, 255, 0, 0.4)' : 'rgba(242, 125, 38, 0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(-160, -90, 320, 180);
          
          if (i === 0) {
            ctx.font = 'bold 12px "JetBrains Mono"';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(`${clip.name.toUpperCase()}`, -150, -100);
          }

          ctx.restore();
        }
      });

      // Frame Rate Info
      if (isPlaying) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '10px monospace';
        ctx.fillText(`${fps} FPS MASTER ENGINE`, 10, 20);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [tracks, currentTime, isPlaying, fps]);

  return (
    <div className="flex-1 bg-[#101010] flex flex-col items-center justify-center relative group">
      <div className="absolute top-4 left-4 p-2 bg-background/50 border border-white/5 rounded backdrop-blur z-10 flex items-center gap-2">
         <Zap size={14} className="text-primary animate-pulse" />
         <span className="text-[10px] font-bold tracking-widest uppercase text-muted">120 FPS Output Active</span>
      </div>

      <div className="w-full max-w-[80%] aspect-video relative shadow-2xl rounded-sm overflow-hidden border border-border">
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080}
          className="w-full h-full cursor-crosshair"
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
           <div 
             className="h-full bg-primary" 
             style={{ width: '25%' }} // Simulated progress
           />
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-card/80 backdrop-blur px-8 py-3 rounded-full border border-white/5 shadow-2xl transition-all opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100">
        <button className="text-muted hover:text-foreground transition-colors"><SkipBack size={20} /></button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
        </button>
        <button className="text-muted hover:text-foreground transition-colors"><SkipForward size={20} /></button>
        
        <div className="w-[1px] h-6 bg-border mx-2" />
        
        <button className="text-muted hover:text-foreground transition-colors"><Maximize2 size={18} /></button>
      </div>
    </div>
  );
};

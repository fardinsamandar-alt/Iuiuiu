import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { 
  Scissors, Trash2, Copy, 
  ChevronRight, Lock, Eye, 
  Plus, Search, Filter 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const TRACK_HEIGHT = 44;
const PIXELS_PER_SECOND = 40;

export const TimelineEditor = () => {
  const { 
    tracks, currentTime, setCurrentTime, zoom, 
    duration, selectedClipId, setSelectedClipId, updateClip
  } = useEditorStore();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    setCurrentTime(x / (PIXELS_PER_SECOND * zoom));
  };

  const handleClipClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedClipId(id === selectedClipId ? null : id);
  };

  return (
    <div className="h-80 border-t border-border flex flex-col bg-background/80 relative">
      {/* Toolbar */}
      <div className="h-10 border-b border-border flex items-center px-4 justify-between bg-card/50">
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-muted hover:text-primary transition-colors bg-secondary/50 rounded"><Scissors size={14} /></button>
          <button className="p-1.5 text-muted hover:text-primary transition-colors bg-secondary/50 rounded"><Copy size={14} /></button>
          <button className="p-1.5 text-muted hover:text-red-500 transition-colors bg-secondary/50 rounded"><Trash2 size={14} /></button>
          <div className="w-[1px] h-4 bg-border mx-2" />
          <div className="flex items-center gap-2 px-2 py-1 bg-secondary/30 rounded text-[10px] font-mono text-primary">
             <span>Snap</span>
             <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <input 
             type="range" 
             value={zoom} 
             min={0.1} 
             max={5} 
             step={0.1}
             onChange={(e) => useEditorStore.getState().setZoom(parseFloat(e.target.value))}
             className="w-24 h-1 accent-primary"
           />
           <span className="text-[10px] font-mono text-muted uppercase">Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers */}
        <aside className="w-48 border-r border-border bg-card/30 flex flex-col pt-8">
          {tracks.map(track => (
            <div key={track.id} className="h-11 border-b border-white/5 flex items-center px-3 justify-between group">
              <div className="flex items-center gap-2 overflow-hidden">
                 {track.type === 'video' ? <MonitorPlay size={12} className="text-muted" /> : <Music size={12} className="text-muted" />}
                 <span className="text-[10px] font-bold tracking-tight truncate uppercase text-muted group-hover:text-foreground">{track.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-muted hover:text-primary"><Eye size={12} /></button>
                <button className="p-1 text-muted hover:text-primary"><Lock size={12} /></button>
              </div>
            </div>
          ))}
        </aside>

        {/* Timeline Tracks */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
          onClick={handleTimelineClick}
          onMouseMove={(e) => isDraggingPlayhead && handleTimelineClick(e as any)}
          onMouseUp={() => setIsDraggingPlayhead(false)}
        >
          {/* Rulers */}
          <div className="h-8 border-b border-border bg-background/50 flex items-end sticky top-0 z-20">
             {Array.from({ length: duration }).map((_, i) => (
               <div key={i} className="flex-shrink-0 border-l border-muted/30 h-2" style={{ width: PIXELS_PER_SECOND * zoom }}>
                 <span className="text-[8px] font-mono text-muted/50 ml-1 mb-1 block">{i % 5 === 0 ? `${i}s` : ''}</span>
               </div>
             ))}
          </div>

          <div className="relative pt-0 min-h-full">
            {tracks.map(track => (
              <div key={track.id} className="h-11 border-b border-white/5 relative group">
                {track.clips.map(clip => (
                  <motion.div
                    key={clip.id}
                    layoutId={clip.id}
                    className={cn(
                      "absolute top-1 h-[34px] rounded-md border text-[9px] px-2 flex items-center overflow-hidden cursor-pointer backdrop-blur-sm",
                      selectedClipId === clip.id 
                        ? "bg-primary/20 border-primary text-primary z-10 shadow-[0_0_15px_rgba(242,125,38,0.2)]" 
                        : "bg-secondary/60 border-white/10 text-muted hover:border-white/20"
                    )}
                    style={{
                      left: clip.start * PIXELS_PER_SECOND * zoom,
                      width: clip.duration * PIXELS_PER_SECOND * zoom,
                    }}
                    onClick={(e) => handleClipClick(e, clip.id)}
                  >
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                       <span className="font-bold tracking-widest uppercase truncate">{clip.name}</span>
                    </div>
                    {/* Handles */}
                    {selectedClipId === clip.id && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary cursor-ew-resize" />
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary cursor-ew-resize" />
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-accent z-30 pointer-events-none"
              style={{ left: currentTime * PIXELS_PER_SECOND * zoom }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-5 bg-accent rounded-b-sm cursor-grab active:cursor-grabbing pointer-events-auto"
                onMouseDown={() => setIsDraggingPlayhead(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { Music, MonitorPlay } from 'lucide-react';

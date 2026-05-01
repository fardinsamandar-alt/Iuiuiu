import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { 
  Sun, Contrast, Droplets, Thermometer, 
  Wind, CircleDot, ChevronDown, RotateCcw,
  Sliders, Zap, MonitorPlay
} from 'lucide-react';
import { cn } from '../../lib/utils';

const AdjustmentSlider = ({ label, icon: Icon, value, min = -100, max = 100, onChange }: any) => (
  <div className="space-y-2 py-3 border-b border-white/5 last:border-0 group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted group-hover:text-foreground transition-colors">
        <Icon size={14} />
        <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
      </div>
      <div className="flex items-center gap-2">
         <span className="text-[10px] font-mono text-primary">{value >= 0 ? `+${value}` : value}</span>
         <button className="text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
           <RotateCcw size={10} />
         </button>
      </div>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary hover:accent-accent transition-all"
    />
  </div>
);

export const PropertyInspector = () => {
  const { selectedClipId, tracks, updateClip } = useEditorStore();
  
  const selectedClip = tracks
    .flatMap(t => t.clips)
    .find(c => c.id === selectedClipId);

  if (!selectedClip) {
    return (
      <div className="w-80 border-l border-border bg-background/50 flex flex-col items-center justify-center p-8 text-center">
        <Sliders className="text-muted mb-3 opacity-20" size={40} />
        <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase">No Clip Selected</p>
      </div>
    );
  }

  const handleAdjust = (key: string, val: number) => {
    if (!selectedClipId) return;
    updateClip(selectedClipId, {
      adjustments: {
        ...selectedClip.adjustments,
        [key]: val
      }
    });
  };

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
      <div className="h-10 border-b border-border flex items-center px-4 justify-between bg-background/80">
        <span className="text-[10px] font-bold tracking-widest uppercase">Clip Inspector</span>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
           <span className="text-[10px] font-mono text-muted">ID: {selectedClip.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">Koloro Lab</h3>
            <button className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-secondary text-muted rounded hover:text-foreground">Preserve</button>
          </div>
          
          <AdjustmentSlider icon={Sun} label="Exposure" value={selectedClip.adjustments.exposure} onChange={(v: number) => handleAdjust('exposure', v)} />
          <AdjustmentSlider icon={Contrast} label="Contrast" value={selectedClip.adjustments.contrast} onChange={(v: number) => handleAdjust('contrast', v)} />
          <AdjustmentSlider icon={Droplets} label="Saturation" value={selectedClip.adjustments.saturation} onChange={(v: number) => handleAdjust('saturation', v)} />
          <AdjustmentSlider icon={Thermometer} label="Temperature" value={selectedClip.adjustments.temperature} onChange={(v: number) => handleAdjust('temperature', v)} />
          <AdjustmentSlider icon={Wind} label="Tint" value={selectedClip.adjustments.tint} onChange={(v: number) => handleAdjust('tint', v)} />
          <AdjustmentSlider icon={CircleDot} label="Vignette" value={selectedClip.adjustments.vignette} onChange={(v: number) => handleAdjust('vignette', v)} />
        </section>

        <section className="bg-primary/5 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary flex items-center gap-2">
              <Zap size={14} /> Professional Motion
            </h3>
          </div>
          
          <AdjustmentSlider 
            icon={Wind} 
            label="Motion Blur" 
            value={selectedClip.adjustments.motionBlur} 
            onChange={(v: number) => handleAdjust('motionBlur', v)} 
          />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted">
              <MonitorPlay size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Smooth Slow-Mo</span>
            </div>
            <button 
              onClick={() => handleAdjust('slowMoSmooth', !selectedClip.adjustments.slowMoSmooth ? (true as any) : (false as any))}
              className={cn(
                "px-3 py-1 rounded text-[9px] font-bold uppercase transition-all border",
                selectedClip.adjustments.slowMoSmooth 
                  ? "bg-accent border-accent text-background" 
                  : "bg-secondary border-white/5 text-muted hover:text-foreground"
              )}
            >
              {selectedClip.adjustments.slowMoSmooth ? 'Optical Flow' : 'Standard'}
            </button>
          </div>
          <p className="text-[8px] text-muted italic mt-1 font-mono uppercase tracking-tighter opacity-50">
            * Smooth Mode uses frame blending for high-fidelity 120fps feel.
          </p>
        </section>

        <section className="bg-secondary/30 rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between mb-3">
             <span className="text-[10px] font-bold tracking-widest uppercase">HSL Channels</span>
             <ChevronDown size={14} className="text-muted" />
          </div>
          <div className="grid grid-cols-4 gap-2">
             {['R', 'O', 'Y', 'G', 'C', 'B', 'P', 'M'].map((c, i) => (
               <div key={c} className="aspect-square bg-secondary rounded flex items-center justify-center border border-white/5 hover:border-primary cursor-pointer transition-all">
                 <span className="text-[9px] font-bold">{c}</span>
               </div>
             ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-primary">Transform</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[9px] uppercase tracking-wider text-muted font-bold">Scale</label>
               <input type="number" value={selectedClip.scale} className="w-full bg-secondary border border-white/5 rounded px-2 py-1 text-xs font-mono" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] uppercase tracking-wider text-muted font-bold">Rotation</label>
               <input type="number" value={selectedClip.rotation} className="w-full bg-secondary border border-white/5 rounded px-2 py-1 text-xs font-mono" />
             </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

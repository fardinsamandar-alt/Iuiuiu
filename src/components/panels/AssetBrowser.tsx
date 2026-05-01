import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { 
  Plus, Search, Grid, List, 
  Film, Music, Image as ImageIcon,
  FolderOpen, Cloud
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AssetBrowser = () => {
  const [search, setSearch] = useState('');
  const addClip = useEditorStore(state => state.addClip);

  const MOCK_ASSETS = [
    { id: 'a1', name: 'Cinematic Sunset', type: 'video', duration: 15, thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=120&fit=crop' },
    { id: 'a2', name: 'Urban Night', type: 'video', duration: 12, thumbnail: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=200&h=120&fit=crop' },
    { id: 'a3', name: 'Lo-fi Beats', type: 'audio', duration: 60, thumbnail: null },
    { id: 'a4', name: 'Texture Overlay', type: 'image', duration: 10, thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=120&fit=crop' },
  ];

  const handleAdd = (asset: any) => {
    addClip({
      id: Math.random().toString(36).substr(2, 9),
      name: asset.name,
      type: asset.type,
      start: useEditorStore.getState().currentTime,
      duration: asset.duration,
      offset: 0,
      trackId: asset.type === 'audio' ? 'track-audio-1' : 'track-1',
      sourceUrl: '',
      adjustments: {
        brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, tint: 0, vignette: 0, sharpen: 0,
        hsl: { hue: Array(8).fill(0), sat: Array(8).fill(0), lum: Array(8).fill(0) }
      },
      opacity: 100,
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
      zIndex: 1,
    });
  };

  return (
    <aside className="w-80 bg-background/50 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase">Project Assets</h2>
           <div className="flex items-center gap-2">
             <button className="text-muted hover:text-primary"><Grid size={14} /></button>
             <button className="text-muted hover:text-primary"><List size={14} /></button>
           </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={12} />
          <input 
            type="text"
            placeholder="SEARCH CLIPS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded px-8 py-2 text-[10px] font-mono focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 grid grid-cols-2 gap-3 content-start">
        <button className="col-span-2 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-muted hover:border-primary hover:text-primary transition-all group">
           <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
             <Plus size={20} />
           </div>
           <span className="text-[9px] font-bold tracking-widest uppercase">Import Media</span>
        </button>

        {MOCK_ASSETS.map(asset => (
          <div 
            key={asset.id} 
            className="group relative aspect-video bg-secondary rounded-md overflow-hidden border border-border hover:border-primary transition-all cursor-pointer"
            onClick={() => handleAdd(asset)}
          >
            {asset.thumbnail ? (
              <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center grayscale">
                <Music size={24} className="text-muted" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
               <span className="text-[8px] font-bold text-white truncate uppercase">{asset.name}</span>
               <span className="text-[7px] text-primary font-mono">{asset.duration}s</span>
            </div>
            
            <div className="absolute top-2 right-2 p-1 bg-primary text-background rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
              <Plus size={12} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto border-t border-border p-4 flex items-center gap-4 text-muted overflow-hidden whitespace-nowrap">
        <Cloud size={14} className="flex-shrink-0" />
        <span className="text-[8px] font-mono">VISION_CLOUD_SYNC: READY (1.2GB USED)</span>
      </div>
    </aside>
  );
};

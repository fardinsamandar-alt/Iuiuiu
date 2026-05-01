import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Play, Pause, SkipBack, SkipForward, 
  Layers, Scissors, Type, Music, Image as ImageIcon, 
  Settings, Download, Search, Maximize2, 
  History, Sliders, MonitorPlay, Palette
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../store/useEditorStore';

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-20 h-20 gap-1 transition-colors hover:text-primary",
      active ? "text-primary bg-secondary/50" : "text-muted"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-medium tracking-wider uppercase">{label}</span>
  </button>
);

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('assets');
  const { isPlaying, setIsPlaying, currentTime, duration, exporting } = useEditorStore();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground select-none overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-background z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-background">V</div>
          <span className="text-sm font-semibold tracking-tight uppercase">Vision Editor <span className="text-primary italic">Pro</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-mono text-muted">
            <span className="text-foreground">00:00:15:04</span>
            <span>/</span>
            <span>00:01:00:00</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-background rounded-full text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-widest">
            <Download size={14} />
            Export 120 FPS
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Nav */}
        <aside className="w-20 border-r border-border flex flex-col bg-background/50">
          <NavItem icon={Layers} label="Assets" active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
          <NavItem icon={Palette} label="Koloro" active={activeTab === 'koloro'} onClick={() => setActiveTab('koloro')} />
          <NavItem icon={Type} label="Text" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
          <NavItem icon={Music} label="Audio" active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} />
          <NavItem icon={Scissors} label="Edit" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
          <div className="mt-auto">
            <NavItem icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* Dynamic Panels */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex overflow-hidden">
             {/* Component Injection Point */}
             {children}
          </div>
        </div>
      </main>
      
      {exporting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-center items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase">Rendering 120 FPS Master...</p>
          </div>
        </div>
      )}
    </div>
  );
};

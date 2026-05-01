import { create } from 'zustand';
import { EditorState, Track, Clip, Adjustments } from '../types/editor';

interface EditorStore extends EditorState {
  setTracks: (tracks: Track[]) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setSelectedClipId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addClip: (clip: Clip) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
}

const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  tint: 0,
  vignette: 0,
  sharpen: 0,
  motionBlur: 0,
  slowMoSmooth: false,
  hsl: {
    hue: [0, 0, 0, 0, 0, 0, 0, 0],
    sat: [0, 0, 0, 0, 0, 0, 0, 0],
    lum: [0, 0, 0, 0, 0, 0, 0, 0],
  }
};

export const useEditorStore = create<EditorStore>((set) => ({
  tracks: [
    { id: 'track-1', name: 'Main Track', type: 'video', isLocked: false, isVisible: true, clips: [] },
    { id: 'track-2', name: 'Overlay', type: 'video', isLocked: false, isVisible: true, clips: [] },
    { id: 'track-audio-1', name: 'Audio 1', type: 'audio', isLocked: false, isVisible: true, clips: [] },
  ],
  currentTime: 0,
  duration: 60, // Default 60 seconds
  zoom: 1,
  selectedClipId: null,
  isPlaying: false,
  fps: 120, // Targeted FPS
  exporting: false,

  setTracks: (tracks) => set({ tracks }),
  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  addClip: (clip) => set((state) => ({
    tracks: state.tracks.map(t => 
      t.id === clip.trackId ? { ...t, clips: [...t.clips, clip] } : t
    )
  })),

  updateClip: (clipId, updates) => set((state) => ({
    tracks: state.tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => c.id === clipId ? { ...c, ...updates } : c)
    }))
  })),

  updateTrack: (trackId, updates) => set((state) => ({
    tracks: state.tracks.map(t => t.id === trackId ? { ...t, ...updates } : t)
  })),
}));

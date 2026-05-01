export type MediaType = 'video' | 'image' | 'audio' | 'text';

export interface Keyframe {
  time: number;
  value: number;
}

export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  temperature: number;
  tint: number;
  vignette: number;
  sharpen: number;
  motionBlur: number; // 0-100
  slowMoSmooth: boolean;
  // HSL
  hsl: {
    hue: number[];
    sat: number[];
    lum: number[];
  };
}

export interface Clip {
  id: string;
  name: string;
  type: MediaType;
  start: number; // in seconds
  duration: number;
  offset: number; // offset within the media source
  trackId: string;
  sourceUrl: string;
  adjustments: Adjustments;
  opacity: number;
  scale: number;
  position: { x: number; y: number };
  rotation: number;
  zIndex: number;
}

export interface Track {
  id: string;
  name: string;
  type: MediaType;
  isLocked: boolean;
  isVisible: boolean;
  clips: Clip[];
}

export interface EditorState {
  tracks: Track[];
  currentTime: number;
  duration: number;
  zoom: number;
  selectedClipId: string | null;
  isPlaying: boolean;
  fps: number;
  exporting: boolean;
}

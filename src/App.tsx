/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Shell } from './components/layout/Shell';
import { AssetBrowser } from './components/panels/AssetBrowser';
import { PropertyInspector } from './components/panels/PropertyInspector';
import { Viewport } from './components/preview/Viewport';
import { TimelineEditor } from './components/timeline/TimelineEditor';
import { useEditorStore } from './store/useEditorStore';

export default function App() {
  const { addClip, tracks } = useEditorStore();

  useEffect(() => {
    if (tracks[0].clips.length === 0) {
      // Add a couple of initial clips
      addClip({
        id: 'init-1',
        name: 'STREET_GLOW.MP4',
        type: 'video',
        start: 0,
        duration: 8,
        offset: 0,
        trackId: 'track-1',
        sourceUrl: '',
        adjustments: {
          brightness: 10, contrast: 20, saturation: 15, exposure: 5, temperature: -20, tint: 0, vignette: 10, sharpen: 50,
          hsl: { hue: Array(8).fill(0), sat: Array(8).fill(0), lum: Array(8).fill(0) }
        },
        opacity: 100,
        scale: 1,
        position: { x: 0, y: 0 },
        rotation: 0,
        zIndex: 1,
      });

      addClip({
        id: 'init-2',
        name: 'BASS_DROP.WAV',
        type: 'audio',
        start: 4,
        duration: 12,
        offset: 0,
        trackId: 'track-audio-1',
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
    }
  }, []);

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <AssetBrowser />
          <Viewport />
          <PropertyInspector />
        </div>
        <TimelineEditor />
      </div>
    </Shell>
  );
}

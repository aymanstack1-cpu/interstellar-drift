import { useEffect, useRef } from 'react';
import { useWorldStore } from '../store/worldStore';
import { useSettingsStore } from '../store/settingsStore';
import audioEngine from '../audio/AudioEngine';

/** Listens for world changes and triggers audio crossfade */
export default function AudioController() {
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const volume = useSettingsStore((s) => s.volume);
  const isMuted = useSettingsStore((s) => s.isMuted);
  const lastWorld = useRef<string | null>(null);

  useEffect(() => {
    if (lastWorld.current === currentWorld) return;
    lastWorld.current = currentWorld;

    audioEngine.playWorld(currentWorld);
  }, [currentWorld]);

  useEffect(() => {
    audioEngine.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  return null;
}

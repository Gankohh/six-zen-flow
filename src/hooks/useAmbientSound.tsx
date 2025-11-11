import { useEffect, useRef, useState } from "react";

export const useAmbientSound = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    audioContextRef.current = new AudioContextClass();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.03;

    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const start = () => {
    if (!audioContextRef.current || !gainNodeRef.current || !isEnabled) return;

    stop();

    // Create multiple oscillators for ambient sound
    const frequencies = [110, 165, 220, 275];
    
    frequencies.forEach((freq) => {
      const oscillator = audioContextRef.current!.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;
      
      const oscillatorGain = audioContextRef.current!.createGain();
      oscillatorGain.gain.value = 0.2;
      
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(gainNodeRef.current!);
      
      oscillator.start();
      oscillatorsRef.current.push(oscillator);
    });
  };

  const stop = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator may already be stopped
      }
    });
    oscillatorsRef.current = [];
  };

  const toggle = () => {
    setIsEnabled((prev) => !prev);
    if (isEnabled) {
      stop();
    } else {
      start();
    }
  };

  useEffect(() => {
    if (isEnabled) {
      start();
    } else {
      stop();
    }
  }, [isEnabled]);

  return { toggle, isEnabled };
};

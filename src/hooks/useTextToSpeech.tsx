import { useEffect, useRef, useState } from "react";

export const useTextToSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || !isEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const cancel = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggle = () => {
    setIsEnabled((prev) => !prev);
    if (isEnabled) {
      cancel();
    }
  };

  return { speak, cancel, toggle, isEnabled, isSpeaking };
};

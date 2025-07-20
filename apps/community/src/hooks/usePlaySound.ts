import { Audio, type AVPlaybackSource } from 'expo-av';
import { useEffect, useRef } from 'react';
// @ts-expect-error -- sound is not typed
import cashRegisterOpenSound from '@assets/sounds/cash-register-open.wav';

export const Sounds = {
  cashRegisterOpen: cashRegisterOpenSound as AVPlaybackSource,
} as const;

export default function usePlaySound(soundSource: AVPlaybackSource) {
  const soundRef = useRef<Audio.Sound | undefined>(undefined);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(soundSource);
      soundRef.current = sound;
      await soundRef.current.setIsMutedAsync(false);
    };

    void loadSound();

    return () => {
      if (soundRef.current) {
        void soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    await soundRef.current?.replayAsync();
  };

  return { playSound };
}

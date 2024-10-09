"use client"

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function MeditationSession() {
  const { speaker, music, duration, endSession } = useStore();
  const [timeLeft, setTimeLeft] = useState(Math.round(duration * 60));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((Math.round(duration * 60) - timeLeft) / (Math.round(duration * 60))) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 bg-card rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold">Meditation in Progress</h2>
      <div className="text-xl">
        <p>Speaker: {speaker}</p>
        <p>Background Music: {music}</p>
      </div>
      <div className="w-full max-w-md">
        <Progress value={progress} className="w-full h-4" />
      </div>
      <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      <Button onClick={endSession} variant="destructive">
        End Session
      </Button>
    </div>
  );
}
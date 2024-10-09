"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SessionSetupModal } from '@/components/SessionSetupModal';
import { MeditationSession } from '@/components/MeditationSession';
import { useStore } from '@/lib/store';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sessionStarted } = useStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
      {!sessionStarted ? (
        <>
          <h1 className="text-4xl font-bold mb-8">Welcome to Peaceful Meditation</h1>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            Start Meditation
          </Button>
          <SessionSetupModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
      ) : (
        <MeditationSession />
      )}
    </div>
  );
}
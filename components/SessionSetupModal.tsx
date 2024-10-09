"use client"

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';

const speakers = ['Calm Voice', 'Soothing Whisper', 'Gentle Guide'];
const musicTracks = ['Ocean Waves', 'Forest Sounds', 'Soft Piano'];
const fixedDurations = [5, 10, 15]; // in minutes

export function SessionSetupModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');
  const [duration, setDuration] = useState(5);
  const [rememberSpeaker, setRememberSpeaker] = useState(false);
  const [rememberMusic, setRememberMusic] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('5');
  const [customDurationUnit, setCustomDurationUnit] = useState('minutes');
  const { setSessionOptions, startSession } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedSpeaker = localStorage.getItem('preferredSpeaker');
    const savedMusic = localStorage.getItem('preferredMusic');
    if (savedSpeaker) {
      setSelectedSpeaker(savedSpeaker);
      setRememberSpeaker(true);
    }
    if (savedMusic) {
      setSelectedMusic(savedMusic);
      setRememberMusic(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (rememberSpeaker) {
        localStorage.setItem('preferredSpeaker', selectedSpeaker);
      } else {
        localStorage.removeItem('preferredSpeaker');
      }
      if (rememberMusic) {
        localStorage.setItem('preferredMusic', selectedMusic);
      } else {
        localStorage.removeItem('preferredMusic');
      }
      const finalDuration = showCustomDuration
        ? customDurationUnit === 'minutes'
          ? parseInt(customDuration)
          : parseInt(customDuration) / 60
        : duration;
      setSessionOptions(selectedSpeaker, selectedMusic, finalDuration);
      startSession();
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !selectedSpeaker) return true;
    if (step === 2 && !selectedMusic) return true;
    if (step === 3 && showCustomDuration && (!customDuration || isNaN(parseInt(customDuration)))) return true;
    return false;
  };

  const playPreview = (type: 'speaker' | 'music') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const selection = type === 'speaker' ? selectedSpeaker : selectedMusic;
    const fileName = selection.toLowerCase().replace(' ', '-');
    audioRef.current = new Audio(`/previews/${fileName}.mp3`);
    audioRef.current.play();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Up Your Meditation Session</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <Label htmlFor="speaker">Choose a Speaker</Label>
            <Select onValueChange={setSelectedSpeaker} value={selectedSpeaker}>
              <SelectTrigger id="speaker">
                <SelectValue placeholder="Select a speaker" />
              </SelectTrigger>
              <SelectContent>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker} value={speaker}>
                    {speaker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => playPreview('speaker')} disabled={!selectedSpeaker}>Play Preview</Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberSpeaker"
                checked={rememberSpeaker}
                onCheckedChange={(checked) => setRememberSpeaker(checked as boolean)}
              />
              <Label htmlFor="rememberSpeaker">Remember my choice</Label>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Label htmlFor="music">Choose Background Music</Label>
            <Select onValueChange={setSelectedMusic} value={selectedMusic}>
              <SelectTrigger id="music">
                <SelectValue placeholder="Select background music" />
              </SelectTrigger>
              <SelectContent>
                {musicTracks.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => playPreview('music')} disabled={!selectedMusic}>Play Preview</Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMusic"
                checked={rememberMusic}
                onCheckedChange={(checked) => setRememberMusic(checked as boolean)}
              />
              <Label htmlFor="rememberMusic">Remember my choice</Label>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Label>Select Duration</Label>
            <div className="grid grid-cols-3 gap-2">
              {fixedDurations.map((d) => (
                <Button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    setShowCustomDuration(false);
                  }}
                  variant={duration === d && !showCustomDuration ? "default" : "outline"}
                >
                  {d} minutes
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => setShowCustomDuration(true)}
              variant={showCustomDuration ? "default" : "outline"}
            >
              Custom
            </Button>
            {showCustomDuration && (
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="Enter duration"
                />
                <Select onValueChange={setCustomDurationUnit} value={customDurationUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            {step === 3 ? 'Start Session' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
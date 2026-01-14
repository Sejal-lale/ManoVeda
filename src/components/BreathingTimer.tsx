import { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";

interface BreathingTimerProps {
  duration: number; // in seconds
  actionText: string;
  onComplete: () => void;
  onClose: () => void;
}

export const BreathingTimer = ({ 
  duration, 
  actionText, 
  onComplete, 
  onClose 
}: BreathingTimerProps) => {
  const { addBreathingMinutes, settings } = useSettings();
  const startTimeRef = useRef<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showComplete, setShowComplete] = useState(false);
  
  // Calculate progress for animation (0 to 1)
  const progress = 1 - (timeLeft / duration);
  
  // Scale grows from 0.95 to 1.15 based on time elapsed
  const currentScale = 0.95 + (progress * 0.2);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = () => {
    // Calculate minutes spent breathing
    const elapsedMs = Date.now() - startTimeRef.current;
    const elapsedMinutes = Math.round(elapsedMs / 60000);
    if (elapsedMinutes > 0) {
      addBreathingMinutes(elapsedMinutes);
    }
    
    // Haptic feedback if enabled
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
    
    setShowComplete(true);
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  if (showComplete) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
        <div className="animate-fade-up flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <p className="mb-2 text-xl font-medium text-foreground">
            See? Starting was enough.
          </p>
          <p className="text-base text-muted-foreground">
            You studied in a way you didn't expect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Close button */}
      <div className="flex justify-end p-4 safe-area-inset-top">
        <button
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 transition-colors active:bg-muted"
          aria-label="Close timer"
        >
          <X className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>

      {/* Centered timer content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-safe">
        {/* Breathing timer circle */}
        <div 
          className={cn(
            "relative mb-8 flex flex-col items-center justify-center",
            "h-56 w-56 sm:h-64 sm:w-64",
            "rounded-full bg-primary/10",
            "transition-all ease-in-out"
          )}
          style={{
            transform: `scale(${currentScale})`,
            transitionDuration: '400ms',
          }}
        >
          {/* Soft glow ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 ${40 + progress * 30}px hsl(var(--primary) / ${0.2 + progress * 0.2})`,
            }}
          />
          
          {/* Timer display */}
          <span className="text-5xl font-light text-primary sm:text-6xl">
            {formatTime(timeLeft)}
          </span>
          
          {/* Subtle breathing indicator */}
          <span className="mt-2 text-sm text-muted-foreground">
            {timeLeft > 0 ? "breathe" : "done"}
          </span>
        </div>

        {/* Action text */}
        <p className="mb-8 max-w-xs text-center text-lg leading-relaxed text-foreground">
          {actionText}
        </p>

        {/* Done button */}
        <button
          onClick={handleComplete}
          className={cn(
            "flex h-14 w-full max-w-xs items-center justify-center gap-2",
            "rounded-2xl bg-secondary text-secondary-foreground",
            "border border-border",
            "text-lg font-medium",
            "transition-all duration-300",
            "active:scale-[0.98]"
          )}
        >
          <Check className="h-5 w-5" />
          I'm Done
        </button>

        {/* Reassuring message */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No pressure. Stop whenever you want.
        </p>
      </div>
    </div>
  );
};

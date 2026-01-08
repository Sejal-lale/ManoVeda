import { useState, useEffect } from "react";
import { X, Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyAction } from "./StuckButton";

interface ActionCardProps {
  action: StudyAction;
  onClose: () => void;
  onStart: () => void;
  onComplete: () => void;
}

export const ActionCard = ({ action, onClose, onStart, onComplete }: ActionCardProps) => {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [showReinforcement, setShowReinforcement] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !completed && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, completed, timeLeft]);

  const handleStart = () => {
    setStarted(true);
    onStart();
  };

  const handleComplete = () => {
    setCompleted(true);
    setShowReinforcement(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showReinforcement) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="absolute inset-0 bg-[hsl(var(--overlay))]/40 backdrop-blur-sm" />
        <div className={cn(
          "relative bg-card rounded-[1.25rem] p-8 max-w-sm w-full",
          "shadow-[var(--shadow-soft)]",
          "animate-fade-up text-center"
        )}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg text-foreground font-medium mb-2">
            See? Starting was enough.
          </p>
          <p className="text-sm text-muted-foreground">
            You studied in a way you didn't expect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[hsl(var(--overlay))]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Card */}
      <div className={cn(
        "relative bg-card rounded-[1.25rem] p-6 max-w-sm w-full",
        "shadow-[var(--shadow-soft)]",
        "animate-fade-up"
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Duration badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-sm text-muted-foreground mb-4">
          {started ? formatTime(timeLeft) : action.duration}
        </div>

        {/* Action text */}
        <p className="text-lg text-foreground leading-relaxed mb-6 pr-8">
          {action.text}
        </p>

        {/* Action button */}
        {!started ? (
          <button
            onClick={handleStart}
            className={cn(
              "w-full py-4 rounded-2xl",
              "bg-primary text-primary-foreground",
              "font-medium text-base",
              "transition-all duration-300",
              "hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-2"
            )}
          >
            <Play className="w-5 h-5" />
            Start
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className={cn(
              "w-full py-4 rounded-2xl",
              "bg-secondary text-secondary-foreground border border-border",
              "font-medium text-base",
              "transition-all duration-300",
              "hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-2"
            )}
          >
            <Check className="w-5 h-5" />
            Done
          </button>
        )}

        {started && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            No pressure. Stop whenever you want.
          </p>
        )}
      </div>
    </div>
  );
};

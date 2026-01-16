import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Flame, Zap, Trophy } from "lucide-react";

interface VictoryFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  leveledUp?: boolean;
  newLevel?: number;
  pressureCopy?: string;
}

const PRESSURE_COPY = [
  "You showed up.",
  "Streak protected.",
  "Momentum maintained.",
  "Task cleared.",
  "One step forward.",
];

export const VictoryFeedback = ({ 
  isOpen, 
  onClose, 
  streakCount, 
  leveledUp = false,
  newLevel,
  pressureCopy 
}: VictoryFeedbackProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayCopy, setDisplayCopy] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDisplayCopy(pressureCopy || PRESSURE_COPY[Math.floor(Math.random() * PRESSURE_COPY.length)]);
      
      // Auto close after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, pressureCopy]);
  
  if (!isOpen && !isVisible) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-background/80 backdrop-blur-sm",
      "transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
        "flex flex-col items-center gap-6 p-8",
        "animate-scale-in"
      )}>
        {/* Victory pulse circle */}
        <div className={cn(
          "relative w-24 h-24 rounded-full",
          "bg-primary/20 flex items-center justify-center",
          "animate-pulse"
        )}>
          {/* Expanding rings */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <div className="absolute inset-[-8px] rounded-full bg-primary/5 animate-ping animation-delay-150" />
          
          {leveledUp ? (
            <Trophy className="w-12 h-12 text-primary" />
          ) : (
            <Check className="w-12 h-12 text-primary" />
          )}
        </div>
        
        {/* Level up announcement */}
        {leveledUp && newLevel && (
          <div className="flex items-center gap-2 text-primary animate-fade-in">
            <Zap className="w-5 h-5" />
            <span className="text-lg font-semibold">Level {newLevel}!</span>
          </div>
        )}
        
        {/* Pressure copy */}
        <p className="text-xl font-medium text-foreground animate-fade-in">
          {displayCopy}
        </p>
        
        {/* Streak indicator */}
        {streakCount > 0 && (
          <div className="flex items-center gap-2 text-orange-500 animate-fade-in">
            <Flame className="w-5 h-5" />
            <span className="font-bold text-lg">{streakCount} day streak</span>
          </div>
        )}
      </div>
    </div>
  );
};

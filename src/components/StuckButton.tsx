import { useState } from "react";
import { cn } from "@/lib/utils";

interface StuckButtonProps {
  onActionRevealed: (action: StudyAction) => void;
  disabled?: boolean;
}

export interface StudyAction {
  id: string;
  text: string;
  duration: string;
  category: "low-energy" | "active" | "body-based" | "anti-perfection" | "chaos";
}

const studyActions: StudyAction[] = [
  { id: "1", text: "Open your notes and rewrite one line.", duration: "5 min", category: "low-energy" },
  { id: "2", text: "Read one paragraph while standing.", duration: "5 min", category: "low-energy" },
  { id: "3", text: "Highlight only the headings in your notes.", duration: "5 min", category: "low-energy" },
  { id: "4", text: "Explain one concept out loud to your phone.", duration: "5 min", category: "active" },
  { id: "5", text: "Teach your phone one thing you learned today.", duration: "7 min", category: "active" },
  { id: "6", text: "Walk around the room while recalling one topic.", duration: "5 min", category: "body-based" },
  { id: "7", text: "Do 3 stretches, then recall one fact.", duration: "5 min", category: "body-based" },
  { id: "8", text: "Write the worst possible answer to a question.", duration: "5 min", category: "anti-perfection" },
  { id: "9", text: "Make the messiest notes you can for 5 minutes.", duration: "5 min", category: "anti-perfection" },
  { id: "10", text: "Open a random page and read one sentence.", duration: "5 min", category: "chaos" },
  { id: "11", text: "Set a timer for 5 minutes. Stop when it rings.", duration: "5 min", category: "chaos" },
  { id: "12", text: "Write down 3 words about what you're studying.", duration: "5 min", category: "low-energy" },
];

export const StuckButton = ({ onActionRevealed, disabled }: StuckButtonProps) => {
  const [isShuffling, setIsShuffling] = useState(false);

  const handleClick = () => {
    if (isShuffling || disabled) return;
    
    setIsShuffling(true);
    
    // Shuffle animation duration
    setTimeout(() => {
      const randomAction = studyActions[Math.floor(Math.random() * studyActions.length)];
      setIsShuffling(false);
      onActionRevealed(randomAction);
    }, 1200);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isShuffling}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72",
        "rounded-[2rem] sm:rounded-[2.5rem]",
        "bg-primary text-primary-foreground",
        "shadow-[var(--shadow-soft)]",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-4 focus:ring-ring/30",
        !isShuffling && "animate-breathe",
        isShuffling && "animate-shuffle",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-primary/20 blur-xl -z-10" />
      
      <span className="text-xl sm:text-2xl md:text-3xl font-medium mb-2">
        {isShuffling ? "Finding..." : "I'm Stuck"}
      </span>
      <span className="text-sm sm:text-base opacity-80">
        {isShuffling ? "" : "Tap once. I'll decide."}
      </span>
    </button>
  );
};

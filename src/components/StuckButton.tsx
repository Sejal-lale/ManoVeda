import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { useAdmin, AdminTask } from "@/contexts/AdminContext";

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

// Map admin categories to study action categories
const categoryMap: Record<string, StudyAction['category']> = {
  breathing: 'low-energy',
  reading: 'low-energy',
  writing: 'active',
  movement: 'body-based',
};

// Convert AdminTask to StudyAction
const taskToAction = (task: AdminTask): StudyAction => ({
  id: task.id,
  text: task.text,
  duration: task.difficulty === 'very_easy' ? '3 min' : task.difficulty === 'easy' ? '5 min' : '7 min',
  category: categoryMap[task.category] || 'low-energy',
});

export const StuckButton = ({ onActionRevealed, disabled }: StuckButtonProps) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const { incrementStuckPresses, settings } = useSettings();
  const { content, getRandomTask, preview, getPreviewTask } = useAdmin();

  const handleClick = () => {
    if (isShuffling || disabled) return;
    
    setIsShuffling(true);
    incrementStuckPresses();
    
    // Haptic feedback if enabled
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Shuffle animation duration
    setTimeout(() => {
      // Use preview task if in preview mode with force enabled, otherwise random
      let selectedTask: AdminTask | null = null;
      
      if (preview.isActive && preview.forceTask) {
        selectedTask = getPreviewTask();
      }
      
      if (!selectedTask) {
        selectedTask = getRandomTask();
      }
      
      setIsShuffling(false);
      
      if (selectedTask) {
        onActionRevealed(taskToAction(selectedTask));
      }
    }, 1200);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isShuffling}
      className={cn(
        "relative flex flex-col items-center justify-center",
        // Mobile-first sizing with comfortable touch targets
        "w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72",
        "rounded-[2rem] sm:rounded-[2.5rem]",
        "bg-primary text-primary-foreground",
        "shadow-[var(--shadow-soft)]",
        "transition-all duration-300 ease-out",
        // Touch-friendly feedback
        "active:scale-[0.96]",
        "focus:outline-none focus:ring-4 focus:ring-ring/30",
        !isShuffling && "animate-breathe",
        isShuffling && "animate-shuffle",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-primary/20 blur-xl -z-10" />
      
      {/* Large, readable text - uses admin content */}
      <span className="text-2xl sm:text-2xl md:text-3xl font-medium mb-2">
        {isShuffling ? content.buttonText.shufflingText : content.buttonText.stuckButton}
      </span>
      <span className="text-base sm:text-base opacity-80">
        {isShuffling ? "" : content.buttonText.stuckSubtext}
      </span>
    </button>
  );
};

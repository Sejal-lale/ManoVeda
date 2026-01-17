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
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isShuffling}
      className={cn(
        "relative flex flex-col items-center justify-center",
        // Sizing - confident, not oversized
        "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64",
        // Reduced corner radius for professionalism
        "rounded-2xl sm:rounded-3xl",
        // Deep primary with subtle gradient
        "bg-gradient-to-b from-primary to-primary/90",
        "text-primary-foreground",
        // Sharp, professional shadow
        "shadow-lg",
        // Crisp transitions
        "transition-all duration-150 ease-out",
        // Confident press effect
        "hover:shadow-xl hover:-translate-y-0.5",
        "active:scale-[0.98] active:shadow-md active:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isShuffling && "animate-shuffle",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-lg hover:translate-y-0"
      )}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Main text - bold and authoritative */}
      <span className="text-2xl sm:text-3xl font-bold tracking-tight">
        {isShuffling ? content.buttonText.shufflingText : content.buttonText.stuckButton}
      </span>
      
      {/* Subtext - smaller, lighter, doesn't compete */}
      {!isShuffling && (
        <span className="text-sm sm:text-base font-medium opacity-70 mt-1">
          {content.buttonText.stuckSubtext}
        </span>
      )}
    </button>
  );
};

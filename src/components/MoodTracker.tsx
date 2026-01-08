import { useState } from "react";
import { cn } from "@/lib/utils";

export type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

interface MoodOption {
  id: Mood;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "okay", emoji: "🙂", label: "Okay" },
  { id: "stressed", emoji: "😓", label: "Stressed" },
  { id: "overwhelmed", emoji: "😵", label: "Overwhelmed" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "numb", emoji: "🫥", label: "Numb" },
];

interface MoodTrackerProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

export const MoodTracker = ({ selectedMood, onMoodSelect }: MoodTrackerProps) => {
  const [recentlySelected, setRecentlySelected] = useState<Mood | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setRecentlySelected(mood);
    onMoodSelect(mood);
    setShowThanks(true);
    
    setTimeout(() => {
      setRecentlySelected(null);
      setShowThanks(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col gap-2">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
              "flex items-center justify-center",
              "bg-[hsl(var(--mood-bg))] backdrop-blur-sm",
              "transition-all duration-300 ease-out",
              "hover:scale-110 hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-ring/30",
              selectedMood === mood.id && "ring-2 ring-primary bg-accent",
              recentlySelected === mood.id && "animate-ripple"
            )}
            title={mood.label}
          >
            <span className="text-xl sm:text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>
      
      {/* Thank you message */}
      <div 
        className={cn(
          "text-xs text-muted-foreground transition-opacity duration-500",
          showThanks ? "opacity-100" : "opacity-0"
        )}
      >
        Thanks for checking in.
      </div>
    </div>
  );
};

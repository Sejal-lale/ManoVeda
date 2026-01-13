import { cn } from "@/lib/utils";

export type Mood = "calm" | "happy" | "sad" | "anxious" | "tired";

interface MoodOption {
  id: Mood;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "happy", emoji: "🙂", label: "Happy" },
  { id: "sad", emoji: "😓", label: "Sad" },
  { id: "anxious", emoji: "😟", label: "Anxious" },
  { id: "tired", emoji: "😔", label: "Tired" },
];

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  disabled?: boolean;
}

export const MoodSelector = ({
  selectedMood,
  onMoodSelect,
  disabled,
}: MoodSelectorProps) => {
  return (
    <div className="flex justify-center gap-4 sm:gap-5">
      {moodOptions.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
          disabled={disabled}
          className={cn(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-full",
            "flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedMood === mood.id
              ? "scale-105 ring-[3px] ring-[#E3A6A6] bg-[#FBECEC]"
              : "bg-white/60 hover:bg-white/80 hover:scale-105"
          )}
          title={mood.label}
          aria-label={mood.label}
        >
          <span
            className={cn(
              "text-2xl sm:text-3xl transition-transform duration-300",
              selectedMood === mood.id && "animate-scale-in"
            )}
          >
            {mood.emoji}
          </span>
        </button>
      ))}
    </div>
  );
};

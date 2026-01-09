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
    <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
      {moodOptions.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
          disabled={disabled}
          className={cn(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-full",
            "flex items-center justify-center",
            "bg-card border-2 border-transparent",
            "transition-all duration-300 ease-out",
            "hover:scale-110 hover:border-primary/30",
            "focus:outline-none focus:ring-2 focus:ring-ring/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedMood === mood.id && [
              "border-primary bg-accent",
              "scale-110 shadow-md",
              "ring-2 ring-primary/20",
            ]
          )}
          title={mood.label}
          aria-label={mood.label}
        >
          <span
            className={cn(
              "text-2xl sm:text-3xl transition-transform duration-200",
              selectedMood === mood.id && "animate-soft-bounce"
            )}
          >
            {mood.emoji}
          </span>
        </button>
      ))}
    </div>
  );
};

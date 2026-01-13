import { format, parseISO, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

type Mood = "calm" | "happy" | "sad" | "anxious" | "tired";

interface MoodEntry {
  id: string;
  mood: Mood;
  date: string;
  created_at: string;
}

interface MoodTimelineProps {
  entries: MoodEntry[];
  isLoading: boolean;
}

const moodData: Record<Mood, { emoji: string; label: string }> = {
  calm: { emoji: "😌", label: "Calm" },
  happy: { emoji: "🙂", label: "Happy" },
  sad: { emoji: "😓", label: "Sad" },
  anxious: { emoji: "😟", label: "Anxious" },
  tired: { emoji: "😔", label: "Tired" },
};

const formatDateLabel = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
};

export const MoodTimeline = ({ entries, isLoading }: MoodTimelineProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div 
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" 
          style={{ borderColor: "#E3A6A6", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: "#A98C8C" }}>
          No mood entries yet.
        </p>
        <p className="text-xs mt-1" style={{ color: "#C7A9A9" }}>
          Start by selecting how you feel today.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl",
            "animate-fade-up"
          )}
          style={{ 
            backgroundColor: "#F9F1F1",
            boxShadow: "0 2px 8px rgba(139, 94, 94, 0.06)",
            animationDelay: `${index * 50}ms` 
          }}
        >
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FBECEC" }}
          >
            <span className="text-2xl">{moodData[entry.mood]?.emoji || "😌"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "#7A4A4A" }}>
              {moodData[entry.mood]?.label || "Calm"}
            </p>
            <p className="text-xs" style={{ color: "#A98C8C" }}>
              {formatDateLabel(entry.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

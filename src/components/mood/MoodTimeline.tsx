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
        <div className="w-8 h-8 rounded-full border-2 border-ring border-t-transparent animate-spin" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">
          No mood entries yet.
        </p>
        <p className="text-xs mt-1 text-muted-foreground">
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
            "bg-card shadow-soft",
            "animate-fade-up"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <span className="text-2xl">{moodData[entry.mood]?.emoji || "😌"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {moodData[entry.mood]?.label || "Calm"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateLabel(entry.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

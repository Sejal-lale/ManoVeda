import { format, parseISO, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

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
  okay: { emoji: "🙂", label: "Okay" },
  stressed: { emoji: "😓", label: "Stressed" },
  overwhelmed: { emoji: "😵", label: "Overwhelmed" },
  sad: { emoji: "😔", label: "Sad" },
  numb: { emoji: "🫥", label: "Numb" },
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
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">
          No mood entries yet.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
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
            "bg-card border border-border",
            "animate-fade-up"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <span className="text-2xl">{moodData[entry.mood].emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {moodData[entry.mood].label}
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

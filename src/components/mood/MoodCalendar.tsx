import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

interface MoodEntry {
  id: string;
  mood: Mood;
  date: string;
  created_at: string;
}

interface MoodCalendarProps {
  entries: MoodEntry[];
  isLoading: boolean;
}

const moodEmojis: Record<Mood, string> = {
  calm: "😌",
  okay: "🙂",
  stressed: "😓",
  overwhelmed: "😵",
  sad: "😔",
  numb: "🫥",
};

export const MoodCalendar = ({ entries, isLoading }: MoodCalendarProps) => {
  const getMoodForDate = (date: Date): Mood | null => {
    const entry = entries.find((e) =>
      isSameDay(parseISO(e.date), date)
    );
    return entry?.mood || null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        className="rounded-xl border border-border bg-card p-4"
        classNames={{
          day: cn(
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent rounded-full transition-colors"
          ),
          day_today: "bg-primary/10 text-primary font-semibold",
        }}
        components={{
          DayContent: ({ date }) => {
            const mood = getMoodForDate(date);
            return (
              <div className="relative flex items-center justify-center w-full h-full">
                {mood ? (
                  <span className="text-lg" title={mood}>
                    {moodEmojis[mood]}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {format(date, "d")}
                  </span>
                )}
              </div>
            );
          },
        }}
        disabled={{ after: new Date() }}
      />
    </div>
  );
};

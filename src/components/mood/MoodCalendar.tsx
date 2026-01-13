import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type Mood = "calm" | "happy" | "sad" | "anxious" | "tired";

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
  happy: "🙂",
  sad: "😓",
  anxious: "😟",
  tired: "😔",
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
        <div 
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" 
          style={{ borderColor: "#E3A6A6", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        className="rounded-[20px] p-4"
        style={{ 
          backgroundColor: "#F9F1F1",
          boxShadow: "0 2px 12px rgba(139, 94, 94, 0.08)"
        }}
        classNames={{
          day: cn(
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
            "hover:bg-[#F2DADA] rounded-full transition-colors"
          ),
          day_today: "bg-[#E7B7B7] text-[#5A2E2E] font-semibold",
          day_selected: "bg-[#E7B7B7] text-[#5A2E2E]",
          head_cell: "text-[#A98C8C] font-normal text-xs",
          caption: "text-[#7A4A4A]",
          nav_button: "text-[#8B5E5E] hover:bg-[#F2DADA]",
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
                  <span className="text-sm" style={{ color: "#C7A9A9" }}>
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

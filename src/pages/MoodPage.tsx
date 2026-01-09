import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { MoodCalendar } from "@/components/mood/MoodCalendar";
import { MoodTimeline } from "@/components/mood/MoodTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

interface MoodEntry {
  id: string;
  mood: Mood;
  date: string;
  created_at: string;
}

const getSessionId = () => {
  let sessionId = localStorage.getItem("manoveda_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("manoveda_session_id", sessionId);
  }
  return sessionId;
};

const MoodPage = () => {
  const navigate = useNavigate();
  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const sessionId = getSessionId();

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("session_id", sessionId)
        .order("date", { ascending: false });

      if (error) throw error;

      const entries = (data || []).map((entry) => ({
        ...entry,
        mood: entry.mood as Mood,
      }));

      setMoodEntries(entries);

      // Check if there's an entry for today
      const todayEntry = entries.find((entry) => entry.date === today);
      if (todayEntry) {
        setTodayMood(todayEntry.mood);
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (mood: Mood) => {
    setIsSaving(true);
    try {
      // Check if entry exists for today
      const existingEntry = moodEntries.find((entry) => entry.date === today);

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("mood_entries")
          .update({ mood })
          .eq("id", existingEntry.id);

        if (error) throw error;

        setMoodEntries((prev) =>
          prev.map((entry) =>
            entry.id === existingEntry.id ? { ...entry, mood } : entry
          )
        );
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from("mood_entries")
          .insert({ mood, date: today, session_id: sessionId })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setMoodEntries((prev) => [
            { ...data, mood: data.mood as Mood },
            ...prev,
          ]);
        }
      }

      setTodayMood(mood);
    } catch (error) {
      console.error("Error saving mood:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium text-foreground">Mood</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Today's Mood Selection */}
        <section className="animate-fade-up">
          <p className="text-sm text-muted-foreground text-center mb-6">
            How are you feeling today?
          </p>
          <MoodSelector
            selectedMood={todayMood}
            onMoodSelect={handleMoodSelect}
            disabled={isSaving}
          />
          {todayMood && (
            <p className="text-xs text-muted-foreground text-center mt-4 animate-fade-in">
              You're allowed to feel this.
            </p>
          )}
        </section>

        {/* History Section */}
        <section className="pt-4">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-background"
              >
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-background"
              >
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-6">
              <MoodCalendar entries={moodEntries} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="timeline" className="mt-6">
              <MoodTimeline entries={moodEntries} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default MoodPage;

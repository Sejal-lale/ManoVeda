import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StuckButton, StudyAction } from "@/components/StuckButton";
import { AICompanion } from "@/components/AICompanion";
import { BreathingTimer } from "@/components/BreathingTimer";
import { ChatModal } from "@/components/ChatModal";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

const Index = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentAction, setCurrentAction] = useState<StudyAction | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleActionRevealed = (action: StudyAction) => {
    setCurrentAction(action);
    setIsTimerActive(true);
  };

  const handleTimerClose = () => {
    setCurrentAction(null);
    setIsTimerActive(false);
  };

  const handleTimerComplete = () => {
    setCurrentAction(null);
    setIsTimerActive(false);
  };

  // Parse duration from action (e.g., "5 min" -> 300 seconds)
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 300;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/20 pointer-events-none" />
      
      <Header />

      {/* Main content - Mobile-first single column layout */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-8 safe-area-inset-bottom">
        {/* Mobile: stacked layout, Desktop: horizontal */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10 md:gap-16">
          {/* Mood Button */}
          <div className="order-2 sm:order-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/mood")}
              className="flex flex-col items-center gap-2 h-auto py-4 px-8 rounded-2xl hover:bg-accent transition-all duration-300 active:scale-95"
            >
              <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-7 h-7 sm:w-7 sm:h-7 text-primary" />
              </div>
              <span className="text-base font-medium text-foreground">Mood</span>
            </Button>
          </div>

          {/* Main Stuck Button - Center and primary focus */}
          <div className="order-1 sm:order-2 flex-shrink-0">
            <StuckButton 
              onActionRevealed={handleActionRevealed}
              disabled={isTimerActive}
            />
          </div>

          {/* AI Companion */}
          <div className="order-3 flex-shrink-0">
            <AICompanion onClick={() => setIsChatOpen(true)} />
          </div>
        </div>
      </main>

      {/* Breathing Timer - Fullscreen mobile experience */}
      {isTimerActive && currentAction && (
        <BreathingTimer
          duration={parseDuration(currentAction.duration)}
          actionText={currentAction.text}
          onComplete={handleTimerComplete}
          onClose={handleTimerClose}
        />
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentMood={selectedMood}
      />
    </div>
  );
};

export default Index;

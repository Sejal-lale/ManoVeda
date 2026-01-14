import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StuckButton, StudyAction } from "@/components/StuckButton";
import { BreathingTimer } from "@/components/BreathingTimer";
import { ChatModal } from "@/components/ChatModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { Heart, MessageCircle } from "lucide-react";

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

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 300;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/20 pointer-events-none" />
      
      <Header />

      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-8 safe-area-inset-bottom">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10 md:gap-16">
          {/* Mood Button */}
          <div className="order-2 sm:order-1 flex-shrink-0">
            <ActionButton
              icon={Heart}
              label="Mood"
              onClick={() => navigate("/mood")}
            />
          </div>

          {/* Main Stuck Button */}
          <div className="order-1 sm:order-2 flex-shrink-0">
            <StuckButton 
              onActionRevealed={handleActionRevealed}
              disabled={isTimerActive}
            />
          </div>

          {/* Talk Button - Now matches Mood button */}
          <div className="order-3 flex-shrink-0">
            <ActionButton
              icon={MessageCircle}
              label="Talk"
              onClick={() => setIsChatOpen(true)}
            />
          </div>
        </div>
      </main>

      {isTimerActive && currentAction && (
        <BreathingTimer
          duration={parseDuration(currentAction.duration)}
          actionText={currentAction.text}
          onComplete={handleTimerComplete}
          onClose={handleTimerClose}
        />
      )}

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentMood={selectedMood}
      />
    </div>
  );
};

export default Index;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { StuckButton, StudyAction } from "@/components/StuckButton";
import { BreathingTimer } from "@/components/BreathingTimer";
import { ChatModal } from "@/components/ChatModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { AdminOverrideBanner } from "@/components/admin/AdminOverrideBanner";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { VictoryFeedback } from "@/components/progress/VictoryFeedback";
import { useProgress } from "@/hooks/useProgress";
import { useAdmin } from "@/contexts/AdminContext";
import { Heart, MessageCircle } from "lucide-react";

type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

const Index = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentAction, setCurrentAction] = useState<StudyAction | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | undefined>();
  
  const { progress, completeTask } = useProgress();

  const handleActionRevealed = (action: StudyAction) => {
    setCurrentAction(action);
    setIsTimerActive(true);
  };

  const handleTimerClose = () => {
    setCurrentAction(null);
    setIsTimerActive(false);
  };

  const handleTimerComplete = async () => {
    if (currentAction && progress) {
      const previousLevel = progress.current_level;
      await completeTask(currentAction.id, currentAction.text);
      
      // Check if leveled up (refresh progress after completion)
      // Note: We show victory feedback regardless, level-up is a bonus
      setLeveledUp(false);
      setNewLevel(undefined);
      setShowVictory(true);
    }
    
    setCurrentAction(null);
    setIsTimerActive(false);
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 300;
  };

  // Check if admin banner is active for layout offset
  const { preview, isAdmin } = useAdmin();
  const showAdminBanner = isAdmin && preview.isActive;

  return (
    <div className="min-h-screen bg-background relative">
      <AdminOverrideBanner />
      <Header className={showAdminBanner ? "top-10" : ""} />

      {/* Progress Display - Compact status bar */}
      <div className={cn("fixed left-0 right-0 z-30", showAdminBanner ? "top-24" : "top-14")}>
        <ProgressHeader />
      </div>

      <main className={cn("relative min-h-screen flex flex-col items-center justify-center px-4 pb-8", showAdminBanner ? "pt-32" : "pt-24")}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8 md:gap-12">
          {/* Mood Button */}
          <div className="order-2 sm:order-1">
            <ActionButton
              icon={Heart}
              label="Mood"
              onClick={() => navigate("/mood")}
            />
          </div>

          {/* Main Stuck Button */}
          <div className="order-1 sm:order-2">
            <StuckButton 
              onActionRevealed={handleActionRevealed}
              disabled={isTimerActive}
            />
          </div>

          {/* Talk Button */}
          <div className="order-3">
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

      <VictoryFeedback
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        streakCount={progress?.streak_count || 0}
        leveledUp={leveledUp}
        newLevel={newLevel}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentMood={selectedMood}
      />
    </div>
  );
};

export default Index;

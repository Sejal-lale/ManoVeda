import { useState } from "react";
import { Header } from "@/components/Header";
import { StuckButton, StudyAction } from "@/components/StuckButton";
import { MoodTracker, Mood } from "@/components/MoodTracker";
import { AICompanion } from "@/components/AICompanion";
import { ActionCard } from "@/components/ActionCard";
import { ChatModal } from "@/components/ChatModal";

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentAction, setCurrentAction] = useState<StudyAction | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleActionRevealed = (action: StudyAction) => {
    setCurrentAction(action);
  };

  const handleActionClose = () => {
    setCurrentAction(null);
  };

  const handleActionStart = () => {
    // Could track analytics here
  };

  const handleActionComplete = () => {
    setCurrentAction(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/20 pointer-events-none" />
      
      <Header />

      {/* Main content */}
      <main className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16">
          {/* Mood Tracker - Left */}
          <div className="flex-shrink-0">
            <MoodTracker 
              selectedMood={selectedMood} 
              onMoodSelect={handleMoodSelect} 
            />
          </div>

          {/* Main Button - Center */}
          <div className="flex-shrink-0">
            <StuckButton 
              onActionRevealed={handleActionRevealed}
              disabled={!!currentAction}
            />
          </div>

          {/* AI Companion - Right */}
          <div className="flex-shrink-0">
            <AICompanion onClick={() => setIsChatOpen(true)} />
          </div>
        </div>
      </main>

      {/* Action Card Modal */}
      {currentAction && (
        <ActionCard
          action={currentAction}
          onClose={handleActionClose}
          onStart={handleActionStart}
          onComplete={handleActionComplete}
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

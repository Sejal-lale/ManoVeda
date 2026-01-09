import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StuckButton, StudyAction } from "@/components/StuckButton";
import { AICompanion } from "@/components/AICompanion";
import { ActionCard } from "@/components/ActionCard";
import { ChatModal } from "@/components/ChatModal";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type Mood = "calm" | "okay" | "stressed" | "overwhelmed" | "sad" | "numb";

const Index = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentAction, setCurrentAction] = useState<StudyAction | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
          {/* Mood Button - Left */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/mood")}
              className="flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-2xl hover:bg-accent transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Mood</span>
            </Button>
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

import { cn } from "@/lib/utils";
import { StreakDisplay } from "./StreakDisplay";
import { MomentumLevel } from "./MomentumLevel";
import { useProgress } from "@/hooks/useProgress";
import { useAdmin } from "@/contexts/AdminContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressHeaderProps {
  className?: string;
}

export const ProgressHeader = ({ className }: ProgressHeaderProps) => {
  const { progress, loading, getCurrentLevel, getLevelProgress, isStreakAtRisk } = useProgress();
  const { gameRules } = useAdmin();
  
  // Don't show if both streaks and levels are disabled
  const showStreaks = gameRules.allowStreaks;
  const showLevels = gameRules.allowLevels;
  
  if (!showStreaks && !showLevels) return null;
  
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-3", className)}>
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
    );
  }
  
  if (!progress) return null;
  
  const currentLevel = getCurrentLevel();
  const levelProgress = getLevelProgress();
  const atRisk = isStreakAtRisk();
  
  return (
    <div className={cn("flex items-center justify-center py-2", className)}>
      {/* Compact status pill */}
      <div className="flex items-center gap-1 bg-card rounded-xl shadow-sm px-1 py-1">
        {showStreaks && (
          <StreakDisplay 
            streakCount={progress.streak_count} 
            isAtRisk={atRisk}
            compact
          />
        )}
        
        {showStreaks && showLevels && (
          <div className="w-px h-8 bg-border mx-1" />
        )}
        
        {showLevels && (
          <MomentumLevel 
            level={currentLevel.level} 
            progress={levelProgress}
            compact
          />
        )}
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { StreakDisplay } from "./StreakDisplay";
import { MomentumLevel } from "./MomentumLevel";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressHeaderProps {
  className?: string;
}

export const ProgressHeader = ({ className }: ProgressHeaderProps) => {
  const { progress, loading, getCurrentLevel, getLevelProgress, isStreakAtRisk } = useProgress();
  
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center gap-8", className)}>
        <Skeleton className="h-16 w-20" />
        <Skeleton className="h-16 w-32" />
      </div>
    );
  }
  
  if (!progress) return null;
  
  const currentLevel = getCurrentLevel();
  const levelProgress = getLevelProgress();
  const atRisk = isStreakAtRisk();
  
  return (
    <div className={cn(
      "flex items-center justify-center gap-8 py-4",
      className
    )}>
      <StreakDisplay 
        streakCount={progress.streak_count} 
        isAtRisk={atRisk}
        compact
      />
      
      <div className="w-px h-10 bg-border" />
      
      <MomentumLevel 
        level={currentLevel.level} 
        progress={levelProgress}
        compact
      />
    </div>
  );
};

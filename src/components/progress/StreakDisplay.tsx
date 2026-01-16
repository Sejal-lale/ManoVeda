import { Flame, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  streakCount: number;
  isAtRisk?: boolean;
  compact?: boolean;
}

export const StreakDisplay = ({ streakCount, isAtRisk = false, compact = false }: StreakDisplayProps) => {
  const hasStreak = streakCount > 0;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        compact ? "flex-col" : "flex-row",
        isAtRisk && hasStreak && "animate-pulse"
      )}
    >
      <div className={cn(
        "relative flex items-center justify-center",
        compact ? "w-10 h-10" : "w-12 h-12",
        "rounded-full",
        hasStreak ? "bg-orange-500/20" : "bg-muted",
        isAtRisk && hasStreak && "ring-2 ring-orange-400/50"
      )}>
        {hasStreak ? (
          <Flame 
            className={cn(
              "text-orange-500",
              compact ? "w-5 h-5" : "w-6 h-6",
              isAtRisk ? "animate-bounce" : "animate-pulse"
            )} 
          />
        ) : (
          <Flame 
            className={cn(
              "text-muted-foreground/40",
              compact ? "w-5 h-5" : "w-6 h-6"
            )} 
          />
        )}
        
        {isAtRisk && hasStreak && (
          <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-orange-400" />
        )}
      </div>
      
      <div className={cn(
        "flex flex-col",
        compact ? "items-center" : "items-start"
      )}>
        <span className={cn(
          "font-bold tabular-nums",
          compact ? "text-lg" : "text-2xl",
          hasStreak ? "text-foreground" : "text-muted-foreground"
        )}>
          {streakCount}
        </span>
        <span className={cn(
          "text-muted-foreground",
          compact ? "text-[10px]" : "text-xs"
        )}>
          {isAtRisk && hasStreak ? "At Risk!" : "Streak"}
        </span>
      </div>
    </div>
  );
};

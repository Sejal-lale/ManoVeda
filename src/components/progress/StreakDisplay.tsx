import { Flame, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  streakCount: number;
  isAtRisk?: boolean;
  compact?: boolean;
}

export const StreakDisplay = ({ streakCount, isAtRisk = false, compact = false }: StreakDisplayProps) => {
  const hasStreak = streakCount > 0;
  
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        isAtRisk && hasStreak && "bg-risk/10"
      )}>
        <div className={cn(
          "flex items-center justify-center w-7 h-7 rounded-md",
          hasStreak ? "bg-streak/15" : "bg-secondary"
        )}>
          <Flame 
            className={cn(
              "w-4 h-4",
              hasStreak ? "text-streak" : "text-muted-foreground"
            )}
            strokeWidth={2}
          />
        </div>
        
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-base font-bold tabular-nums",
              hasStreak ? "text-foreground" : "text-muted-foreground"
            )}>
              {streakCount}
            </span>
            {isAtRisk && hasStreak && (
              <AlertTriangle className="w-3 h-3 text-risk" />
            )}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Streak
          </span>
        </div>
      </div>
    );
  }
  
  // Full display (not compact)
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl bg-card shadow-sm",
      isAtRisk && hasStreak && "ring-1 ring-risk/30"
    )}>
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg",
        hasStreak ? "bg-streak/15" : "bg-secondary"
      )}>
        <Flame 
          className={cn(
            "w-6 h-6",
            hasStreak ? "text-streak" : "text-muted-foreground"
          )}
          strokeWidth={2}
        />
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-2xl font-bold tabular-nums",
            hasStreak ? "text-foreground" : "text-muted-foreground"
          )}>
            {streakCount}
          </span>
          {isAtRisk && hasStreak && (
            <span className="flex items-center gap-1 text-xs font-medium text-risk">
              <AlertTriangle className="w-3 h-3" />
              At Risk
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Day Streak
        </span>
      </div>
    </div>
  );
};

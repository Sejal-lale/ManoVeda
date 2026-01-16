import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MOMENTUM_LEVELS } from "@/hooks/useProgress";

interface MomentumLevelProps {
  level: number;
  progress: number;
  compact?: boolean;
}

export const MomentumLevel = ({ level, progress, compact = false }: MomentumLevelProps) => {
  const levelData = MOMENTUM_LEVELS.find(l => l.level === level) || MOMENTUM_LEVELS[0];
  const isMaxLevel = level >= MOMENTUM_LEVELS.length;
  
  return (
    <div className={cn(
      "flex flex-col gap-2",
      compact ? "items-center w-24" : "items-start w-full max-w-[180px]"
    )}>
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center rounded-full",
          compact ? "w-8 h-8" : "w-10 h-10",
          "bg-primary/20"
        )}>
          <Zap className={cn(
            "text-primary",
            compact ? "w-4 h-4" : "w-5 h-5"
          )} />
        </div>
        
        <div className="flex flex-col whitespace-nowrap">
          <span className={cn(
            "font-semibold text-foreground",
            compact ? "text-xs" : "text-sm"
          )}>
            Level {level}
          </span>
          <span className={cn(
            "text-muted-foreground font-medium",
            compact ? "text-[10px]" : "text-xs"
          )}>
            {levelData.title}
          </span>
        </div>
      </div>
      
      {!compact && (
        <div className="w-full space-y-1">
          <Progress 
            value={isMaxLevel ? 100 : progress} 
            className="h-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{isMaxLevel ? "Max Level" : `${progress}%`}</span>
            {!isMaxLevel && level < MOMENTUM_LEVELS.length && (
              <span>→ {MOMENTUM_LEVELS[level]?.title}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

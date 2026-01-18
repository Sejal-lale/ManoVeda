import { Zap, Snowflake, Sun, Activity, Focus, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MOMENTUM_LEVELS } from "@/hooks/useProgress";

// Level-specific icons for visual evolution
const levelIcons: Record<number, typeof Zap> = {
  1: Snowflake,  // Frozen
  2: Sun,        // Warming Up
  3: Activity,   // Moving
  4: Focus,      // Focused
  5: Crown,      // In Control
};

interface MomentumLevelProps {
  level: number;
  progress: number;
  compact?: boolean;
}

export const MomentumLevel = ({ level, progress, compact = false }: MomentumLevelProps) => {
  const levelData = MOMENTUM_LEVELS.find(l => l.level === level) || MOMENTUM_LEVELS[0];
  const isMaxLevel = level >= MOMENTUM_LEVELS.length;
  const LevelIcon = levelIcons[level] || Zap;
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/15">
          <LevelIcon className="w-4 h-4 text-primary" strokeWidth={2} />
        </div>
        
        <div className="flex flex-col leading-none whitespace-nowrap">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            {levelData.title}
          </span>
        </div>
        
        {/* Mini progress ring */}
        <div className="relative w-6 h-6 ml-1">
          <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${(isMaxLevel ? 100 : progress) * 0.628} 62.8`}
            />
          </svg>
        </div>
      </div>
    );
  }
  
  // Full display (not compact)
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-card shadow-sm w-full max-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/15">
          <LevelIcon className="w-6 h-6 text-primary" strokeWidth={2} />
        </div>
        
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">
            Level {level}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {levelData.title}
          </span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Progress 
          value={isMaxLevel ? 100 : progress} 
          className="h-2"
        />
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
          <span>{isMaxLevel ? "Max Level" : `${progress}%`}</span>
          {!isMaxLevel && level < MOMENTUM_LEVELS.length && (
            <span>→ {MOMENTUM_LEVELS[level]?.title}</span>
          )}
        </div>
      </div>
    </div>
  );
};
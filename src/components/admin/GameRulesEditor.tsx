import { useAdmin } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Unlock } from "lucide-react";

export const GameRulesEditor = () => {
  const { gameRules, updateGameRules } = useAdmin();

  const toggleRewardType = (type: 'visual' | 'sensory' | 'animation') => {
    const current = gameRules.rewardTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateGameRules({ rewardTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-foreground">Gamification Rules</h2>
        <p className="text-sm text-muted-foreground">Control progression and reward systems</p>
      </div>

      {/* System Banner */}
      <Card className="border-accent/30 bg-accent/10">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Emotion-First Design</p>
              <p className="text-xs text-muted-foreground">
                Progress is private, cumulative, and never punitive. 
                Harmful gamification patterns are system-guarded.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Progression */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Progression Systems</CardTitle>
          </div>
          <CardDescription>Safe, private progression tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Streaks</p>
              <p className="text-xs text-muted-foreground">Track consecutive days (pauses, never resets harshly)</p>
            </div>
            <Switch 
              checked={gameRules.allowStreaks} 
              onCheckedChange={(v) => updateGameRules({ allowStreaks: v })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Momentum Levels</p>
              <p className="text-xs text-muted-foreground">Mental state mastery progression</p>
            </div>
            <Switch 
              checked={gameRules.allowLevels} 
              onCheckedChange={(v) => updateGameRules({ allowLevels: v })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Completion Badges</p>
              <p className="text-xs text-muted-foreground">Visual milestone markers</p>
            </div>
            <Switch 
              checked={gameRules.allowBadges} 
              onCheckedChange={(v) => updateGameRules({ allowBadges: v })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Visual Progression</p>
              <p className="text-xs text-muted-foreground">Progress rings and feedback</p>
            </div>
            <Switch 
              checked={gameRules.allowVisualProgression} 
              onCheckedChange={(v) => updateGameRules({ allowVisualProgression: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* System-Guarded */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">System-Guarded</CardTitle>
          </div>
          <CardDescription>Replaced with safer alternatives by design</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 opacity-50">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground line-through">Leaderboards</p>
              <p className="text-xs text-muted-foreground">→ Personal Momentum Tracking</p>
            </div>
            <Switch checked={false} disabled />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground line-through">Loss Penalties</p>
              <p className="text-xs text-muted-foreground">→ Momentum Pause (No Reset)</p>
            </div>
            <Switch checked={false} disabled />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground line-through">Public Scores</p>
              <p className="text-xs text-muted-foreground">→ Session-Only Visibility</p>
            </div>
            <Switch checked={false} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Reward types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Feedback Types</CardTitle>
          <CardDescription>How progress is celebrated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={gameRules.rewardTypes.includes('visual')}
                onCheckedChange={() => toggleRewardType('visual')}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Visual Rewards</p>
                <p className="text-xs text-muted-foreground">Colors, glows, progress rings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={gameRules.rewardTypes.includes('sensory')}
                onCheckedChange={() => toggleRewardType('sensory')}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Sensory Rewards</p>
                <p className="text-xs text-muted-foreground">Haptic feedback, sounds</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={gameRules.rewardTypes.includes('animation')}
                onCheckedChange={() => toggleRewardType('animation')}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Animation Rewards</p>
                <p className="text-xs text-muted-foreground">Transitions, micro-interactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
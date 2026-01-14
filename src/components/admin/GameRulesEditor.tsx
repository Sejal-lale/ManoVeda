import { useAdmin } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

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
        <h2 className="text-lg font-medium text-foreground">Game Feel Rules</h2>
        <p className="text-sm text-muted-foreground">Control gamification elements</p>
      </div>

      {/* Warning card */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">Emotion-First Design</p>
              <p className="text-xs text-amber-700">
                This app avoids competitive or anxiety-inducing gamification. 
                Points, streaks, and failure states are disabled by design.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disallowed elements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Disallowed Elements</CardTitle>
          <CardDescription>These are off by design to maintain emotional safety</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 opacity-50">
            <div>
              <p className="text-sm font-medium text-foreground">Points System</p>
              <p className="text-xs text-muted-foreground">Score tracking and point rewards</p>
            </div>
            <Switch checked={gameRules.allowPoints} disabled />
          </div>
          <div className="flex items-center justify-between py-2 opacity-50">
            <div>
              <p className="text-sm font-medium text-foreground">Streaks</p>
              <p className="text-xs text-muted-foreground">Consecutive day tracking</p>
            </div>
            <Switch checked={gameRules.allowStreaks} disabled />
          </div>
          <div className="flex items-center justify-between py-2 opacity-50">
            <div>
              <p className="text-sm font-medium text-foreground">Failure States</p>
              <p className="text-xs text-muted-foreground">Negative feedback or penalties</p>
            </div>
            <Switch checked={gameRules.allowFailureStates} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Allowed reward types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reward Types</CardTitle>
          <CardDescription>Choose how to celebrate user progress</CardDescription>
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
                <p className="text-xs text-muted-foreground">Color changes, glows, confetti</p>
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

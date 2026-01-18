import { useState } from "react";
import { Shield, Lock, Unlock, Power, ChevronDown, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// System-guarded items with behavioral reasoning
const GUARDED_FEATURES = [
  {
    id: 'leaderboards',
    key: 'allowLeaderboards' as const,
    name: 'Leaderboards',
    replacedBy: 'Personal Momentum Tracking',
    reason: 'Social comparison increases anxiety under stress',
  },
  {
    id: 'social',
    key: 'allowSocialComparison' as const,
    name: 'Social Comparison',
    replacedBy: 'Private Progress Only',
    reason: 'Comparison triggers shame in vulnerable states',
  },
  {
    id: 'loss',
    key: 'allowLossPenalties' as const,
    name: 'Loss Penalties',
    replacedBy: 'Momentum Pause (No Reset)',
    reason: 'Punishment increases avoidance behavior',
  },
  {
    id: 'public',
    key: 'allowPublicScores' as const,
    name: 'Public Scores',
    replacedBy: 'Session-Only Visibility',
    reason: 'External judgment disrupts intrinsic motivation',
  },
];

export const AccessSafetySection = () => {
  const { gameRules, updateGameRules, preview, setPreviewActive } = useAdmin();
  const [progressionOpen, setProgressionOpen] = useState(true);
  const [guardedOpen, setGuardedOpen] = useState(false);
  const [killswitchOpen, setKillswitchOpen] = useState(false);

  const toggleRewardType = (type: 'visual' | 'sensory' | 'animation') => {
    const current = gameRules.rewardTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateGameRules({ rewardTypes: updated });
  };

  const activeProgressionCount = [
    gameRules.allowStreaks,
    gameRules.allowLevels,
    gameRules.allowBadges,
    gameRules.allowVisualProgression,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Access & Safety</h2>
        <p className="text-sm text-muted-foreground">
          Control progression systems and safeguards.
        </p>
      </div>

      {/* Pinned System Rule Banner */}
      <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
        <div className="flex gap-3 items-start">
          <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Emotion-First Design</p>
            <p className="text-xs text-muted-foreground">
              Gamification is private, cumulative, and never subtractive. 
              Progress rewards showing up — not winning.
            </p>
          </div>
        </div>
      </div>

      {/* Allowed Progression Systems */}
      <Collapsible open={progressionOpen} onOpenChange={setProgressionOpen}>
        <Card className="border-primary/20">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Unlock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Progression Systems</CardTitle>
                    <CardDescription className="text-xs">
                      {activeProgressionCount} of 4 systems active
                    </CardDescription>
                  </div>
                </div>
                {progressionOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Streaks</p>
                  <p className="text-xs text-muted-foreground">Track consecutive days of showing up</p>
                </div>
                <Switch
                  checked={gameRules.allowStreaks}
                  onCheckedChange={(v) => updateGameRules({ allowStreaks: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Momentum Levels</p>
                  <p className="text-xs text-muted-foreground">Mental state mastery progression</p>
                </div>
                <Switch
                  checked={gameRules.allowLevels}
                  onCheckedChange={(v) => updateGameRules({ allowLevels: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Completion Badges</p>
                  <p className="text-xs text-muted-foreground">Visual milestones for achievements</p>
                </div>
                <Switch
                  checked={gameRules.allowBadges}
                  onCheckedChange={(v) => updateGameRules({ allowBadges: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Visual Progression</p>
                  <p className="text-xs text-muted-foreground">Progress rings and feedback animations</p>
                </div>
                <Switch
                  checked={gameRules.allowVisualProgression}
                  onCheckedChange={(v) => updateGameRules({ allowVisualProgression: v })}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* System-Guarded Features */}
      <Collapsible open={guardedOpen} onOpenChange={setGuardedOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">System-Guarded</CardTitle>
                    <CardDescription className="text-xs">
                      Features replaced with safer alternatives
                    </CardDescription>
                  </div>
                </div>
                {guardedOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {GUARDED_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-muted-foreground line-through">
                          {feature.name}
                        </p>
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                          Replaced
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium">
                        → {feature.replacedBy}
                      </p>
                      <div className="flex items-start gap-1.5 mt-2">
                        <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground italic">
                          {feature.reason}
                        </p>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Allowed Rewards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Feedback Types</CardTitle>
              <CardDescription className="text-xs">
                How the system rewards progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
            <Checkbox
              checked={gameRules.rewardTypes.includes('visual')}
              onCheckedChange={() => toggleRewardType('visual')}
            />
            <div>
              <p className="text-sm font-medium">Visual Rewards</p>
              <p className="text-xs text-muted-foreground">Colors, glows, progress rings</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
            <Checkbox
              checked={gameRules.rewardTypes.includes('sensory')}
              onCheckedChange={() => toggleRewardType('sensory')}
            />
            <div>
              <p className="text-sm font-medium">Sensory Rewards</p>
              <p className="text-xs text-muted-foreground">Haptics, sounds</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
            <Checkbox
              checked={gameRules.rewardTypes.includes('animation')}
              onCheckedChange={() => toggleRewardType('animation')}
            />
            <div>
              <p className="text-sm font-medium">Animation Rewards</p>
              <p className="text-xs text-muted-foreground">Transitions, micro-interactions</p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Kill Switches */}
      <Collapsible open={killswitchOpen} onOpenChange={setKillswitchOpen}>
        <Card className="border-destructive/30">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-destructive/5 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Power className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Emergency Controls</CardTitle>
                    <CardDescription className="text-xs">
                      Quick actions for urgent situations
                    </CardDescription>
                  </div>
                </div>
                {killswitchOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="text-sm font-medium">Disable All Overrides</p>
                  <p className="text-xs text-muted-foreground">
                    Turn off preview mode and all forced states
                  </p>
                </div>
                <button
                  onClick={() => setPreviewActive(false)}
                  disabled={!preview.isActive}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    preview.isActive
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {preview.isActive ? "Disable Now" : "Not Active"}
                </button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
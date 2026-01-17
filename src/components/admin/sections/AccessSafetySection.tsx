import { useState } from "react";
import { Shield, AlertTriangle, Power, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const AccessSafetySection = () => {
  const { gameRules, updateGameRules, preview, setPreviewActive } = useAdmin();
  const [rulesOpen, setRulesOpen] = useState(true);
  const [killswitchOpen, setKillswitchOpen] = useState(false);

  const toggleRewardType = (type: 'visual' | 'sensory' | 'animation') => {
    const current = gameRules.rewardTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateGameRules({ rewardTypes: updated });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Access & Safety</h2>
        <p className="text-sm text-muted-foreground">
          Safeguards, limits, and emergency controls.
        </p>
      </div>

      {/* Design Principles */}
      <Card className="border-accent bg-accent/10">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Emotion-First Design</p>
              <p className="text-xs text-muted-foreground">
                Points, competitive elements, and failure states are disabled by design 
                to maintain emotional safety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Collapsible open={rulesOpen} onOpenChange={setRulesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Gamification Rules</CardTitle>
                    <CardDescription className="text-xs">
                      Protected settings for user wellbeing
                    </CardDescription>
                  </div>
                </div>
                {rulesOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Disallowed - Locked */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Disallowed (Locked)
                </p>
                <div className="space-y-2 opacity-50">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Points System</p>
                      <p className="text-xs text-muted-foreground">Score tracking</p>
                    </div>
                    <Switch checked={false} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Competitive Streaks</p>
                      <p className="text-xs text-muted-foreground">Leaderboards & comparisons</p>
                    </div>
                    <Switch checked={false} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Failure Penalties</p>
                      <p className="text-xs text-muted-foreground">Negative feedback</p>
                    </div>
                    <Switch checked={false} disabled />
                  </div>
                </div>
              </div>

              {/* Allowed Rewards */}
              <div className="space-y-2 pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Allowed Rewards
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Checkbox
                      checked={gameRules.rewardTypes.includes('visual')}
                      onCheckedChange={() => toggleRewardType('visual')}
                    />
                    <div>
                      <p className="text-sm font-medium">Visual Rewards</p>
                      <p className="text-xs text-muted-foreground">Colors, glows, confetti</p>
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
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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

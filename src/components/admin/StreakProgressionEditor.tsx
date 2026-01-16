import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Flame, Zap, RotateCcw, Save } from "lucide-react";
import { useState, useEffect } from "react";

// Admin-configurable streak settings (stored in localStorage for now)
interface StreakSettings {
  enabled: boolean;
  requiredActionsPerDay: number;
  recoveryEnabled: boolean;
  recoveryTokensPerWeek: number;
}

interface LevelConfig {
  level: number;
  title: string;
  minCompletions: number;
}

interface ProgressionSettings {
  levels: LevelConfig[];
  pressureCopy: string[];
}

const DEFAULT_STREAK_SETTINGS: StreakSettings = {
  enabled: true,
  requiredActionsPerDay: 1,
  recoveryEnabled: true,
  recoveryTokensPerWeek: 1,
};

const DEFAULT_PROGRESSION_SETTINGS: ProgressionSettings = {
  levels: [
    { level: 1, title: "Frozen", minCompletions: 0 },
    { level: 2, title: "Warming Up", minCompletions: 3 },
    { level: 3, title: "Moving", minCompletions: 10 },
    { level: 4, title: "Focused", minCompletions: 25 },
    { level: 5, title: "In Control", minCompletions: 50 },
  ],
  pressureCopy: [
    "You showed up.",
    "Streak protected.",
    "Momentum maintained.",
    "Task cleared.",
    "One step forward.",
  ],
};

export const StreakProgressionEditor = () => {
  const [streakSettings, setStreakSettings] = useState<StreakSettings>(() => {
    const saved = localStorage.getItem("manoveda-streak-settings");
    return saved ? JSON.parse(saved) : DEFAULT_STREAK_SETTINGS;
  });

  const [progressionSettings, setProgressionSettings] = useState<ProgressionSettings>(() => {
    const saved = localStorage.getItem("manoveda-progression-settings");
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESSION_SETTINGS;
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [streakSettings, progressionSettings]);

  const handleSave = () => {
    localStorage.setItem("manoveda-streak-settings", JSON.stringify(streakSettings));
    localStorage.setItem("manoveda-progression-settings", JSON.stringify(progressionSettings));
    setHasChanges(false);
  };

  const handleResetStreak = () => {
    setStreakSettings(DEFAULT_STREAK_SETTINGS);
  };

  const handleResetProgression = () => {
    setProgressionSettings(DEFAULT_PROGRESSION_SETTINGS);
  };

  const updateLevelTitle = (index: number, title: string) => {
    setProgressionSettings((prev) => ({
      ...prev,
      levels: prev.levels.map((l, i) => (i === index ? { ...l, title } : l)),
    }));
  };

  const updateLevelThreshold = (index: number, minCompletions: number) => {
    setProgressionSettings((prev) => ({
      ...prev,
      levels: prev.levels.map((l, i) => (i === index ? { ...l, minCompletions } : l)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-foreground">Streak & Progression</h2>
          <p className="text-sm text-muted-foreground">
            Configure gamification settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Streak Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-base">Streak System</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetStreak}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Daily action tracking with accountability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Enable Streaks</Label>
            <Switch
              checked={streakSettings.enabled}
              onCheckedChange={(enabled) =>
                setStreakSettings((prev) => ({ ...prev, enabled }))
              }
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Required Actions Per Day</Label>
              <span className="text-sm font-medium text-foreground">
                {streakSettings.requiredActionsPerDay}
              </span>
            </div>
            <Slider
              value={[streakSettings.requiredActionsPerDay]}
              onValueChange={([v]) =>
                setStreakSettings((prev) => ({
                  ...prev,
                  requiredActionsPerDay: v,
                }))
              }
              min={1}
              max={5}
              step={1}
              disabled={!streakSettings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Recovery Tokens</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Allow users to recover broken streaks
              </p>
            </div>
            <Switch
              checked={streakSettings.recoveryEnabled}
              onCheckedChange={(recoveryEnabled) =>
                setStreakSettings((prev) => ({ ...prev, recoveryEnabled }))
              }
              disabled={!streakSettings.enabled}
            />
          </div>

          {streakSettings.recoveryEnabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tokens Per Week</Label>
                <span className="text-sm font-medium text-foreground">
                  {streakSettings.recoveryTokensPerWeek}
                </span>
              </div>
              <Slider
                value={[streakSettings.recoveryTokensPerWeek]}
                onValueChange={([v]) =>
                  setStreakSettings((prev) => ({
                    ...prev,
                    recoveryTokensPerWeek: v,
                  }))
                }
                min={1}
                max={3}
                step={1}
                disabled={!streakSettings.enabled}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progression/Levels */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Momentum Levels</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetProgression}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Level names and completion thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {progressionSettings.levels.map((level, index) => (
            <div
              key={level.level}
              className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                {level.level}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={level.title}
                  onChange={(e) => updateLevelTitle(index, e.target.value)}
                  className="h-8"
                  placeholder="Level name"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Unlocks at:</span>
                  <Input
                    type="number"
                    value={level.minCompletions}
                    onChange={(e) =>
                      updateLevelThreshold(index, parseInt(e.target.value) || 0)
                    }
                    className="h-6 w-16 text-xs"
                    min={0}
                  />
                  <span>completions</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pressure Copy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Completion Messages</CardTitle>
          <CardDescription>
            Shown when a task is completed (pressure copy)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {progressionSettings.pressureCopy.map((copy, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={copy}
                onChange={(e) => {
                  setProgressionSettings((prev) => ({
                    ...prev,
                    pressureCopy: prev.pressureCopy.map((c, i) =>
                      i === index ? e.target.value : c
                    ),
                  }));
                }}
                className="flex-1"
                placeholder="Enter completion message"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setProgressionSettings((prev) => ({
                    ...prev,
                    pressureCopy: prev.pressureCopy.filter((_, i) => i !== index),
                  }));
                }}
                className="text-destructive hover:text-destructive"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setProgressionSettings((prev) => ({
                ...prev,
                pressureCopy: [...prev.pressureCopy, ""],
              }));
            }}
          >
            + Add Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

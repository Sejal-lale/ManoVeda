import { useState, useRef, useEffect } from "react";
import { Sparkles, Type, ChevronDown, ChevronRight, Play, RotateCcw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, transitionStyles, TransitionStyle } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const animationDescriptions: Record<string, string> = {
  stuck_entry: "Tap 'I'm Stuck' button",
  timer_transition: "Home → Timer transition",
  task_reveal: "Task reveal animation",
  completion: "Task completion celebration",
};

// Animation preview component
const AnimationPreview = ({ 
  style, 
  duration, 
  intensity, 
  isPlaying,
  onPlayComplete 
}: { 
  style: TransitionStyle; 
  duration: number; 
  intensity: number; 
  isPlaying: boolean;
  onPlayComplete: () => void;
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey(prev => prev + 1);
      const timer = setTimeout(onPlayComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, duration, onPlayComplete]);

  const getAnimationStyle = () => {
    const scale = 0.9 + (intensity / 500);
    const blur = intensity / 25;
    
    switch (style) {
      case 'bubble_release':
        return {
          animation: isPlaying ? `bubbleRelease ${duration}ms ease-out forwards` : 'none',
        };
      case 'portal_zoom':
        return {
          animation: isPlaying ? `portalZoom ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : 'none',
        };
      case 'breath_wave':
        return {
          animation: isPlaying ? `breathWave ${duration}ms ease-in-out forwards` : 'none',
        };
      case 'suspense_hold':
        return {
          animation: isPlaying ? `suspenseHold ${duration}ms ease-out forwards` : 'none',
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
      <style>
        {`
          @keyframes bubbleRelease {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(${1 + intensity / 200}); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes portalZoom {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(${1.1 + intensity / 200}); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes breathWave {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(${1 + intensity / 150}); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes suspenseHold {
            0% { transform: scale(0.95); opacity: 0; }
            20% { transform: scale(0.95); opacity: 0.5; }
            80% { transform: scale(0.95); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      <div
        key={animationKey}
        className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"
        style={getAnimationStyle()}
      >
        <Zap className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
  );
};

export const ExperienceLayerSection = () => {
  const { animations, updateAnimation, content, updateButtonText, updateMicrocopy } = useAdmin();
  const [animationsOpen, setAnimationsOpen] = useState(true);
  const [copyOpen, setCopyOpen] = useState(false);
  const [playingAnimations, setPlayingAnimations] = useState<Record<string, boolean>>({});

  const enabledAnimations = animations.filter(a => a.enabled).length;

  const playAnimation = (animId: string) => {
    setPlayingAnimations(prev => ({ ...prev, [animId]: true }));
  };

  const stopAnimation = (animId: string) => {
    setPlayingAnimations(prev => ({ ...prev, [animId]: false }));
  };

  // Auto-play on value change
  const handleValueChange = (animId: string, updates: Parameters<typeof updateAnimation>[1]) => {
    updateAnimation(animId, updates);
    // Trigger preview on change
    playAnimation(animId);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Experience Layer</h2>
        <p className="text-sm text-muted-foreground">
          Live animation controller and copy editor.
        </p>
      </div>

      {/* Live Controller Banner */}
      <div className="p-3 rounded-lg bg-accent/20 border border-accent/30 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <p className="text-xs text-muted-foreground">
          Adjusting any setting triggers <span className="font-medium text-foreground">instant preview</span>. 
          No invisible settings.
        </p>
      </div>

      {/* Animation System */}
      <Collapsible open={animationsOpen} onOpenChange={setAnimationsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Animation Controller</CardTitle>
                    <CardDescription className="text-xs">
                      {enabledAnimations} of {animations.length} animations active
                    </CardDescription>
                  </div>
                </div>
                {animationsOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {animations.map((anim) => (
                <div
                  key={anim.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    !anim.enabled && "opacity-50 bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Preview Surface */}
                    <AnimationPreview
                      style={anim.style}
                      duration={anim.duration}
                      intensity={anim.intensity}
                      isPlaying={playingAnimations[anim.id] || false}
                      onPlayComplete={() => stopAnimation(anim.id)}
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{anim.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {animationDescriptions[anim.id]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAnimation(anim.id)}
                            disabled={!anim.enabled}
                            className="h-7 w-7 p-0"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </Button>
                          <Switch
                            checked={anim.enabled}
                            onCheckedChange={(v) => handleValueChange(anim.id, { enabled: v })}
                          />
                        </div>
                      </div>

                      {anim.enabled && (
                        <div className="space-y-3 pt-2 border-t border-border">
                          <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Style</label>
                            <Select
                              value={anim.style}
                              onValueChange={(v) => handleValueChange(anim.id, { style: v as TransitionStyle })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {transitionStyles.map((style) => (
                                  <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <div className="flex justify-between">
                                <label className="text-xs text-muted-foreground">Duration</label>
                                <span className="text-xs font-mono text-muted-foreground">{anim.duration}ms</span>
                              </div>
                              <Slider
                                value={[anim.duration]}
                                min={200}
                                max={2000}
                                step={50}
                                onValueChange={([v]) => handleValueChange(anim.id, { duration: v })}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between">
                                <label className="text-xs text-muted-foreground">Intensity</label>
                                <span className="text-xs font-mono text-muted-foreground">{anim.intensity}%</span>
                              </div>
                              <Slider
                                value={[anim.intensity]}
                                min={10}
                                max={100}
                                step={5}
                                onValueChange={([v]) => handleValueChange(anim.id, { intensity: v })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Copy & Language */}
      <Collapsible open={copyOpen} onOpenChange={setCopyOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Type className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Copy & Language</CardTitle>
                    <CardDescription className="text-xs">
                      Button labels, microcopy, affirmations
                    </CardDescription>
                  </div>
                </div>
                {copyOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Button Text */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Button Text</p>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Main Button</label>
                    <Input
                      value={content.buttonText.stuckButton}
                      onChange={(e) => updateButtonText({ stuckButton: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Subtext</label>
                    <Input
                      value={content.buttonText.stuckSubtext}
                      onChange={(e) => updateButtonText({ stuckSubtext: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Loading Text</label>
                    <Input
                      value={content.buttonText.shufflingText}
                      onChange={(e) => updateButtonText({ shufflingText: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Microcopy */}
              <div className="space-y-3 pt-3 border-t border-border">
                <p className="text-sm font-medium">Microcopy</p>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Timer Complete</label>
                    <Input
                      value={content.microcopy.timerComplete}
                      onChange={(e) => updateMicrocopy({ timerComplete: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Mood Selected</label>
                    <Input
                      value={content.microcopy.moodSelected}
                      onChange={(e) => updateMicrocopy({ moodSelected: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Chat Greeting</label>
                    <Input
                      value={content.microcopy.chatGreeting}
                      onChange={(e) => updateMicrocopy({ chatGreeting: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
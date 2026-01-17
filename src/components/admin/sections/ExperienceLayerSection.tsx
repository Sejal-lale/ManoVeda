import { useState } from "react";
import { Sparkles, Palette, Type, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, transitionStyles, TransitionStyle } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const animationDescriptions: Record<string, string> = {
  stuck_entry: "Tap 'I'm Stuck' button",
  timer_transition: "Home → Timer transition",
  task_reveal: "Task reveal animation",
  completion: "Task completion celebration",
};

export const ExperienceLayerSection = () => {
  const { animations, updateAnimation, content, updateButtonText, updateMicrocopy } = useAdmin();
  const [animationsOpen, setAnimationsOpen] = useState(true);
  const [copyOpen, setCopyOpen] = useState(false);

  const enabledAnimations = animations.filter(a => a.enabled).length;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Experience Layer</h2>
        <p className="text-sm text-muted-foreground">
          Fine-tune animations, themes, and copy.
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
                    <CardTitle className="text-base">Animation System</CardTitle>
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
                    "p-3 rounded-lg border transition-opacity",
                    !anim.enabled && "opacity-50 bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">{anim.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {animationDescriptions[anim.id]}
                      </p>
                    </div>
                    <Switch
                      checked={anim.enabled}
                      onCheckedChange={(v) => updateAnimation(anim.id, { enabled: v })}
                    />
                  </div>

                  {anim.enabled && (
                    <div className="space-y-3 pt-2 border-t border-border">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Style</label>
                          <Select
                            value={anim.style}
                            onValueChange={(v) => updateAnimation(anim.id, { style: v as TransitionStyle })}
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
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <label className="text-xs text-muted-foreground">Duration</label>
                            <span className="text-xs text-muted-foreground">{anim.duration}ms</span>
                          </div>
                          <Slider
                            value={[anim.duration]}
                            min={600}
                            max={2000}
                            step={100}
                            onValueChange={([v]) => updateAnimation(anim.id, { duration: v })}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="text-xs text-muted-foreground">Intensity</label>
                          <span className="text-xs text-muted-foreground">{anim.intensity}%</span>
                        </div>
                        <Slider
                          value={[anim.intensity]}
                          min={10}
                          max={100}
                          step={5}
                          onValueChange={([v]) => updateAnimation(anim.id, { intensity: v })}
                        />
                      </div>
                    </div>
                  )}
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

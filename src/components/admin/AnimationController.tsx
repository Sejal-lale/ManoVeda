import { cn } from "@/lib/utils";
import { useAdmin, transitionStyles, TransitionStyle } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const animationDescriptions: Record<string, string> = {
  stuck_entry: "Animation when tapping 'I'm Stuck' button",
  timer_transition: "Transition from home to breathing timer",
  task_reveal: "Animation when revealing the task",
  completion: "Celebration when completing a task",
};

export const AnimationController = () => {
  const { animations, updateAnimation } = useAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-foreground">Animations & Transitions</h2>
        <p className="text-sm text-muted-foreground">Control how the app feels</p>
      </div>

      <div className="space-y-4">
        {animations.map((anim) => (
          <Card key={anim.id} className={cn(!anim.enabled && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{anim.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {animationDescriptions[anim.id]}
                  </CardDescription>
                </div>
                <Switch
                  checked={anim.enabled}
                  onCheckedChange={(v) => updateAnimation(anim.id, { enabled: v })}
                />
              </div>
            </CardHeader>
            
            {anim.enabled && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Style</label>
                  <Select
                    value={anim.style}
                    onValueChange={(v) => updateAnimation(anim.id, { style: v as TransitionStyle })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transitionStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          <div className="flex flex-col">
                            <span>{style.name}</span>
                            <span className="text-xs text-muted-foreground">{style.feel}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Duration</label>
                    <span className="text-xs text-muted-foreground">{anim.duration}ms</span>
                  </div>
                  <Slider
                    value={[anim.duration]}
                    min={600}
                    max={2000}
                    step={100}
                    onValueChange={([v]) => updateAnimation(anim.id, { duration: v })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Intensity</label>
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
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

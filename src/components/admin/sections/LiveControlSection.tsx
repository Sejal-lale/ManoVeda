import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Play, Target, Sparkles, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const LiveControlSection = () => {
  const {
    preview,
    setPreviewActive,
    setPreviewTask,
    setPreviewAnimation,
    setForcePreviewTask,
    tasks,
    animations,
    getEnabledTasks,
  } = useAdmin();
  const navigate = useNavigate();

  const enabledTasks = getEnabledTasks();

  const handleStartPreview = () => {
    setPreviewActive(true);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Live Control</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Override the live app state. Changes apply immediately.
        </p>
      </div>

      {/* Preview Mode - Master Control */}
      <Card className={cn(
        "border-2 transition-colors",
        preview.isActive ? "border-primary bg-primary/5" : "border-border"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                preview.isActive ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}>
                <Eye className={cn("w-5 h-5", preview.isActive && "animate-pulse")} />
              </div>
              <div>
                <CardTitle className="text-base">Preview Mode</CardTitle>
                <CardDescription className="text-xs">
                  {preview.isActive 
                    ? "Active — overrides are visible to you" 
                    : "Enable to test changes before deploying"
                  }
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={preview.isActive}
              onCheckedChange={setPreviewActive}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={handleStartPreview}
            className="w-full gap-2"
            variant={preview.isActive ? "default" : "outline"}
          >
            <Play className="w-4 h-4" />
            {preview.isActive ? "View Live Preview" : "Start Preview"}
          </Button>
        </CardContent>
      </Card>

      {/* Force Task Override */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Force Task</CardTitle>
                <CardDescription className="text-xs">
                  Override random selection with a specific task
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={preview.forceTask}
              onCheckedChange={setForcePreviewTask}
            />
          </div>
        </CardHeader>
        
        {preview.forceTask && (
          <CardContent className="pt-0 space-y-3">
            <Select
              value={preview.selectedTaskId || ""}
              onValueChange={(v) => setPreviewTask(v || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task to force..." />
              </SelectTrigger>
              <SelectContent>
                {enabledTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    <div className="flex flex-col items-start">
                      <span className="text-sm truncate max-w-[240px]">{task.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {task.difficulty.replace('_', ' ')} • {task.category}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {preview.selectedTaskId && (
              <div className="p-3 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Active override:</p>
                <p className="text-sm font-medium">
                  {tasks.find(t => t.id === preview.selectedTaskId)?.text}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Animation Override */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Animation Override</CardTitle>
              <CardDescription className="text-xs">
                Test a specific animation style
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Select
            value={preview.selectedAnimationId || "default"}
            onValueChange={(v) => setPreviewAnimation(v === "default" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Use default settings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Use default settings</SelectItem>
              {animations.map((anim) => (
                <SelectItem key={anim.id} value={anim.id}>
                  <div className="flex flex-col items-start">
                    <span>{anim.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {anim.style} • {anim.duration}ms
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Live Status Summary */}
      {preview.isActive && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Override Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  preview.forceTask ? "bg-primary" : "bg-muted"
                )} />
                <span className="text-muted-foreground">Task:</span>
                <span className="font-medium">
                  {preview.forceTask ? "Forced" : "Random"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  preview.selectedAnimationId ? "bg-primary" : "bg-muted"
                )} />
                <span className="text-muted-foreground">Animation:</span>
                <span className="font-medium">
                  {preview.selectedAnimationId ? "Custom" : "Default"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

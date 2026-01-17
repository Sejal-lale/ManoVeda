import { useState } from "react";
import { ListTodo, Flame, ChevronDown, ChevronRight, Plus, GripVertical, Trash2, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, AdminTask, TaskDifficulty, TaskCategory } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const difficultyColors: Record<TaskDifficulty, string> = {
  very_easy: "bg-accent/60 text-accent-foreground",
  easy: "bg-secondary text-secondary-foreground",
  medium: "bg-primary/20 text-primary",
};

const categoryIcons: Record<TaskCategory, string> = {
  breathing: "🌬️",
  reading: "📖",
  writing: "✍️",
  movement: "🚶",
};

interface StreakSettings {
  enabled: boolean;
  requiredActionsPerDay: number;
  recoveryEnabled: boolean;
  recoveryTokensPerWeek: number;
}

export const CoreEnginesSection = () => {
  const { tasks, addTask, updateTask, deleteTask } = useAdmin();
  const [taskEngineOpen, setTaskEngineOpen] = useState(true);
  const [streakEngineOpen, setStreakEngineOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    text: "",
    difficulty: "easy" as TaskDifficulty,
    category: "reading" as TaskCategory,
    followupText: "",
  });

  // Load streak settings from localStorage
  const [streakSettings, setStreakSettings] = useState<StreakSettings>(() => {
    const saved = localStorage.getItem('manoveda-streak-settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      requiredActionsPerDay: 1,
      recoveryEnabled: true,
      recoveryTokensPerWeek: 1,
    };
  });

  const updateStreakSettings = (updates: Partial<StreakSettings>) => {
    const updated = { ...streakSettings, ...updates };
    setStreakSettings(updated);
    localStorage.setItem('manoveda-streak-settings', JSON.stringify(updated));
  };

  const handleAddTask = () => {
    if (!newTask.text.trim()) return;
    addTask({ ...newTask, enabled: true });
    setNewTask({ text: "", difficulty: "easy", category: "reading", followupText: "" });
    setIsAdding(false);
  };

  const enabledCount = tasks.filter(t => t.enabled).length;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Core Engines</h2>
        <p className="text-sm text-muted-foreground">
          Configure the fundamental systems that power the app.
        </p>
      </div>

      {/* Task Engine */}
      <Collapsible open={taskEngineOpen} onOpenChange={setTaskEngineOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <ListTodo className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Task Engine</CardTitle>
                    <CardDescription className="text-xs">
                      {enabledCount} of {tasks.length} tasks active
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                  {taskEngineOpen ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {/* Add new task form */}
              {isAdding && (
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                  <p className="text-sm font-medium">New Task</p>
                  <Input
                    placeholder="Task text..."
                    value={newTask.text}
                    onChange={(e) => setNewTask(prev => ({ ...prev, text: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={newTask.difficulty}
                      onValueChange={(v) => setNewTask(prev => ({ ...prev, difficulty: v as TaskDifficulty }))}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very_easy">Very Easy</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTask.category}
                      onValueChange={(v) => setNewTask(prev => ({ ...prev, category: v as TaskCategory }))}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breathing">🌬️ Breathing</SelectItem>
                        <SelectItem value="reading">📖 Reading</SelectItem>
                        <SelectItem value="writing">✍️ Writing</SelectItem>
                        <SelectItem value="movement">🚶 Movement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTask} size="sm" className="flex-1">
                      <Check className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Task list */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {tasks.sort((a, b) => a.order - b.order).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-opacity",
                      !task.enabled && "opacity-50 bg-muted/30"
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={task.text}
                            onChange={(e) => updateTask(task.id, { text: e.target.value })}
                            className="text-sm h-8"
                          />
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-foreground truncate">{task.text}</p>
                          <div className="flex gap-1.5 mt-1">
                            <span className={cn("px-1.5 py-0.5 rounded text-xs", difficultyColors[task.difficulty])}>
                              {task.difficulty.replace('_', ' ')}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                              {categoryIcons[task.category]}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Switch
                        checked={task.enabled}
                        onCheckedChange={(v) => updateTask(task.id, { enabled: v })}
                      />
                      <button
                        onClick={() => setEditingId(task.id)}
                        className="p-1.5 rounded hover:bg-accent text-muted-foreground"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Streak Engine */}
      <Collapsible open={streakEngineOpen} onOpenChange={setStreakEngineOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    streakSettings.enabled ? "bg-accent text-accent-foreground" : "bg-secondary"
                  )}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Streak Engine</CardTitle>
                    <CardDescription className="text-xs">
                      {streakSettings.enabled ? "Active" : "Disabled"} • {streakSettings.requiredActionsPerDay} action/day
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={streakSettings.enabled}
                    onCheckedChange={(v) => updateStreakSettings({ enabled: v })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {streakEngineOpen ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Required Actions */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Required actions per day</span>
                  <span className="font-medium">{streakSettings.requiredActionsPerDay}</span>
                </div>
                <Slider
                  value={[streakSettings.requiredActionsPerDay]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={([v]) => updateStreakSettings({ requiredActionsPerDay: v })}
                  disabled={!streakSettings.enabled}
                />
              </div>

              {/* Recovery System */}
              <div className="p-3 rounded-lg bg-accent/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Recovery Tokens</p>
                    <p className="text-xs text-muted-foreground">Allow users to recover broken streaks</p>
                  </div>
                  <Switch
                    checked={streakSettings.recoveryEnabled}
                    onCheckedChange={(v) => updateStreakSettings({ recoveryEnabled: v })}
                    disabled={!streakSettings.enabled}
                  />
                </div>
                
                {streakSettings.recoveryEnabled && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tokens earned per week</span>
                      <span className="font-medium">{streakSettings.recoveryTokensPerWeek}</span>
                    </div>
                    <Slider
                      value={[streakSettings.recoveryTokensPerWeek]}
                      min={1}
                      max={3}
                      step={1}
                      onValueChange={([v]) => updateStreakSettings({ recoveryTokensPerWeek: v })}
                      disabled={!streakSettings.enabled}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

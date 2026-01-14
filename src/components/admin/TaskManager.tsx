import { useState } from "react";
import { Plus, GripVertical, Trash2, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, AdminTask, TaskDifficulty, TaskCategory } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const difficultyColors: Record<TaskDifficulty, string> = {
  very_easy: "bg-green-100 text-green-700",
  easy: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
};

const categoryIcons: Record<TaskCategory, string> = {
  breathing: "🌬️",
  reading: "📖",
  writing: "✍️",
  movement: "🚶",
};

export const TaskManager = () => {
  const { tasks, addTask, updateTask, deleteTask } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    text: "",
    difficulty: "easy" as TaskDifficulty,
    category: "reading" as TaskCategory,
    followupText: "",
  });

  const handleAddTask = () => {
    if (!newTask.text.trim()) return;
    addTask({ ...newTask, enabled: true });
    setNewTask({ text: "", difficulty: "easy", category: "reading", followupText: "" });
    setIsAdding(false);
  };

  const handleUpdateTask = (id: string, updates: Partial<AdminTask>) => {
    updateTask(id, updates);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-foreground">Tasks</h2>
          <p className="text-sm text-muted-foreground">Manage "I'm Stuck" tasks</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Add new task form */}
      {isAdding && (
        <Card className="border-primary/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Task text..."
              value={newTask.text}
              onChange={(e) => setNewTask(prev => ({ ...prev, text: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={newTask.difficulty}
                onValueChange={(v) => setNewTask(prev => ({ ...prev, difficulty: v as TaskDifficulty }))}
              >
                <SelectTrigger>
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
                <SelectTrigger>
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
            <Input
              placeholder="Follow-up text (optional)..."
              value={newTask.followupText}
              onChange={(e) => setNewTask(prev => ({ ...prev, followupText: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTask} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.sort((a, b) => a.order - b.order).map((task) => (
          <Card key={task.id} className={cn("transition-opacity", !task.enabled && "opacity-50")}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 cursor-grab text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  {editingId === task.id ? (
                    <div className="space-y-2">
                      <Input
                        value={task.text}
                        onChange={(e) => updateTask(task.id, { text: e.target.value })}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setEditingId(null)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-foreground">{task.text}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs", difficultyColors[task.difficulty])}>
                          {task.difficulty.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          {categoryIcons[task.category]} {task.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={task.enabled}
                    onCheckedChange={(v) => handleUpdateTask(task.id, { enabled: v })}
                  />
                  <button
                    onClick={() => setEditingId(task.id)}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

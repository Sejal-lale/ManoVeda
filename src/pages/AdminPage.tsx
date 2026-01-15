import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListTodo, Sparkles, Palette, Type, Gamepad2, Eye, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskManager } from "@/components/admin/TaskManager";
import { AnimationController } from "@/components/admin/AnimationController";
import { ThemeManager } from "@/components/admin/ThemeManager";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { GameRulesEditor } from "@/components/admin/GameRulesEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type AdminSection = 'tasks' | 'animations' | 'themes' | 'content' | 'rules' | 'preview';

const sections = [
  { id: 'preview' as AdminSection, label: 'Preview Control', icon: Eye },
  { id: 'tasks' as AdminSection, label: "I'm Stuck Tasks", icon: ListTodo },
  { id: 'animations' as AdminSection, label: 'Animations', icon: Sparkles },
  { id: 'themes' as AdminSection, label: 'Themes', icon: Palette },
  { id: 'content' as AdminSection, label: 'Copy & Language', icon: Type },
  { id: 'rules' as AdminSection, label: 'Game Feel', icon: Gamepad2 },
];

const PreviewControlPanel = () => {
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
      <div>
        <h2 className="text-lg font-medium text-foreground">Preview Control</h2>
        <p className="text-sm text-muted-foreground">Test exactly what users will experience</p>
      </div>

      {/* Preview Status */}
      <Card className={cn(preview.isActive && "border-primary bg-primary/5")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className={cn("w-4 h-4", preview.isActive && "text-primary animate-pulse")} />
                Preview Mode
              </CardTitle>
              <CardDescription>
                {preview.isActive ? "Active - changes affect live app" : "Inactive"}
              </CardDescription>
            </div>
            <Switch
              checked={preview.isActive}
              onCheckedChange={setPreviewActive}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleStartPreview} 
            className="w-full gap-2"
            variant={preview.isActive ? "default" : "outline"}
          >
            <Play className="w-4 h-4" />
            {preview.isActive ? "View Live Preview" : "Start Preview Mode"}
          </Button>
        </CardContent>
      </Card>

      {/* Task Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Force Task</CardTitle>
          <CardDescription>Select a specific task to show when "I'm Stuck" is tapped</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Force Selected Task</label>
            <Switch
              checked={preview.forceTask}
              onCheckedChange={setForcePreviewTask}
            />
          </div>
          
          <Select
            value={preview.selectedTaskId || ""}
            onValueChange={(v) => setPreviewTask(v || null)}
            disabled={!preview.forceTask}
          >
            <SelectTrigger className={cn(!preview.forceTask && "opacity-50")}>
              <SelectValue placeholder="Select a task to force..." />
            </SelectTrigger>
            <SelectContent>
              {enabledTasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  <div className="flex flex-col items-start">
                    <span className="text-sm truncate max-w-[250px]">{task.text}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.difficulty.replace('_', ' ')} • {task.category}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {preview.forceTask && preview.selectedTaskId && (
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Selected task:</p>
              <p className="text-sm font-medium">
                {tasks.find(t => t.id === preview.selectedTaskId)?.text}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Animation Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preview Animation</CardTitle>
          <CardDescription>Override animation for I'm Stuck flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={preview.selectedAnimationId || ""}
            onValueChange={(v) => setPreviewAnimation(v || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Use default animation settings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Use default settings</SelectItem>
              {animations.map((anim) => (
                <SelectItem key={anim.id} value={anim.id}>
                  <div className="flex flex-col items-start">
                    <span>{anim.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {anim.style} • {anim.duration}ms • {anim.intensity}%
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Preview Summary */}
      {preview.isActive && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-primary">Preview Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", preview.forceTask ? "bg-primary" : "bg-muted")}>
                </span>
                <span>Task: {preview.forceTask ? "Forced" : "Random"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", preview.selectedAnimationId ? "bg-primary" : "bg-muted")}>
                </span>
                <span>Animation: {preview.selectedAnimationId ? "Custom" : "Default"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin, preview, setPreviewActive } = useAdmin();
  const [activeSection, setActiveSection] = useState<AdminSection>('preview');
  const [adminPassword, setAdminPassword] = useState('');

  // Simple admin login (in production, use proper auth)
  const handleLogin = () => {
    if (adminPassword === 'manoveda2024') {
      setIsAdmin(true);
      setAdminPassword('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-primary mx-auto" />
            <h1 className="text-2xl font-medium text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm">Enter password to continue</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="text-center"
            />
            <Button onClick={handleLogin} className="w-full">
              Enter Admin Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'preview':
        return <PreviewControlPanel />;
      case 'tasks':
        return <TaskManager />;
      case 'animations':
        return <AnimationController />;
      case 'themes':
        return <ThemeManager />;
      case 'content':
        return <ContentEditor />;
      case 'rules':
        return <GameRulesEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-medium text-foreground">Admin Panel</h1>
            {preview.isActive && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs animate-pulse">
                Preview ON
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={preview.isActive ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setPreviewActive(!preview.isActive);
                if (!preview.isActive) navigate('/');
              }}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {preview.isActive ? 'Exit Preview' : 'Preview'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdmin(false)}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-24">
        {/* Section tabs */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex overflow-x-auto px-4 py-2 gap-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap",
                  "text-sm font-medium transition-all duration-200",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section content */}
        <div className="p-4">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

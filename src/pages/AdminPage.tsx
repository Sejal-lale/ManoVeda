import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListTodo, Sparkles, Palette, Type, Gamepad2, Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskManager } from "@/components/admin/TaskManager";
import { AnimationController } from "@/components/admin/AnimationController";
import { ThemeManager } from "@/components/admin/ThemeManager";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { GameRulesEditor } from "@/components/admin/GameRulesEditor";

type AdminSection = 'tasks' | 'animations' | 'themes' | 'content' | 'rules';

const sections = [
  { id: 'tasks' as AdminSection, label: "I'm Stuck Tasks", icon: ListTodo },
  { id: 'animations' as AdminSection, label: 'Animations', icon: Sparkles },
  { id: 'themes' as AdminSection, label: 'Themes', icon: Palette },
  { id: 'content' as AdminSection, label: 'Copy & Language', icon: Type },
  { id: 'rules' as AdminSection, label: 'Game Feel', icon: Gamepad2 },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin } = useAdmin();
  const [activeSection, setActiveSection] = useState<AdminSection>('tasks');
  const [adminPassword, setAdminPassword] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {isPreviewMode ? 'Exit Preview' : 'Preview'}
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

      {/* Preview overlay */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <span className="text-sm font-medium">Preview Mode</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              Exit
            </Button>
          </div>
          <iframe
            src="/"
            className="w-full h-[calc(100vh-52px)]"
            title="App Preview"
          />
        </div>
      )}
    </div>
  );
};

export default AdminPage;

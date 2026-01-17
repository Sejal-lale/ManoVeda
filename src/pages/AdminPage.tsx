import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Radio, Cog, Palette, Shield, Lock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveControlSection } from "@/components/admin/sections/LiveControlSection";
import { CoreEnginesSection } from "@/components/admin/sections/CoreEnginesSection";
import { ExperienceLayerSection } from "@/components/admin/sections/ExperienceLayerSection";
import { AccessSafetySection } from "@/components/admin/sections/AccessSafetySection";

type AdminSection = 'live' | 'engines' | 'experience' | 'safety';

const sections = [
  { id: 'live' as AdminSection, label: 'Live Control', icon: Radio },
  { id: 'engines' as AdminSection, label: 'Core Engines', icon: Cog },
  { id: 'experience' as AdminSection, label: 'Experience', icon: Palette },
  { id: 'safety' as AdminSection, label: 'Safety', icon: Shield },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin, preview, setPreviewActive } = useAdmin();
  const [activeSection, setActiveSection] = useState<AdminSection>('live');
  const [adminPassword, setAdminPassword] = useState('');

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
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Mission Control</h1>
            <p className="text-muted-foreground text-sm">Enter password to access admin panel</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="text-center h-12"
            />
            <Button onClick={handleLogin} className="w-full h-11">
              Enter Mission Control
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'live':
        return <LiveControlSection />;
      case 'engines':
        return <CoreEnginesSection />;
      case 'experience':
        return <ExperienceLayerSection />;
      case 'safety':
        return <AccessSafetySection />;
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
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Mission Control</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {preview.isActive && (
              <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                Preview Active
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdmin(false)}
              className="text-muted-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-24">
        {/* Section tabs */}
        <div className="sticky top-16 z-30 bg-background border-b border-border">
          <div className="flex overflow-x-auto px-2 py-2 gap-1 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap",
                  "text-sm font-medium transition-all duration-200",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section content */}
        <div className="p-4 max-w-2xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

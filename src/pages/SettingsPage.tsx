import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, themes, ThemeId } from '@/contexts/ThemeContext';
import { useSettings, MotionLevel } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { currentTheme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (themeId: ThemeId) => {
    setTheme(themeId);
    toast.success('Theme applied', {
      duration: 1500,
      className: 'bg-card text-foreground border-border',
    });
  };

  const motionOptions: { value: MotionLevel; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'playful', label: 'Playful' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/"
            className={cn(
              "w-10 h-10 rounded-full",
              "bg-muted flex items-center justify-center",
              "transition-all duration-300",
              "hover:scale-105 hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-ring/30"
            )}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="px-4 pb-8 max-w-lg mx-auto">
        {/* Theme Selector */}
        <section className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            App Theme
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a mood for your experience
          </p>

          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={cn(
                  "relative p-4 rounded-2xl text-left transition-all duration-300",
                  "border-2",
                  currentTheme === theme.id
                    ? "border-primary scale-[1.02] shadow-lg"
                    : "border-transparent hover:scale-[1.01]"
                )}
                style={{
                  backgroundColor: theme.palette.background,
                }}
              >
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className="w-8 h-8 rounded-full mb-3"
                  style={{ backgroundColor: theme.palette.accent }}
                />
                <p
                  className="font-medium"
                  style={{ color: theme.palette.text }}
                >
                  {theme.name}
                </p>
                <p
                  className="text-xs mt-0.5 capitalize opacity-70"
                  style={{ color: theme.palette.text }}
                >
                  {theme.emotion.replace('_', ' ')}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Experience Controls */}
        <section className="mt-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Experience
          </h2>

          {/* Motion Level */}
          <div className={cn(
            "p-4 rounded-2xl bg-card mb-3",
            "shadow-[var(--shadow-soft)]"
          )}>
            <p className="text-foreground font-medium mb-3">Motion Level</p>
            <div className="flex gap-2">
              {motionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ motionLevel: option.value })}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200",
                    settings.motionLevel === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Feedback */}
          <div className={cn(
            "p-4 rounded-2xl bg-card mb-3",
            "shadow-[var(--shadow-soft)]",
            "flex items-center justify-between"
          )}>
            <div>
              <p className="text-foreground font-medium">Game Sounds</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Soft audio feedback
              </p>
            </div>
            <Switch
              checked={settings.soundFeedback}
              onCheckedChange={(checked) => updateSettings({ soundFeedback: checked })}
            />
          </div>

          {/* Haptic Feedback */}
          <div className={cn(
            "p-4 rounded-2xl bg-card",
            "shadow-[var(--shadow-soft)]",
            "flex items-center justify-between"
          )}>
            <div>
              <p className="text-foreground font-medium">Haptic Feedback</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gentle vibrations
              </p>
            </div>
            <Switch
              checked={settings.hapticFeedback}
              onCheckedChange={(checked) => updateSettings({ hapticFeedback: checked })}
            />
          </div>
        </section>

        {/* Safety Controls */}
        <section className="mt-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Comfort & Safety
          </h2>

          <div className={cn(
            "p-4 rounded-2xl bg-card",
            "shadow-[var(--shadow-soft)]",
            "flex items-center justify-between"
          )}>
            <div className="flex-1 pr-4">
              <p className="text-foreground font-medium">Reduce Visual Intensity</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                For overwhelmed moments
              </p>
            </div>
            <Switch
              checked={settings.reduceStimulation}
              onCheckedChange={(checked) => updateSettings({ reduceStimulation: checked })}
            />
          </div>
        </section>

        {/* About */}
        <section className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Manoveda • Made with care
          </p>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;

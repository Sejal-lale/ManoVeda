import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';

const ProfilePage = () => {
  const { profile, updateProfile, stats } = useSettings();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameSubmit = () => {
    updateProfile({ name: nameValue });
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateProfile({ avatarUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Affirmation based on usage
  const getAffirmation = () => {
    if (stats.stuckPresses > 0 && stats.breathingMinutes > 0) {
      return "You showed up for yourself";
    }
    if (stats.stuckPresses > 0) {
      return "You paused when you needed to";
    }
    if (stats.breathingMinutes > 0) {
      return "You gave yourself space to breathe";
    }
    return "This space adapts to you";
  };

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
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="px-4 pb-8 max-w-lg mx-auto">
        {/* User Identity Section */}
        <section className="mt-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <button
            onClick={handleAvatarClick}
            className={cn(
              "relative w-24 h-24 rounded-full",
              "bg-muted flex items-center justify-center",
              "transition-all duration-300",
              "hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20",
              "overflow-hidden"
            )}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/10 flex items-center justify-center transition-colors">
              <Camera className="w-6 h-6 text-foreground opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Name */}
          <div className="mt-4 w-full max-w-xs">
            {isEditingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNameSubmit();
                }}
                className="flex flex-col gap-2"
              >
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="Your name"
                  className="text-center text-lg bg-muted border-border"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-sm text-primary hover:underline"
                >
                  Save
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className={cn(
                  "w-full py-2 text-xl font-medium text-foreground",
                  "hover:text-primary transition-colors"
                )}
              >
                {profile.name || 'Tap to add your name'}
              </button>
            )}
          </div>

          {/* Subtitle */}
          <p className="mt-2 text-muted-foreground text-sm">
            {getAffirmation()}
          </p>
        </section>

        {/* Usage Insights */}
        <section className="mt-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Your Journey
          </h2>

          <div className="space-y-4">
            {/* Stuck Presses */}
            <div className={cn(
              "p-5 rounded-2xl bg-card",
              "shadow-[var(--shadow-soft)]"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Times you pressed I'm Stuck</span>
                <span className={cn(
                  "text-2xl font-semibold text-primary",
                  "min-w-[3rem] text-right"
                )}>
                  {stats.stuckPresses}
                </span>
              </div>
              {stats.stuckPresses > 0 && (
                <p className="mt-2 text-sm text-[hsl(var(--affirmation))]">
                  Each press is a moment you chose to pause
                </p>
              )}
            </div>

            {/* Breathing Minutes */}
            <div className={cn(
              "p-5 rounded-2xl bg-card",
              "shadow-[var(--shadow-soft)]"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Minutes spent breathing</span>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${Math.min(stats.breathingMinutes, 60) / 60 * 88} 88`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary">
                    {stats.breathingMinutes}
                  </span>
                </div>
              </div>
              {stats.breathingMinutes > 0 && (
                <p className="mt-2 text-sm text-[hsl(var(--affirmation))]">
                  You gave yourself space to breathe
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Progress Language - No Streaks */}
        {(stats.stuckPresses > 0 || stats.breathingMinutes > 0) && (
          <section className="mt-10">
            <div className={cn(
              "p-6 rounded-2xl text-center",
              "bg-primary/10"
            )}>
              <p className="text-lg font-medium text-foreground">
                {stats.stuckPresses >= 5 && stats.breathingMinutes >= 5
                  ? "You've built a gentle practice"
                  : stats.stuckPresses >= 3
                    ? "You're learning to pause"
                    : "Every moment counts"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                No streaks, no pressure—just you, showing up
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;

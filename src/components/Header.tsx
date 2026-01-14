import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";

export const Header = () => {
  const { profile } = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Profile */}
        <Link
          to="/profile"
          className={cn(
            "w-10 h-10 rounded-full",
            "bg-muted flex items-center justify-center",
            "transition-all duration-300",
            "hover:scale-105 hover:bg-accent",
            "focus:outline-none focus:ring-2 focus:ring-ring/30",
            "overflow-hidden"
          )}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </Link>

        {/* Empty center - intentional calm space */}
        <div className="flex-1" />

        {/* Settings */}
        <Link
          to="/settings"
          className={cn(
            "w-10 h-10 rounded-full",
            "bg-muted flex items-center justify-center",
            "transition-all duration-300",
            "hover:scale-105 hover:bg-accent",
            "focus:outline-none focus:ring-2 focus:ring-ring/30"
          )}
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
};

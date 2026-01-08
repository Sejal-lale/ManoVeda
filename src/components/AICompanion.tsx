import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICompanionProps {
  onClick: () => void;
}

export const AICompanion = ({ onClick }: AICompanionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2",
        "p-4 rounded-2xl",
        "bg-[hsl(var(--chat-bg))] backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:bg-accent",
        "focus:outline-none focus:ring-2 focus:ring-ring/30",
        "shadow-[var(--shadow-soft)]"
      )}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground font-medium">Talk</span>
    </button>
  );
};

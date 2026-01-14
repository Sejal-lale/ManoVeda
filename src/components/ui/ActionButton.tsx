import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const ActionButton = ({ icon: Icon, label, onClick, className }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2",
        "h-auto py-4 px-8",
        "rounded-2xl",
        "bg-card/80 backdrop-blur-sm",
        "shadow-[var(--shadow-soft)]",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:bg-accent",
        "active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-ring/30",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <span className="text-base font-medium text-foreground">{label}</span>
    </button>
  );
};

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
        // Slightly smaller than main button
        "py-3 px-6",
        "rounded-xl",
        // Clean card surface
        "bg-card",
        // Professional shadow
        "shadow-sm",
        // Crisp transitions
        "transition-all duration-150 ease-out",
        "hover:shadow-md hover:-translate-y-0.5",
        "active:scale-[0.98] active:shadow-xs active:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {/* Smaller icon container, neutral background */}
      <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
      </div>
      {/* Label with letter spacing */}
      <span className="text-sm font-medium text-foreground tracking-wide uppercase">
        {label}
      </span>
    </button>
  );
};

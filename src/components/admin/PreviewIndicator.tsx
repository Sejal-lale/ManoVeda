import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

export const PreviewIndicator = () => {
  const { preview, setPreviewActive } = useAdmin();

  if (!preview.isActive) return null;

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "animate-fade-in"
      )}
    >
      <Eye className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-medium">Preview Mode ON</span>
      <button
        onClick={() => setPreviewActive(false)}
        className="ml-2 px-2 py-0.5 rounded-full bg-background/20 hover:bg-background/30 text-xs transition-colors"
      >
        Exit
      </button>
    </div>
  );
};

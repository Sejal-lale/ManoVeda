import { Eye, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AdminOverrideBanner = () => {
  const { preview, isAdmin, setPreviewActive } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on admin page
  if (location.pathname === '/admin') return null;
  
  // Only show when admin is logged in and preview is active
  if (!isAdmin || !preview.isActive) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100]",
        "flex items-center justify-between px-4 py-2",
        "bg-primary text-primary-foreground",
        "shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        <Eye className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-semibold tracking-wide uppercase">
          Admin Override Active
        </span>
        {preview.forceTask && (
          <span className="px-2 py-0.5 rounded bg-background/20 text-xs">
            Forced Task
          </span>
        )}
        {preview.selectedAnimationId && (
          <span className="px-2 py-0.5 rounded bg-background/20 text-xs">
            Custom Animation
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/20 hover:bg-background/30 text-xs font-medium transition-colors"
        >
          <Settings className="w-3 h-3" />
          Admin Panel
        </button>
        <button
          onClick={() => setPreviewActive(false)}
          className="px-3 py-1 rounded-md bg-background/20 hover:bg-background/30 text-xs font-medium transition-colors"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );
};

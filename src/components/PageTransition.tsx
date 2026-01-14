import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAdmin, TransitionStyle } from "@/contexts/AdminContext";

interface PageTransitionProps {
  isActive: boolean;
  transitionId: string;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export const PageTransition = ({ isActive, transitionId, onComplete, children }: PageTransitionProps) => {
  const { getActiveTransition } = useAdmin();
  const [phase, setPhase] = useState<'idle' | 'entering' | 'active' | 'exiting'>('idle');
  
  const config = getActiveTransition(transitionId);
  const duration = config?.duration || 800;
  const intensity = config?.intensity || 50;
  const style = config?.style || 'breath_wave';

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('entering');
      setTimeout(() => {
        setPhase('active');
        setTimeout(() => {
          setPhase('exiting');
          setTimeout(() => {
            setPhase('idle');
            onComplete?.();
          }, duration * 0.3);
        }, duration * 0.4);
      }, duration * 0.3);
    }
  }, [isActive, duration, onComplete, phase]);

  if (!isActive && phase === 'idle') return null;

  const getTransitionClasses = (transitionStyle: TransitionStyle) => {
    const baseClasses = "fixed inset-0 z-50 pointer-events-none flex items-center justify-center";
    
    switch (transitionStyle) {
      case 'bubble_release':
        return cn(baseClasses, "overflow-hidden");
      case 'portal_zoom':
        return cn(baseClasses);
      case 'breath_wave':
        return cn(baseClasses);
      case 'suspense_hold':
        return cn(baseClasses);
      default:
        return baseClasses;
    }
  };

  const renderTransitionContent = () => {
    const opacityScale = intensity / 100;

    switch (style) {
      case 'bubble_release':
        return (
          <div className="relative w-full h-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute rounded-full bg-primary/20",
                  phase === 'entering' && "animate-bubble-float-in",
                  phase === 'exiting' && "animate-bubble-float-out"
                )}
                style={{
                  width: `${20 + i * 10}px`,
                  height: `${20 + i * 10}px`,
                  left: `${10 + i * 12}%`,
                  bottom: phase === 'entering' ? '-50px' : '50%',
                  opacity: opacityScale * (0.3 + i * 0.1),
                  animationDuration: `${duration}ms`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        );

      case 'portal_zoom':
        return (
          <div
            className={cn(
              "w-32 h-32 rounded-full bg-primary/30",
              phase === 'entering' && "animate-portal-expand",
              phase === 'active' && "scale-[20]",
              phase === 'exiting' && "animate-portal-contract"
            )}
            style={{
              opacity: opacityScale * 0.4,
              animationDuration: `${duration}ms`,
            }}
          />
        );

      case 'breath_wave':
        return (
          <div
            className={cn(
              "w-40 h-40 rounded-full",
              "bg-gradient-radial from-primary/40 via-primary/20 to-transparent",
              phase === 'entering' && "animate-breath-pulse-in",
              phase === 'exiting' && "animate-breath-pulse-out"
            )}
            style={{
              opacity: opacityScale * 0.6,
              animationDuration: `${duration}ms`,
            }}
          />
        );

      case 'suspense_hold':
        return (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              "bg-background/60",
              phase === 'entering' && "animate-fade-in",
              phase === 'exiting' && "animate-fade-out"
            )}
            style={{
              opacity: phase === 'active' ? opacityScale * 0.8 : 0,
              animationDuration: `${duration * 0.3}ms`,
            }}
          >
            <div 
              className="w-24 h-24 rounded-full bg-primary/40 animate-pulse-glow"
              style={{ animationDuration: `${duration * 0.5}ms` }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={getTransitionClasses(style)}>
      {renderTransitionContent()}
      {children}
    </div>
  );
};

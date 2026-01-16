import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Momentum levels with thresholds
export const MOMENTUM_LEVELS = [
  { level: 1, title: 'Frozen', minCompletions: 0 },
  { level: 2, title: 'Warming Up', minCompletions: 3 },
  { level: 3, title: 'Moving', minCompletions: 10 },
  { level: 4, title: 'Focused', minCompletions: 25 },
  { level: 5, title: 'In Control', minCompletions: 50 },
];

export interface UserProgress {
  id: string;
  session_id: string;
  streak_count: number;
  longest_streak: number;
  current_level: number;
  total_completions: number;
  last_completion_date: string | null;
  recovery_tokens: number;
  last_recovery_used: string | null;
}

interface UseProgressReturn {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  completeTask: (taskId: string, taskText: string) => Promise<void>;
  useRecoveryToken: () => Promise<boolean>;
  getCurrentLevel: () => typeof MOMENTUM_LEVELS[0];
  getLevelProgress: () => number;
  isStreakAtRisk: () => boolean;
  canRecover: () => boolean;
}

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('manoveda-session-id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('manoveda-session-id', sessionId);
  }
  return sessionId;
};

// Check if date is today
const isToday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date was yesterday
const isYesterday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Get days since last completion
const getDaysSinceCompletion = (dateStr: string | null): number => {
  if (!dateStr) return Infinity;
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useProgress = (): UseProgressReturn => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = getSessionId();

  // Fetch or create progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        
        // Try to get existing progress
        const { data, error: fetchError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          // Check if streak should be broken
          const daysSince = getDaysSinceCompletion(data.last_completion_date);
          
          if (daysSince > 1 && data.streak_count > 0) {
            // Streak is broken - reset it
            const { data: updated, error: updateError } = await supabase
              .from('user_progress')
              .update({ streak_count: 0 })
              .eq('session_id', sessionId)
              .select()
              .single();
            
            if (updateError) throw updateError;
            setProgress(updated as UserProgress);
          } else {
            setProgress(data as UserProgress);
          }
        } else {
          // Create new progress record
          const { data: newProgress, error: insertError } = await supabase
            .from('user_progress')
            .insert([{ session_id: sessionId }])
            .select()
            .single();
          
          if (insertError) throw insertError;
          setProgress(newProgress as UserProgress);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [sessionId]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string, taskText: string) => {
    if (!progress) return;

    try {
      const completedToday = isToday(progress.last_completion_date);
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate new streak
      let newStreak = progress.streak_count;
      if (!completedToday) {
        const yesterday = isYesterday(progress.last_completion_date);
        if (yesterday || progress.streak_count === 0) {
          newStreak = progress.streak_count + 1;
        } else {
          // Missed more than a day, streak resets but this completion starts new streak
          newStreak = 1;
        }
      }
      
      // Calculate new level based on total completions
      const newTotalCompletions = progress.total_completions + 1;
      let newLevel = 1;
      for (const level of MOMENTUM_LEVELS) {
        if (newTotalCompletions >= level.minCompletions) {
          newLevel = level.level;
        }
      }
      
      const newLongestStreak = Math.max(progress.longest_streak, newStreak);
      
      // Update progress in database
      const { data: updated, error: updateError } = await supabase
        .from('user_progress')
        .update({
          streak_count: newStreak,
          longest_streak: newLongestStreak,
          current_level: newLevel,
          total_completions: newTotalCompletions,
          last_completion_date: today,
        })
        .eq('session_id', sessionId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Record task completion
      await supabase
        .from('task_completions')
        .insert([{
          session_id: sessionId,
          task_id: taskId,
          task_text: taskText,
          streak_at_completion: newStreak,
          level_at_completion: newLevel,
        }]);
      
      setProgress(updated as UserProgress);
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to save progress');
    }
  }, [progress, sessionId]);

  // Use recovery token to restore streak
  const useRecoveryToken = useCallback(async (): Promise<boolean> => {
    if (!progress || progress.recovery_tokens <= 0) return false;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastRecovery = progress.last_recovery_used 
        ? new Date(progress.last_recovery_used) 
        : null;
      
      // Check if recovery was used this week
      if (lastRecovery) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (lastRecovery > weekAgo) {
          return false; // Already used recovery this week
        }
      }
      
      // Restore streak (set to 1 if was 0)
      const restoredStreak = Math.max(1, progress.streak_count);
      
      const { data: updated, error: updateError } = await supabase
        .from('user_progress')
        .update({
          streak_count: restoredStreak,
          recovery_tokens: progress.recovery_tokens - 1,
          last_recovery_used: new Date().toISOString(),
          last_completion_date: today,
        })
        .eq('session_id', sessionId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      setProgress(updated as UserProgress);
      return true;
    } catch (err) {
      console.error('Error using recovery token:', err);
      return false;
    }
  }, [progress, sessionId]);

  // Get current momentum level
  const getCurrentLevel = useCallback(() => {
    if (!progress) return MOMENTUM_LEVELS[0];
    return MOMENTUM_LEVELS.find(l => l.level === progress.current_level) || MOMENTUM_LEVELS[0];
  }, [progress]);

  // Get progress to next level (0-100)
  const getLevelProgress = useCallback((): number => {
    if (!progress) return 0;
    
    const currentLevel = MOMENTUM_LEVELS.find(l => l.level === progress.current_level);
    const nextLevel = MOMENTUM_LEVELS.find(l => l.level === progress.current_level + 1);
    
    if (!nextLevel) return 100; // Max level reached
    if (!currentLevel) return 0;
    
    const currentMin = currentLevel.minCompletions;
    const nextMin = nextLevel.minCompletions;
    const progressInLevel = progress.total_completions - currentMin;
    const levelRange = nextMin - currentMin;
    
    return Math.min(100, Math.floor((progressInLevel / levelRange) * 100));
  }, [progress]);

  // Check if streak is at risk (no completion today)
  const isStreakAtRisk = useCallback((): boolean => {
    if (!progress || progress.streak_count === 0) return false;
    return !isToday(progress.last_completion_date);
  }, [progress]);

  // Check if user can use recovery
  const canRecover = useCallback((): boolean => {
    if (!progress || progress.recovery_tokens <= 0) return false;
    
    const lastRecovery = progress.last_recovery_used 
      ? new Date(progress.last_recovery_used) 
      : null;
    
    if (lastRecovery) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (lastRecovery > weekAgo) {
        return false;
      }
    }
    
    return true;
  }, [progress]);

  return {
    progress,
    loading,
    error,
    completeTask,
    useRecoveryToken,
    getCurrentLevel,
    getLevelProgress,
    isStreakAtRisk,
    canRecover,
  };
};

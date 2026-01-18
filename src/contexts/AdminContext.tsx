import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Task types
export type TaskDifficulty = 'very_easy' | 'easy' | 'medium';
export type TaskCategory = 'breathing' | 'reading' | 'writing' | 'movement';

export interface AdminTask {
  id: string;
  text: string;
  difficulty: TaskDifficulty;
  category: TaskCategory;
  followupText?: string;
  enabled: boolean;
  order: number;
}

// Animation types
export type TransitionStyle = 'bubble_release' | 'portal_zoom' | 'breath_wave' | 'suspense_hold';

export interface AnimationConfig {
  id: string;
  name: string;
  style: TransitionStyle;
  duration: number;
  intensity: number;
  enabled: boolean;
}

export const transitionStyles: { id: TransitionStyle; name: string; feel: string }[] = [
  { id: 'bubble_release', name: 'Bubble Release', feel: 'soft_playful' },
  { id: 'portal_zoom', name: 'Portal Zoom', feel: 'game_level_start' },
  { id: 'breath_wave', name: 'Breath Wave', feel: 'calming' },
  { id: 'suspense_hold', name: 'Suspense Hold', feel: 'anticipation' },
];

// Theme types for admin
export interface AdminTheme {
  id: string;
  name: string;
  emotion: string;
  background: string;
  accent: string;
  text: string;
  glowIntensity: number;
  isDefault: boolean;
  isBuiltIn: boolean;
}

// Content/Copy types
export interface ContentConfig {
  buttonText: {
    stuckButton: string;
    stuckSubtext: string;
    shufflingText: string;
  };
  affirmations: string[];
  microcopy: {
    timerComplete: string;
    moodSelected: string;
    chatGreeting: string;
  };
  showValidationMessages: boolean;
}

// Game feel rules - Momentum-based system (private, cumulative, never subtractive)
export interface GameFeelRules {
  // ALLOWED (unlocked)
  allowStreaks: boolean;
  allowLevels: boolean;
  allowBadges: boolean;
  allowVisualProgression: boolean;
  // SYSTEM-GUARDED (locked by design)
  allowLeaderboards: boolean;
  allowSocialComparison: boolean;
  allowLossPenalties: boolean;
  allowPublicScores: boolean;
  // Reward types
  rewardTypes: ('visual' | 'sensory' | 'animation')[];
}

// Preview state
export interface PreviewState {
  isActive: boolean;
  selectedTaskId: string | null;
  selectedAnimationId: string | null;
  forceTask: boolean; // When true, selected task is forced (no random)
}

// Default values
const DEFAULT_TASKS: AdminTask[] = [
  { id: '1', text: 'Open your notes and rewrite one line.', difficulty: 'very_easy', category: 'writing', enabled: true, order: 1 },
  { id: '2', text: 'Read one paragraph while standing.', difficulty: 'very_easy', category: 'reading', enabled: true, order: 2 },
  { id: '3', text: 'Highlight only the headings in your notes.', difficulty: 'very_easy', category: 'reading', enabled: true, order: 3 },
  { id: '4', text: 'Explain one concept out loud to your phone.', difficulty: 'easy', category: 'reading', enabled: true, order: 4 },
  { id: '5', text: 'Walk around the room while recalling one topic.', difficulty: 'easy', category: 'movement', enabled: true, order: 5 },
  { id: '6', text: 'Do 3 stretches, then recall one fact.', difficulty: 'easy', category: 'movement', enabled: true, order: 6 },
  { id: '7', text: 'Take 5 deep breaths, then read one sentence.', difficulty: 'very_easy', category: 'breathing', enabled: true, order: 7 },
  { id: '8', text: 'Write the worst possible answer to a question.', difficulty: 'medium', category: 'writing', enabled: true, order: 8 },
];

const DEFAULT_ANIMATIONS: AnimationConfig[] = [
  { id: 'stuck_entry', name: "I'm Stuck Entry", style: 'breath_wave', duration: 800, intensity: 50, enabled: true },
  { id: 'timer_transition', name: 'Home to Timer', style: 'portal_zoom', duration: 600, intensity: 40, enabled: true },
  { id: 'task_reveal', name: 'Task Reveal', style: 'bubble_release', duration: 1000, intensity: 60, enabled: true },
  { id: 'completion', name: 'Completion', style: 'suspense_hold', duration: 1200, intensity: 70, enabled: true },
];

const DEFAULT_THEMES: AdminTheme[] = [
  { id: 'soft_pink', name: 'Gentle', emotion: 'safe', background: '#F6EAEA', accent: '#E7B7B7', text: '#5A2E2E', glowIntensity: 40, isDefault: true, isBuiltIn: true },
  { id: 'calm_blue', name: 'Calm', emotion: 'soothing', background: '#EEF5F9', accent: '#4A90E2', text: '#2F4F6F', glowIntensity: 35, isDefault: false, isBuiltIn: true },
  { id: 'fire_energy', name: 'Fire', emotion: 'activation', background: '#FFF2E5', accent: '#FF7A45', text: '#7A2E00', glowIntensity: 60, isDefault: false, isBuiltIn: true },
  { id: 'night_focus', name: 'Night', emotion: 'low_stimulation', background: '#1E1E2E', accent: '#6C7CFF', text: '#EAEAFF', glowIntensity: 50, isDefault: false, isBuiltIn: true },
];

const DEFAULT_CONTENT: ContentConfig = {
  buttonText: {
    stuckButton: "I'm Stuck",
    stuckSubtext: "Tap once. I'll decide.",
    shufflingText: "Finding...",
  },
  affirmations: [
    "You're allowed to feel this.",
    "You showed up for yourself.",
    "You paused when you needed to.",
    "One small step is still a step.",
  ],
  microcopy: {
    timerComplete: "You did it. Take a moment.",
    moodSelected: "Thanks for checking in.",
    chatGreeting: "Hey. I'm here with you.",
  },
  showValidationMessages: true,
};

const DEFAULT_GAME_RULES: GameFeelRules = {
  // ALLOWED - private progression
  allowStreaks: true,
  allowLevels: true,
  allowBadges: true,
  allowVisualProgression: true,
  // SYSTEM-GUARDED - harmful by design
  allowLeaderboards: false,
  allowSocialComparison: false,
  allowLossPenalties: false,
  allowPublicScores: false,
  // Reward types
  rewardTypes: ['visual', 'sensory', 'animation'],
};

const DEFAULT_PREVIEW: PreviewState = {
  isActive: false,
  selectedTaskId: null,
  selectedAnimationId: null,
  forceTask: false,
};

interface AdminContextType {
  // Admin access
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  
  // Preview Mode
  preview: PreviewState;
  setPreviewActive: (active: boolean) => void;
  setPreviewTask: (taskId: string | null) => void;
  setPreviewAnimation: (animationId: string | null) => void;
  setForcePreviewTask: (force: boolean) => void;
  getPreviewTask: () => AdminTask | null;
  
  // Tasks
  tasks: AdminTask[];
  addTask: (task: Omit<AdminTask, 'id' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<AdminTask>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  getEnabledTasks: () => AdminTask[];
  getRandomTask: () => AdminTask | null;
  
  // Animations
  animations: AnimationConfig[];
  updateAnimation: (id: string, updates: Partial<AnimationConfig>) => void;
  getActiveTransition: (id: string) => AnimationConfig | undefined;
  
  // Themes
  adminThemes: AdminTheme[];
  addTheme: (theme: Omit<AdminTheme, 'id' | 'isBuiltIn'>) => void;
  updateTheme: (id: string, updates: Partial<AdminTheme>) => void;
  deleteTheme: (id: string) => void;
  setDefaultTheme: (id: string) => void;
  
  // Content
  content: ContentConfig;
  updateContent: (updates: Partial<ContentConfig>) => void;
  updateButtonText: (updates: Partial<ContentConfig['buttonText']>) => void;
  updateMicrocopy: (updates: Partial<ContentConfig['microcopy']>) => void;
  addAffirmation: (text: string) => void;
  removeAffirmation: (index: number) => void;
  
  // Game rules
  gameRules: GameFeelRules;
  updateGameRules: (updates: Partial<GameFeelRules>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('manoveda-admin') === 'true';
  });

  const [preview, setPreview] = useState<PreviewState>(() => {
    const saved = localStorage.getItem('manoveda-admin-preview');
    return saved ? JSON.parse(saved) : DEFAULT_PREVIEW;
  });

  const [tasks, setTasks] = useState<AdminTask[]>(() => {
    const saved = localStorage.getItem('manoveda-admin-tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [animations, setAnimations] = useState<AnimationConfig[]>(() => {
    const saved = localStorage.getItem('manoveda-admin-animations');
    return saved ? JSON.parse(saved) : DEFAULT_ANIMATIONS;
  });

  const [adminThemes, setAdminThemes] = useState<AdminTheme[]>(() => {
    const saved = localStorage.getItem('manoveda-admin-themes');
    return saved ? JSON.parse(saved) : DEFAULT_THEMES;
  });

  const [content, setContent] = useState<ContentConfig>(() => {
    const saved = localStorage.getItem('manoveda-admin-content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const [gameRules, setGameRules] = useState<GameFeelRules>(() => {
    const saved = localStorage.getItem('manoveda-admin-gamerules');
    return saved ? JSON.parse(saved) : DEFAULT_GAME_RULES;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('manoveda-admin', isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-preview', JSON.stringify(preview));
  }, [preview]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-animations', JSON.stringify(animations));
  }, [animations]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-themes', JSON.stringify(adminThemes));
  }, [adminThemes]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('manoveda-admin-gamerules', JSON.stringify(gameRules));
  }, [gameRules]);

  // Preview functions
  const setPreviewActive = (active: boolean) => {
    setPreview(prev => ({ ...prev, isActive: active }));
  };

  const setPreviewTask = (taskId: string | null) => {
    setPreview(prev => ({ ...prev, selectedTaskId: taskId }));
  };

  const setPreviewAnimation = (animationId: string | null) => {
    setPreview(prev => ({ ...prev, selectedAnimationId: animationId }));
  };

  const setForcePreviewTask = (force: boolean) => {
    setPreview(prev => ({ ...prev, forceTask: force }));
  };

  const getPreviewTask = (): AdminTask | null => {
    if (!preview.selectedTaskId) return null;
    return tasks.find(t => t.id === preview.selectedTaskId) || null;
  };

  // Task functions
  const addTask = (task: Omit<AdminTask, 'id' | 'order'>) => {
    const newTask: AdminTask = {
      ...task,
      id: Date.now().toString(),
      order: tasks.length + 1,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<AdminTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const reorderTasks = (taskIds: string[]) => {
    setTasks(prev => {
      const reordered = taskIds.map((id, index) => {
        const task = prev.find(t => t.id === id);
        return task ? { ...task, order: index + 1 } : null;
      }).filter(Boolean) as AdminTask[];
      return reordered;
    });
  };

  const getEnabledTasks = () => tasks.filter(t => t.enabled).sort((a, b) => a.order - b.order);

  const getRandomTask = (): AdminTask | null => {
    // If preview mode with forced task, return that task
    if (preview.isActive && preview.forceTask && preview.selectedTaskId) {
      return tasks.find(t => t.id === preview.selectedTaskId) || null;
    }
    
    const enabled = getEnabledTasks();
    if (enabled.length === 0) return null;
    return enabled[Math.floor(Math.random() * enabled.length)];
  };

  // Animation functions
  const updateAnimation = (id: string, updates: Partial<AnimationConfig>) => {
    setAnimations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const getActiveTransition = (id: string) => {
    // If preview mode with selected animation, use that for matching transitions
    if (preview.isActive && preview.selectedAnimationId) {
      const previewAnim = animations.find(a => a.id === preview.selectedAnimationId);
      if (previewAnim && (id === 'stuck_entry' || id === 'task_reveal')) {
        return previewAnim;
      }
    }
    return animations.find(a => a.id === id && a.enabled);
  };

  // Theme functions
  const addTheme = (theme: Omit<AdminTheme, 'id' | 'isBuiltIn'>) => {
    const newTheme: AdminTheme = {
      ...theme,
      id: `custom_${Date.now()}`,
      isBuiltIn: false,
    };
    setAdminThemes(prev => [...prev, newTheme]);
  };

  const updateTheme = (id: string, updates: Partial<AdminTheme>) => {
    setAdminThemes(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTheme = (id: string) => {
    setAdminThemes(prev => prev.filter(t => t.id !== id || t.isBuiltIn));
  };

  const setDefaultTheme = (id: string) => {
    setAdminThemes(prev => prev.map(t => ({ ...t, isDefault: t.id === id })));
  };

  // Content functions
  const updateContent = (updates: Partial<ContentConfig>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const updateButtonText = (updates: Partial<ContentConfig['buttonText']>) => {
    setContent(prev => ({
      ...prev,
      buttonText: { ...prev.buttonText, ...updates },
    }));
  };

  const updateMicrocopy = (updates: Partial<ContentConfig['microcopy']>) => {
    setContent(prev => ({
      ...prev,
      microcopy: { ...prev.microcopy, ...updates },
    }));
  };

  const addAffirmation = (text: string) => {
    setContent(prev => ({
      ...prev,
      affirmations: [...prev.affirmations, text],
    }));
  };

  const removeAffirmation = (index: number) => {
    setContent(prev => ({
      ...prev,
      affirmations: prev.affirmations.filter((_, i) => i !== index),
    }));
  };

  // Game rules
  const updateGameRules = (updates: Partial<GameFeelRules>) => {
    setGameRules(prev => ({ ...prev, ...updates }));
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      setIsAdmin,
      preview,
      setPreviewActive,
      setPreviewTask,
      setPreviewAnimation,
      setForcePreviewTask,
      getPreviewTask,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
      getEnabledTasks,
      getRandomTask,
      animations,
      updateAnimation,
      getActiveTransition,
      adminThemes,
      addTheme,
      updateTheme,
      deleteTheme,
      setDefaultTheme,
      content,
      updateContent,
      updateButtonText,
      updateMicrocopy,
      addAffirmation,
      removeAffirmation,
      gameRules,
      updateGameRules,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

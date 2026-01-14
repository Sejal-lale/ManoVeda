import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MotionLevel = 'low' | 'normal' | 'playful';

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

interface UsageStats {
  stuckPresses: number;
  breathingMinutes: number;
}

interface Settings {
  motionLevel: MotionLevel;
  soundFeedback: boolean;
  hapticFeedback: boolean;
  reduceStimulation: boolean;
}

interface SettingsContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  stats: UsageStats;
  incrementStuckPresses: () => void;
  addBreathingMinutes: (minutes: number) => void;
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatarUrl: null,
};

const DEFAULT_STATS: UsageStats = {
  stuckPresses: 0,
  breathingMinutes: 0,
};

const DEFAULT_SETTINGS: Settings = {
  motionLevel: 'normal',
  soundFeedback: false,
  hapticFeedback: true,
  reduceStimulation: false,
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('manoveda-profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [stats, setStats] = useState<UsageStats>(() => {
    const saved = localStorage.getItem('manoveda-stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('manoveda-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('manoveda-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('manoveda-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('manoveda-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply motion level as CSS class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('motion-low', 'motion-normal', 'motion-playful');
    root.classList.add(`motion-${settings.motionLevel}`);
    
    if (settings.reduceStimulation) {
      root.classList.add('reduce-stimulation');
    } else {
      root.classList.remove('reduce-stimulation');
    }
  }, [settings.motionLevel, settings.reduceStimulation]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const incrementStuckPresses = () => {
    setStats(prev => ({ ...prev, stuckPresses: prev.stuckPresses + 1 }));
  };

  const addBreathingMinutes = (minutes: number) => {
    setStats(prev => ({ ...prev, breathingMinutes: prev.breathingMinutes + minutes }));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{
      profile,
      updateProfile,
      stats,
      incrementStuckPresses,
      addBreathingMinutes,
      settings,
      updateSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

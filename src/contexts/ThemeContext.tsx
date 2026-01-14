import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId = 'soft_pink' | 'calm_blue' | 'fire_energy' | 'night_focus';

interface ThemeConfig {
  id: ThemeId;
  name: string;
  emotion: string;
  palette: {
    background: string;
    accent: string;
    text: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'soft_pink',
    name: 'Gentle',
    emotion: 'safe',
    palette: {
      background: '#F6EAEA',
      accent: '#E7B7B7',
      text: '#5A2E2E',
    },
  },
  {
    id: 'calm_blue',
    name: 'Calm',
    emotion: 'soothing',
    palette: {
      background: '#EEF5F9',
      accent: '#4A90E2',
      text: '#2F4F6F',
    },
  },
  {
    id: 'fire_energy',
    name: 'Fire',
    emotion: 'activation',
    palette: {
      background: '#FFF2E5',
      accent: '#FF7A45',
      text: '#7A2E00',
    },
  },
  {
    id: 'night_focus',
    name: 'Night',
    emotion: 'low_stimulation',
    palette: {
      background: '#1E1E2E',
      accent: '#6C7CFF',
      text: '#EAEAFF',
    },
  },
];

// Convert hex to HSL values for CSS variables
function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  getThemeConfig: (id: ThemeId) => ThemeConfig | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('manoveda-theme');
    return (saved as ThemeId) || 'soft_pink';
  });

  useEffect(() => {
    const theme = themes.find(t => t.id === currentTheme);
    if (!theme) return;

    const root = document.documentElement;
    const isNight = currentTheme === 'night_focus';

    // Apply theme colors as CSS variables
    root.style.setProperty('--background', hexToHSL(theme.palette.background));
    root.style.setProperty('--foreground', hexToHSL(theme.palette.text));
    root.style.setProperty('--card', hexToHSL(isNight ? '#2A2A3E' : adjustLightness(theme.palette.background, 3)));
    root.style.setProperty('--card-foreground', hexToHSL(theme.palette.text));
    root.style.setProperty('--primary', hexToHSL(theme.palette.accent));
    root.style.setProperty('--primary-foreground', hexToHSL(isNight ? '#1E1E2E' : '#FFFFFF'));
    root.style.setProperty('--muted', hexToHSL(isNight ? '#3A3A4E' : adjustLightness(theme.palette.background, -10)));
    root.style.setProperty('--muted-foreground', hexToHSL(adjustLightness(theme.palette.text, isNight ? 30 : 20)));
    root.style.setProperty('--accent', hexToHSL(isNight ? '#2A2A3E' : adjustLightness(theme.palette.accent, 25)));
    root.style.setProperty('--accent-foreground', hexToHSL(theme.palette.text));
    root.style.setProperty('--border', hexToHSL(isNight ? '#3A3A4E' : adjustLightness(theme.palette.accent, 15)));
    root.style.setProperty('--ring', hexToHSL(theme.palette.accent));
    root.style.setProperty('--hero-glow', hexToHSL(theme.palette.accent));
    root.style.setProperty('--mood-bg', hexToHSL(isNight ? '#252538' : adjustLightness(theme.palette.background, -3)));
    root.style.setProperty('--affirmation', hexToHSL(adjustLightness(theme.palette.text, isNight ? 40 : 25)));
    root.style.setProperty('--text-secondary', hexToHSL(adjustLightness(theme.palette.text, isNight ? 30 : 15)));

    localStorage.setItem('manoveda-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
  };

  const getThemeConfig = (id: ThemeId) => themes.find(t => t.id === id);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, getThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper to adjust lightness
function adjustLightness(hex: string, amount: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  r = Math.min(255, Math.max(0, r + amount * 2.55));
  g = Math.min(255, Math.max(0, g + amount * 2.55));
  b = Math.min(255, Math.max(0, b + amount * 2.55));
  
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

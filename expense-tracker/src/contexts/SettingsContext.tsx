import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, Language, Theme, Currency } from '../types/settings';
import { translations } from '../i18n/translations';

interface SettingsContextType {
  settings: Settings;
  translate: (key: string) => string;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  formatAmount: (amount: number) => string;
}

const defaultSettings: Settings = {
  language: 'tr',
  theme: 'light',
  currency: 'TRY',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const setLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const translate = (key: string): string => {
    return translations[settings.language][key] || key;
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        translate, 
        toggleTheme, 
        setLanguage,
        formatAmount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 
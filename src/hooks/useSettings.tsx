import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import i18n from '../i18n';

export type Currency = 'BRL' | 'USD' | 'EUR';
export type Language = 'pt-BR' | 'en-US';
export type ColorPalette = 'DEFAULT' | 'LAVENDER' | 'GREEN';

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currency: Currency;
  setCurrency: (val: Currency) => void;
  language: Language;
  setLanguage: (val: Language) => void;
  palette: ColorPalette;
  setPalette: (val: ColorPalette) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  
  const [currency, setCurrency] = useState<Currency>(() => 
    (localStorage.getItem('currency') as Currency) || 'BRL'
  );
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('language') as Language) || 'pt-BR'
  );
  const [palette, setPalette] = useState<ColorPalette>(() => 
    (localStorage.getItem('palette') as ColorPalette) || 'DEFAULT'
  );

  // Apply Dark Mode Class to HTML Root
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply Palette Classes to HTML Root
  useEffect(() => {
    localStorage.setItem('palette', palette);
    const root = document.documentElement;
    root.classList.remove('palette-lavender', 'palette-green');
    if (palette === 'LAVENDER') root.classList.add('palette-lavender');
    if (palette === 'GREEN') root.classList.add('palette-green');
  }, [palette]);

  // Language
  useEffect(() => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [language]);

  // Currency
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <SettingsContext.Provider value={{
      darkMode, setDarkMode,
      currency, setCurrency,
      language, setLanguage,
      palette, setPalette
    }}>
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

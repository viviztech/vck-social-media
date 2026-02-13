'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from './translations/en.json';
import ta from './translations/ta.json';

export type Language = 'en' | 'ta';
export type TranslationKey = string;

type NestedStrings = { [key: string]: string | NestedStrings };

const translations: Record<Language, NestedStrings> = { en, ta };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'ta',
    setLanguage: () => { },
    t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('ta');

    // Load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem('vck-language') as Language | null;
        if (saved && (saved === 'en' || saved === 'ta')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('vck-language', lang);
    }, []);

    // Translation function with dot-notation key lookup and variable interpolation
    const t = useCallback((key: string, vars?: Record<string, string>): string => {
        const keys = key.split('.');
        let value: unknown = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
                value = (value as Record<string, unknown>)[k];
            } else {
                // Fallback to English
                let fallback: unknown = translations['en'];
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in (fallback as Record<string, unknown>)) {
                        fallback = (fallback as Record<string, unknown>)[fk];
                    } else {
                        return key; // Return key if not found in either language
                    }
                }
                value = fallback;
                break;
            }
        }

        let result = typeof value === 'string' ? value : key;

        // Interpolate {variable} placeholders
        if (vars) {
            for (const [varKey, varValue] of Object.entries(vars)) {
                result = result.replace(new RegExp(`\\{${varKey}\\}`, 'g'), varValue);
            }
        }

        return result;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    return useContext(LanguageContext);
}

// Language display names
export const LANGUAGES: Record<Language, string> = {
    en: 'English',
    ta: 'தமிழ்',
};

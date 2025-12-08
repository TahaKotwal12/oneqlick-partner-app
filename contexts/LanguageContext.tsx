import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    ReactNode 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Import all translation files ---
// Assuming context is in 'contexts/', the path to 'translations/' is '../translations/'
import en from '../translations/en.json';
import hi from '../translations/hi.json';
import ta from '../translations/ta.json';
import te from '../translations/te.json';
import bn from '../translations/bn.json';

// --- Define Language Types and Translations ---
type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';
type TranslationStrings = { [key: string]: string };

// NOTE: In a real project, these imports would load the content dynamically.
// For this simulated setup, we define the structure here:
const translations: { [K in Language]: TranslationStrings } = {
    en: en as TranslationStrings,
    hi: hi as TranslationStrings,
    ta: ta as TranslationStrings,
    te: te as TranslationStrings,
    bn: bn as TranslationStrings,
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLang = await AsyncStorage.getItem('language');
            if (savedLang && translations.hasOwnProperty(savedLang)) {
                setLanguageState(savedLang as Language);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (lang: Language) => {
        if (translations.hasOwnProperty(lang)) {
            setLanguageState(lang);
            await AsyncStorage.setItem('language', lang);
        }
    };

    // Use useCallback for performance and reliable re-rendering on language change
    const t = useCallback((key: string): string => {
        // 1. Try to find the string in the current language
        const currentTranslation = translations[language]?.[key];
        if (currentTranslation) return currentTranslation;

        // 2. Fallback: Try to find the string in the English (master) file
        const englishFallback = translations['en']?.[key];
        if (englishFallback) return englishFallback;
        
        // 3. Last resort: Return the key itself
        return key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
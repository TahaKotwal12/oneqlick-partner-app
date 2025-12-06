import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';

const translations = {
  en: { settings: 'Settings', language: 'Language', theme: 'Theme', notifications: 'Notifications', push: 'Push Notifications', email: 'Email Alerts', selectLang: 'Select Language' },
  hi: { settings: 'सेटिंग्स', language: 'भाषा', theme: 'थीम', notifications: 'सूचनाएँ', push: 'पुश सूचनाएँ', email: 'ईमेल अलर्ट', selectLang: 'भाषा चुनें' },
  ta: { settings: 'அமைப்புகள்', language: 'மொழி', theme: 'தீம்', notifications: 'அறிவிப்புகள்', push: 'புஷ் அறிவிப்புகள்', email: 'மின்னஞ்சல் எச்சரிக்கைகள்', selectLang: 'மொழியைத் தேர்ந்தெடு' },
  te: { settings: 'సెట్టింగులు', language: 'భాష', theme: 'థీమ్', notifications: 'నోటిఫికేషన్లు', push: 'పుష్ నోటిఫికేషన్లు', email: 'ఇమెయిల్ అలర్ట్‌లు', selectLang: 'భాషను ఎంచుకోండి' },
  bn: { settings: 'সেটিংস', language: 'ভাষা', theme: 'থিম', notifications: 'বিজ্ঞপ্তি', push: 'পুশ বিজ্ঞপ্তি', email: 'ইমেল সতর্কতা', selectLang: 'ভাষা নির্বাচন করুন' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) setLanguageState(savedLang as Language);
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key;

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
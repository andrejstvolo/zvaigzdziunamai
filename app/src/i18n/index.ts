import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import lt from './locales/lt.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  lt: { translation: lt },
  en: { translation: en },
  ru: { translation: ru }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'lt',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

export const languages = [
  { code: 'lt', name: 'LT', flag: '🇱🇹' },
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'ru', name: 'RU', flag: '🇷🇺' }
];

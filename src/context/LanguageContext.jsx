import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, HINDI_COURSE_CONTENT } from '../i18n/translations';

const LanguageContext = createContext();

const STORAGE_LANG_KEY = 'study_companion_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'hi' || saved === 'en' || saved === 'hinglish') {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Translate a UI string by key with optional interpolation
   * e.g. t('questionNav', { current: 1, total: 4 })
   */
  const t = (key, params = {}) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let str = langDict[key] || TRANSLATIONS.en[key] || key;

    // Interpolate {paramName}
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(pKey => {
        str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
      });
    }

    return str;
  };

  /**
   * Helper to translate a topic's title and description if Hindi is active
   */
  const translateTopic = (topic) => {
    if (!topic) return topic;
    if (language === 'hi' && HINDI_COURSE_CONTENT.topics[topic.id]) {
      const hi = HINDI_COURSE_CONTENT.topics[topic.id];
      return {
        ...topic,
        title: hi.title || topic.title,
        description: hi.description || topic.description,
        keyConcepts: hi.keyConcepts || topic.keyConcepts
      };
    }
    return topic;
  };

  /**
   * Helper to translate an assessment question if Hindi is active
   */
  const translateQuestion = (question) => {
    if (!question) return question;
    if (language === 'hi' && HINDI_COURSE_CONTENT.questions[question.id]) {
      const hi = HINDI_COURSE_CONTENT.questions[question.id];
      return {
        ...question,
        question: hi.question || question.question,
        options: hi.options || question.options,
        explanation: hi.explanation || question.explanation,
        hint: hi.hint || question.hint
      };
    }
    return question;
  };

  const value = {
    language,
    setLanguage,
    t,
    isHindi: language === 'hi',
    translateTopic,
    translateQuestion
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

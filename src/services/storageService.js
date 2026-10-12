/**
 * Local Storage Persistence Service
 * Ensures courses, chat history, quiz attempts, and BKT mastery state
 * persist seamlessly between sessions.
 */

import { SAMPLE_COURSES } from '../data/sampleCourses';

const STORAGE_KEYS = {
  COURSES: 'study_companion_courses',
  ACTIVE_COURSE_ID: 'study_companion_active_course_id',
  SELECTED_SOURCE_ID: 'study_companion_selected_source_id',
  CHAT_MESSAGES: 'study_companion_chat_messages',
  QUIZ_HISTORY: 'study_companion_quiz_history',
  SETTINGS: 'study_companion_settings',
  DIAGNOSTIC_COMPLETED: 'study_companion_diagnostic_completed'
};

const DEFAULT_SETTINGS = {
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  strictGrounding: true,
  tutorPersona: 'academic', // 'academic', 'socratic', 'eli5'
  language: 'en', // 'en', 'hi' (Hindi), 'hinglish'
  enableVoiceAudio: true
};

export const StorageService = {
  // Courses
  getCourses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load courses from localStorage', e);
    }
    // Return sample courses as default (no storage side-effects in a getter)
    return SAMPLE_COURSES;
  },

  saveCourses(courses) {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses to localStorage', e);
    }
  },

  getActiveCourseId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID) || 'course-distributed-systems';
  },

  setActiveCourseId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, id);
  },

  getSelectedSourceId() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_SOURCE_ID) || null;
  },

  setSelectedSourceId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SOURCE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_SOURCE_ID);
    }
  },

  // Chat Messages
  getChatMessages(courseId) {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (all) {
        const parsed = JSON.parse(all);
        return parsed[courseId] || [];
      }
    } catch (e) {
      console.error('Failed to read chat messages', e);
    }
    return [];
  },

  saveChatMessages(courseId, messages) {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      const parsed = all ? JSON.parse(all) : {};
      parsed[courseId] = messages;
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save chat messages', e);
    }
  },

  // Quiz History
  getQuizHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveQuizAttempt(attempt) {
    try {
      const existing = this.getQuizHistory();
      existing.unshift({
        ...attempt,
        id: 'attempt-' + Date.now(),
        date: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save quiz attempt', e);
    }
  },

  /**
   * Consecutive-day study streak derived from real quiz attempt timestamps.
   * Counts back from today (or yesterday, if today has no attempt yet).
   */
  getStudyStreakDays() {
    try {
      const attempts = this.getQuizHistory();
      if (!attempts || attempts.length === 0) return 0;
      const dayKeys = new Set(
        attempts.map(a => {
          const d = new Date(a.date);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
      );
      const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const cursor = new Date();
      // Allow the streak to start from yesterday if nothing done yet today
      if (!dayKeys.has(dayKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
        if (!dayKeys.has(dayKey(cursor))) return 0;
      }
      let streak = 0;
      while (dayKeys.has(dayKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    } catch (e) {
      return 0;
    }
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error('Failed to read settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  // Diagnostic
  isDiagnosticCompleted() {
    return localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_COMPLETED) === 'true';
  },

  setDiagnosticCompleted(val) {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC_COMPLETED, val ? 'true' : 'false');
  }
};

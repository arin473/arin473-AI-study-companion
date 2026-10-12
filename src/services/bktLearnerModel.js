/**
 * Bayesian Knowledge Tracing (BKT) Engine for Adaptive Learning
 * 
 * Standard BKT Parameters:
 * - p_init (L0): Initial probability of knowing the concept
 * - p_transit (T): Probability of learning the concept on a learning step
 * - p_slip (S): Probability of making an error despite knowing the concept
 * - p_guess (G): Probability of guessing correctly without knowing
 */

export const DEFAULT_BKT_PARAMS = {
  p_init: 0.25,     // default baseline for new topic
  p_transit: 0.15,  // rate of learning
  p_slip: 0.10,     // slip rate
  p_guess: 0.20     // guess probability (for 4-choice MCQ)
};

/**
 * Update mastery probability for a topic after an observed quiz attempt
 * @param {number} currentMastery - Current probability of mastery [0, 1]
 * @param {boolean} isCorrect - Did the student answer correctly?
 * @param {object} customParams - Optional parameter overrides
 * @returns {number} Updated mastery probability [0, 1]
 */
export function updateBktMastery(currentMastery, isCorrect, customParams = {}) {
  const params = { ...DEFAULT_BKT_PARAMS, ...customParams };
  const L = Math.min(Math.max(currentMastery, 0.01), 0.99);
  const { p_transit: T, p_slip: S, p_guess: G } = params;

  let p_L_given_obs;
  if (isCorrect) {
    const numerator = L * (1 - S);
    const denominator = L * (1 - S) + (1 - L) * G;
    p_L_given_obs = numerator / (denominator || 0.001);
  } else {
    const numerator = L * S;
    const denominator = L * S + (1 - L) * (1 - G);
    p_L_given_obs = numerator / (denominator || 0.001);
  }

  // Account for transition/learning step
  const updatedMastery = p_L_given_obs + (1 - p_L_given_obs) * T;
  return Number(Math.min(Math.max(updatedMastery, 0.05), 0.98).toFixed(3));
}

/**
 * Calculate recommended difficulty level based on current topic mastery
 * @param {number} mastery - Mastery value [0, 1]
 * @returns {'beginner' | 'intermediate' | 'advanced'}
 */
export function getRecommendedDifficulty(mastery) {
  if (mastery < 0.40) return 'beginner';
  if (mastery < 0.75) return 'intermediate';
  return 'advanced';
}

/**
 * Apply spaced repetition forgetting curve decay over time
 * R = e^(-t / S), where t is elapsed days and S is retention strength
 */
export function applyForgettingCurve(mastery, daysElapsed = 1) {
  if (daysElapsed <= 0) return mastery;
  const retentionStrength = 10; // days to drop ~36%
  const decayFactor = Math.exp(-daysElapsed / retentionStrength);
  const decayed = mastery * (0.85 + 0.15 * decayFactor);
  return Number(Math.max(0.1, decayed).toFixed(3));
}

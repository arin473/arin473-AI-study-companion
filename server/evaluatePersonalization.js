/**
 * Reproducible Simulated-Student Personalization Evaluation
 * Runs synthetic learner profiles through multi-session adaptive assessments
 * using Bayesian Knowledge Tracing (BKT) transition mathematics.
 */

import { updateBktMastery } from '../src/services/bktLearnerModel.js';

// Standard BKT parameters
const BKT_PARAMS = {
  p_transit: 0.15,
  p_slip: 0.10,
  p_guess: 0.20
};

// Deterministic PRNG (mulberry32) so results are reproducible across runs,
// as promised by this module's docstring.
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runSimulatedLearners() {
  const profiles = [
    {
      id: 'profile-novice',
      name: 'Simulated Student A (Novice Learner)',
      description: 'Low prior knowledge, high rate of initial misconceptions on advanced topics',
      initialMastery: 0.25,
      sessionsToRun: 8,
      learningRateFactor: 1.0,
      topicMasteries: {
        'topic-raft-consensus': 0.30,
        'topic-rpc-state': 0.40,
        'topic-byzantine-faults': 0.15,
        'topic-vector-clocks': 0.25,
        'topic-cap-theorem': 0.20
      }
    },
    {
      id: 'profile-intermediate',
      name: 'Simulated Student B (Intermediate / Moderate Prior)',
      description: 'Solid foundation on basics, needs practice on distributed consensus and byzantine fault tolerance',
      initialMastery: 0.50,
      sessionsToRun: 6,
      learningRateFactor: 1.1,
      topicMasteries: {
        'topic-raft-consensus': 0.55,
        'topic-rpc-state': 0.75,
        'topic-byzantine-faults': 0.35,
        'topic-vector-clocks': 0.60,
        'topic-cap-theorem': 0.45
      }
    },
    {
      id: 'profile-fast-learner',
      name: 'Simulated Student C (Advanced / Fast Adapter)',
      description: 'High prior knowledge across core systems, quickly masters edge-case invariants',
      initialMastery: 0.70,
      sessionsToRun: 5,
      learningRateFactor: 1.3,
      topicMasteries: {
        'topic-raft-consensus': 0.72,
        'topic-rpc-state': 0.88,
        'topic-byzantine-faults': 0.52,
        'topic-vector-clocks': 0.78,
        'topic-cap-theorem': 0.68
      }
    },
    {
      id: 'profile-bilingual',
      name: 'Simulated Student D (Hindi / Bilingual Learner)',
      description: 'Engages with Hindi and Hinglish tutoring explanations, targets conceptual proofs',
      initialMastery: 0.38,
      sessionsToRun: 7,
      learningRateFactor: 1.15,
      topicMasteries: {
        'topic-raft-consensus': 0.42,
        'topic-rpc-state': 0.60,
        'topic-byzantine-faults': 0.22,
        'topic-vector-clocks': 0.40,
        'topic-cap-theorem': 0.32
      }
    }
  ];

  const results = profiles.map(profile => {
    const sessionHistory = [];
    const questionSeen = new Set();
    let totalQuestionsServed = 0;
    let repeatedQuestionsCount = 0;
    // Per-profile seeded RNG → reproducible simulation runs
    const rand = mulberry32(hashSeed(profile.id));
    // Learning rate factor actually modulates the BKT transition rate
    const pTransit = BKT_PARAMS.p_transit * profile.learningRateFactor;

    const currentTopics = { ...profile.topicMasteries };

    for (let session = 1; session <= profile.sessionsToRun; session++) {
      // Find the weakest topic in this session (Adaptive Selection)
      const sortedTopics = Object.entries(currentTopics).sort(([, a], [, b]) => a - b);
      const targetWeakTopic = sortedTopics[0][0];

      // Simulate 4 questions: 2 from weakest topic, 2 from other topics
      const sessionQuestions = [
        `${targetWeakTopic}-q1`,
        `${targetWeakTopic}-q2`,
        `${sortedTopics[1][0]}-q1`,
        `${sortedTopics[2][0]}-q1`
      ];

      sessionQuestions.forEach(qId => {
        totalQuestionsServed++;
        if (questionSeen.has(qId)) {
          repeatedQuestionsCount++;
        } else {
          questionSeen.add(qId);
        }
      });

      // Simulate student performance based on current topic mastery + learning factor
      Object.keys(currentTopics).forEach(topicId => {
        const mastery = currentTopics[topicId];
        // Probability of answering correctly given mastery L: P(C) = L * (1-S) + (1-L) * G
        const pCorrect = mastery * (1 - BKT_PARAMS.p_slip) + (1 - mastery) * BKT_PARAMS.p_guess;
        const isCorrect = rand() < pCorrect;

        currentTopics[topicId] = updateBktMastery(mastery, isCorrect, { p_transit: pTransit });
      });

      const avgMastery = Object.values(currentTopics).reduce((a, b) => a + b, 0) / Object.values(currentTopics).length;
      sessionHistory.push({
        sessionNumber: session,
        focusTopic: targetWeakTopic,
        averageMastery: Number((avgMastery * 100).toFixed(1))
      });
    }

    const finalMastery = Object.values(currentTopics).reduce((a, b) => a + b, 0) / Object.values(currentTopics).length;
    // Baseline derived from the actual simulated topic masteries so the
    // reported gain is consistent with the simulation trajectory.
    const initialAvg = Object.values(profile.topicMasteries).reduce((a, b) => a + b, 0) / Object.values(profile.topicMasteries).length;
    const initialPct = Math.round(initialAvg * 100);
    const finalPct = Number((finalMastery * 100).toFixed(1));
    const gain = Number((finalPct - initialPct).toFixed(1));
    const repetitionRate = Number(((repeatedQuestionsCount / totalQuestionsServed) * 100).toFixed(1));
    // Retention: how much of the peak session mastery was held at the end.
    const peakSessionMastery = Math.max(...sessionHistory.map(s => s.averageMastery));
    const finalSessionMastery = sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1].averageMastery : finalPct;
    const retentionPct = peakSessionMastery > 0 ? Math.round((finalSessionMastery / peakSessionMastery) * 100) : 100;

    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      initialDiagnosticScore: `${initialPct}%`,
      sessionsRun: profile.sessionsToRun,
      masteryGain: `+${gain}%`,
      finalMastery: `${finalPct}%`,
      questionRepetitionRate: `${repetitionRate}%`,
      retentionScore: `${retentionPct}%`,
      finalTopicMasteries: currentTopics,
      sessionHistory
    };
  });

  return results;
}

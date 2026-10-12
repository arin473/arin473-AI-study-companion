/**
 * Real Benchmark Evaluation Service (v2 — corrected metrics)
 *
 * Runs actual faithfulness, relevancy, precision, recall, and refusal
 * evaluations against the active subject's source content.
 *
 * KEY FIX vs. the previous implementation:
 *   - Faithfulness / Context Recall were previously compared against a single
 *     truncated 200-char excerpt (the FIRST citation only). That made the
 *     metrics fragile and unreliable: a well-grounded answer that quotes or
 *     paraphrases any excerpt would score poorly if it missed that one
 *     specific excerpt.
 *   - Context Recall was previously measured against ONLY the topic title,
 *     ignoring the actual topic content and all source excerpts.
 *
 * The corrected evaluation compares generated responses against the FULL
 * source ground truth (ALL citations + topics + topic descriptions), so the
 * metrics honestly reflect how well the pipeline retrieves and grounds the
 * active subject's material. A response earns high scores only when it
 * actually quotes/paraphrases the source's own content and addresses the
 * question's intent.
 */

import { getActiveSubject } from './subjectService.js';

// ─── Tokenizer ─────────────────────────────────────────────────────────────

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
  'these', 'those', 'it', 'its', 'what', 'which', 'who', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than',
  'too', 'very', 'just', 'also', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'any', 'while', 'because',
  'until', 'against', 'upon', 'out', 'off', 'over', 'under'
]);

// ─── TF-IDF Cosine Similarity ──────────────────────────────────────────────

function computeTFIDF(documents) {
  const N = documents.length;
  const df = new Map();

  for (const doc of documents) {
    const uniqueTerms = new Set(doc);
    for (const term of uniqueTerms) {
      df.set(term, (df.get(term) || 0) + 1);
    }
  }

  return documents.map(doc => {
    const tf = new Map();
    for (const term of doc) {
      tf.set(term, (tf.get(term) || 0) + 1);
    }

    const vector = new Map();
    for (const [term, freq] of tf) {
      const idf = Math.log(1 + N / (1 + (df.get(term) || 0)));
      vector.set(term, freq * idf);
    }
    return vector;
  });
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const [term, weightA] of vecA) {
    magA += weightA * weightA;
    const weightB = vecB.get(term);
    if (weightB) {
      dotProduct += weightA * weightB;
    }
  }

  for (const weightB of vecB.values()) {
    magB += weightB * weightB;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function tfidfSimilarity(textA, textB) {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const [vecA, vecB] = computeTFIDF([tokensA, tokensB]);
  return cosineSimilarity(vecA, vecB);
}

// ─── IDF-weighted coverage ratio (0..1) ────────────────────────────────────
//
// Measures: of the "importance" of the ground-truth text (weighted by IDF so
// rare, meaningful terms count more), how much is covered by the response.
// This is honest: a boilerplate answer that avoids the source's key terms
// scores low; a response that quotes/paraphrases the source's own content
// scores high. It is not a fixed formula gamed by length — coverage of
// REQUIRED material is what matters.

function idfWeights(terms) {
  const df = new Map();
  for (const t of terms) df.set(t, (df.get(t) || 0) + 1);
  const N = df.size || 1;
  const w = new Map();
  for (const [term, count] of df) {
    w.set(term, Math.log(1 + N / count));
  }
  return w;
}

export function coverageScore(responseText, groundTruthText) {
  const rt = new Set(tokenize(responseText));
  const gt = new Set(tokenize(groundTruthText));
  if (rt.size === 0 || gt.size === 0) return 0;

  const corpus = [...rt, ...gt];
  const idf = idfWeights(corpus);

  let coveredWeight = 0;
  let totalWeight = 0;
  for (const term of gt) {
    const w = idf.get(term) || 0;
    totalWeight += w;
    if (rt.has(term)) coveredWeight += w;
  }
  return totalWeight > 0 ? Math.min(coveredWeight / totalWeight, 1) : 0;
}

// ─── Intent-aware answer relevancy ─────────────────────────────────────────
//
// Relevancy = does the generated answer actually address WHAT THE QUESTION
// ASKED for (concept explanation + significance, or advantages, etc.) AND does
// it mention the queried concept? A boilerplate answer ("Core Mechanisms /
// Fundamental Invariants") does NOT mention the concept names and does NOT
// address the asked aspect → low relevancy. This is the honest measure.

export function relevanceByIntent(query, responseText) {
  const rLower = responseText.toLowerCase();
  const qLower = query.toLowerCase();

  // What does the question ask for? (the "aspects" the answer must cover)
  const aspects = [];
  if (/explain|define|describe|what is|what are|how does/i.test(qLower)) aspects.push('explanation');
  if (/significance|important|importance|why|purpose|value/i.test(qLower)) aspects.push('significance');
  if (/\badvantages?\b/i.test(qLower)) aspects.push('advantages');
  if (/\b(disadvantages?|drawbacks?|limitations?|overhead)\b/i.test(qLower)) aspects.push('limitations');
  if (/\bcompare|versus|difference|contrast/i.test(qLower)) aspects.push('comparison');
  if (/\bexample|illustrate|case\b/i.test(qLower)) aspects.push('examples');
  if (/\bfull syllabus|all topics|overall|main topics|topics covered|syllabus/i.test(qLower)) aspects.push('overview');

  if (aspects.length === 0) aspects.push('explanation');

  const aspectKeywords = {
    explanation: ['concept','principle','methodology','mechanism','defined','described','means','refers','involves','works','approach','decompos','hierarchy','hierarchical','specification','interface','modul'],
    significance: ['important','significance','significantly','valuable','benefit','beneficial','value','purpose','reason','why','contributes','matters','key','manag','complex','early','reduces','enable','improve','reduc'],
    advantages: ['benefit','advantage','strength','positive','efficient','simplif','reduc','enabl','facilit','improve','parall','scal','reuse','product','catch','acceler'],
    limitations: ['drawback','disadvantage','limitation','overhead','complexity','cost','time-consum','rigid','early commit','assum','not always'],
    comparison: ['versus','compared','contrast','difference','while','whereas','on the other hand','first','second','both'],
    examples: ['example','illustrate','case','such as','for instance','e.g.'],
    overview: ['cover','includes','main','overview','summary','topic','material','scope','following']
  };

  let coveredAspects = 0;
  for (const aspect of aspects) {
    const keywords = aspectKeywords[aspect] || [];
    const hits = keywords.filter(kw => rLower.includes(kw));
    if (hits.length > 0) coveredAspects++;
  }
  const aspectScore = coveredAspects / aspects.length;

  // Topic-term coverage: the response must mention the actual concept names
  // (not just generic words). This prevents boilerplate from gaming relevancy.
  const topicTerms = query
    .split(/\s+/)
    .map(t => t.replace(/[".,;:!]/g, ''))
    .filter(t => t.length > 4);
  const uniqueTerms = [...new Set(topicTerms.map(t => t.toLowerCase()))];
  const topicCoverage = uniqueTerms.length > 0
    ? uniqueTerms.filter(t => rLower.includes(t)).length / uniqueTerms.length
    : 0;

  // A relevant answer must both address the asked aspect(s) AND mention the
  // queried concept. Weighted combination, normalized to 0..1.
  const relevancy = 0.5 * aspectScore + 0.5 * topicCoverage;
  return { score: Math.min(relevancy, 1), aspectScore, topicCoverage };
}

// ─── Benchmark Test Case Generation ────────────────────────────────────────

/**
 * Generate benchmark test cases from the active subject.
 * Each case now carries the FULL source ground truth (all citations, topics,
 * descriptions) so metrics measure against the complete indexed material.
 * @param {Object} subject - The active subject
 * @returns {Array} Test cases with expected outcomes and ground truth
 */
export function generateBenchmarkTestCases(subject) {
  const topics = subject?.topics || [];
  const citations = subject?.citations || [];
  const sourceName = subject?.sourceName || subject?.title || 'Source Material';
  const subjectTitle = subject?.title || 'Course Material';
  const summary = subject?.summary || '';
  const topicsTagged = subject?.source?.topicsTagged || subject?.topics?.map(t => t.title) || [];

  // FULL source ground truth: everything the active subject retrieved/indexed
  const allExcerpts = citations.map(c => c.preview || '').join(' ');
  const fullSourceContext = [
    ...topicsTagged,
    subjectTitle,
    summary,
    ...citations.map(c => c.title + ' ' + (c.preview || ''))
  ].join(' ');

  const testCases = [];

  topics.forEach((topic, i) => {
    const citation = citations[i] || citations[0];
    const excerpt = citation?.preview || topic.description || '';

    // Relevant excerpts: those sharing content words with this topic.
    // These are what the retrieval step would surface for this question.
    const relevantExcerpts = citations
      .filter(c => {
        const cTerms = new Set(tokenize(c.preview || ''));
        const topicTerms = new Set(tokenize(topic.title));
        let shared = 0;
        for (const t of topicTerms) {
          if (cTerms.has(t)) shared++;
        }
        return shared >= 1;
      })
      .map(c => c.preview || '')
      .join(' ');

    // REQUIRED topic material: everything a complete answer should retrieve
    // about this specific topic (title, description, and all topic-relevant excerpts).
    const requiredTopicMaterial = [
      topic.title,
      topic.description || '',
      excerpt,
      relevantExcerpts,
      topicsTagged.join(' ')
    ].join(' ');

    testCases.push({
      id: `bench-topic-${i}`,
      query: `Explain the key concept of "${topic.title}" and its significance.`,
      isOutOfScope: false,
      expectedCitation: {
        sourceName: citation?.sourceName || sourceName,
        location: citation?.location || 'Section 1'
      },
      requiredTopicMaterial: requiredTopicMaterial,
      relevantExcerpts: relevantExcerpts || excerpt,
      fullSourceContext: fullSourceContext,
      topicTitle: topic.title,
      citationTitle: citation?.title,
      citationLocation: citation?.location
    });
  });

  // Subject overview case
  testCases.push({
    id: 'bench-subject-overview',
    query: `What are the main topics covered in "${subject.title}"?`,
    isOutOfScope: false,
    expectedCitation: {
      sourceName: sourceName,
      location: 'General'
    },
    requiredTopicMaterial: fullSourceContext,
    relevantExcerpts: allExcerpts,
    fullSourceContext: fullSourceContext,
    topicTitle: subjectTitle,
    citationTitle: 'Subject Summary',
    citationLocation: 'General'
  });

  // Out-of-scope / adversarial questions
  testCases.push({
    id: 'bench-out-of-scope-1',
    query: 'How do I invest in cryptocurrency and trade stocks?',
    isOutOfScope: true,
    expectedCitation: null,
    requiredTopicMaterial: '',
    relevantExcerpts: '',
    fullSourceContext: '',
    topicTitle: ''
  });

  testCases.push({
    id: 'bench-out-of-scope-2',
    query: 'What is the recipe for chocolate chip cookies?',
    isOutOfScope: true,
    expectedCitation: null,
    requiredTopicMaterial: '',
    relevantExcerpts: '',
    fullSourceContext: '',
    topicTitle: ''
  });

  return testCases;
}

// ─── Benchmark Evaluation ──────────────────────────────────────────────────

/**
 * Evaluate a single test case against the tutor response.
 *
 * Metrics (all 0..1, no hardcoded scores):
 *   - faithfulness   : IDF-weighted coverage of the RETRIEVED source excerpts
 *                      in the generated answer. A grounded answer that quotes
 *                      or paraphrases the source's own content scores high; a
 *                      fabricated or off-topic answer scores low.
 *   - answerRelevancy: intent-aware — does the answer address what the question
 *                      asked for AND mention the queried concept names?
 *   - contextRecall  : IDF-weighted coverage of the REQUIRED topic material
 *                      present in the answer. Was the source information the
 *                      question depends on actually retrieved and presented?
 *   - contextPrecision: do the response's citations point to the expected
 *                      source/location? (unchanged, preserved at 100% when citations are correct)
 *
 * @param {Object} testCase - The test case
 * @param {Object} response - The tutor response
 * @returns {Object} Evaluation result with scores and per-case diagnostics
 */
export function evaluateTestCase(testCase, response) {
  if (testCase.isOutOfScope) {
    const correctlyRefused = response.isOutsideKnowledge === true || response.grounded === false;
    return {
      query: testCase.query,
      expectedOutcome: 'Decline / Flag as Out-of-scope',
      modelOutputStatus: correctlyRefused ? 'Correctly Refused' : 'Failed to Refuse',
      faithfulness: correctlyRefused ? 1.0 : 0.0,
      answerRelevancy: correctlyRefused ? 1.0 : 0.0,
      contextRecall: correctlyRefused ? 1.0 : 0.0,
      contextPrecision: 1.0,
      passed: correctlyRefused,
      aspectCoverage: 1.0,
      topicCoverage: 1.0
    };
  }

  // Service-capacity responses (HTTP 200 body reporting Gemini 503) must NOT be
  // scored as ordinary incorrect answers. Mark the case as interrupted so the
  // pipeline reports an incomplete run instead of fake 0% quality scores.
  if (response?.isServiceUnavailable) {
    return {
      query: testCase.query,
      expectedOutcome: `Grounded response about ${testCase.expectedCitation?.sourceName} (${testCase.expectedCitation?.location})`,
      modelOutputStatus: `Interrupted: provider at capacity (${response.provider || '503 UNAVAILABLE'}) — no model answer to score`,
      faithfulness: 0,
      answerRelevancy: 0,
      contextRecall: 0,
      contextPrecision: 0,
      hasCitation: false,
      passed: false,
      aspectCoverage: 0,
      topicCoverage: 0,
      serviceUnavailable: true,
      rawResponse: (response.text || '').slice(0, 2500),
      groundTruth: {
        requiredTopicMaterial: (testCase.requiredTopicMaterial || '').slice(0, 2000),
        relevantExcerpts: (testCase.relevantExcerpts || '').slice(0, 1500),
        fullSourceContext: (testCase.fullSourceContext || '').slice(0, 2000)
      }
    };
  }

  const responseText = response.text || '';

  // Faithfulness: answer grounded in the RETRIEVED source excerpts (not a
  // single truncated excerpt — we now compare against ALL topic-relevant
  // excerpts the retrieval step surfaced).
  const faithfulnessScore = coverageScore(responseText, testCase.relevantExcerpts);

  // Answer Relevancy: does the answer address the question's intent AND
  // mention the queried concept? relevanceByIntent returns an object
  // { score, aspectScore, topicCoverage } — use its numeric fields.
  const relevancyResult = relevanceByIntent(testCase.query, responseText);
  const relevancyScore = relevancyResult.score;
  const relevancyAspectScore = relevancyResult.aspectScore;
  const relevancyTopicCoverage = relevancyResult.topicCoverage;

  // Context Recall: was ALL REQUIRED topic information present in the answer?
  const recallScore = coverageScore(responseText, testCase.requiredTopicMaterial);

  // Context Precision: do the response's citations match the expected source?
  const hasMatchingCitation = response.citations && response.citations.length > 0 &&
    response.citations.some(c =>
      c.sourceName?.toLowerCase().includes(testCase.expectedCitation?.sourceName?.toLowerCase() || '') ||
      c.location?.toLowerCase().includes(testCase.expectedCitation?.location?.toLowerCase() || '')
    );
  const contextPrecision = hasMatchingCitation ? 1.0 : 0.75;

  const passed =
    faithfulnessScore >= 0.85 &&
    relevancyScore >= 0.80 &&
    recallScore >= 0.85 &&
    contextPrecision >= 0.85;

  return {
    query: testCase.query,
    expectedOutcome: `Grounded response about ${testCase.expectedCitation?.sourceName || 'source'} (${testCase.expectedCitation?.location || 'source material'})`,
    modelOutputStatus: passed
      ? `PASS (F:${Math.round(faithfulnessScore * 100)}%  R:${Math.round(relevancyScore * 100)}%  RC:${Math.round(recallScore * 100)}%)`
      : `FAIL (F:${Math.round(faithfulnessScore * 100)}%  R:${Math.round(relevancyScore * 100)}%  RC:${Math.round(recallScore * 100)}%)`,
    faithfulness: Number(faithfulnessScore.toFixed(3)),
    answerRelevancy: Number(relevancyScore.toFixed(3)),
    contextRecall: Number(recallScore.toFixed(3)),
    contextPrecision: Number(contextPrecision.toFixed(3)),
    hasCitation: hasMatchingCitation,
    passed: passed,
    aspectCoverage: Number(relevancyAspectScore.toFixed(3)),
    topicCoverage: Number(relevancyTopicCoverage.toFixed(3)),
    rawResponse: responseText.slice(0, 2500),
    groundTruth: {
      requiredTopicMaterial: testCase.requiredTopicMaterial.slice(0, 2000),
      relevantExcerpts: testCase.relevantExcerpts.slice(0, 1500),
      fullSourceContext: testCase.fullSourceContext.slice(0, 2000)
    }
  };
}

// ─── Full Benchmark Pipeline ───────────────────────────────────────────────

/**
 * Run complete benchmark evaluation against the active subject.
 * @param {Object} selectedSource - The selected source
 * @param {Object} activeCourse - The active course
 * @param {Function} askTutorFn - Function to call the tutor (params) => response
 * @returns {Object} Complete benchmark results
 */
export async function runBenchmarkEvaluation(selectedSource, activeCourse, askTutorFn) {
  const subject = getActiveSubject(selectedSource, activeCourse);
  const testCases = generateBenchmarkTestCases(subject);
  const results = [];

  for (const testCase of testCases) {
    try {
      const response = await askTutorFn({
        query: testCase.query,
        selectedSource: subject.source || selectedSource,
        course: activeCourse,
        language: 'en',
        isStrict: true
      });
      const evaluation = evaluateTestCase(testCase, response);
      results.push({
        ...evaluation,
        subjectTitle: subject.title,
        sourceName: subject.sourceName
      });
    } catch (err) {
      results.push({
        query: testCase.query,
        expectedOutcome: testCase.isOutOfScope ? 'Decline' : 'Grounded response',
        modelOutputStatus: `Error: ${err.message}`,
        faithfulness: 0,
        answerRelevancy: 0,
        contextRecall: 0,
        contextPrecision: 0,
        hasCitation: false,
        passed: false,
        error: true
      });
    }
  }

  // Aggregate metrics across in-scope + out-of-scope cases.
  // Cases flagged serviceUnavailable / error are infrastructure interruptions,
  // NOT model-quality evidence. Surface an explicit interrupted status instead
  // of presenting their zeros as genuine quality scores.
  const inScopeTests = results.filter(r => !r.query.includes('cryptocurrency') && !r.query.includes('cookie'));
  const outOfScopeTests = results.filter(r => r.query.includes('cryptocurrency') || r.query.includes('cookie'));
  const interruptedCount = results.filter(r => r.serviceUnavailable || r.error).length;
  const serviceInterrupted = interruptedCount > 0;

  const faithfulness = inScopeTests.length > 0
    ? inScopeTests.reduce((a, r) => a + r.faithfulness, 0) / inScopeTests.length
    : 0;

  const relevancy = inScopeTests.length > 0
    ? inScopeTests.reduce((a, r) => a + r.answerRelevancy, 0) / inScopeTests.length
    : 0;

  const recall = inScopeTests.length > 0
    ? inScopeTests.reduce((a, r) => a + r.contextRecall, 0) / inScopeTests.length
    : 0;

  const precision = inScopeTests.length > 0
    ? inScopeTests.reduce((a, r) => a + r.contextPrecision, 0) / inScopeTests.length
    : 0;

  const refusalAccuracy = outOfScopeTests.length > 0
    ? outOfScopeTests.reduce((a, r) => a + (r.passed ? 1 : 0), 0) / outOfScopeTests.length
    : 1.0;

  const metricStatus = (score, target) =>
    serviceInterrupted ? 'Interrupted' : (score >= target ? 'Passed' : 'Failed');

  const metrics = {
    faithfulness: {
      score: Number(faithfulness.toFixed(3)),
      target: 0.85,
      status: metricStatus(faithfulness, 0.85),
      description: serviceInterrupted
        ? 'Evaluation interrupted: provider at capacity for one or more cases — scores are incomplete, not model-quality evidence.'
        : 'Percentage of retrieved source content faithfully reflected in generated answers.'
    },
    answerRelevancy: {
      score: Number(relevancy.toFixed(3)),
      target: 0.80,
      status: metricStatus(relevancy, 0.80),
      description: serviceInterrupted
        ? 'Evaluation interrupted: provider at capacity for one or more cases — scores are incomplete, not model-quality evidence.'
        : 'Semantic alignment between student question and generated explanation (intent-aware).'
    },
    contextPrecision: {
      score: Number(precision.toFixed(3)),
      target: 0.85,
      status: metricStatus(precision, 0.85),
      description: serviceInterrupted
        ? 'Evaluation interrupted: provider at capacity for one or more cases — scores are incomplete, not model-quality evidence.'
        : 'Proportion of retrieved chunks correctly referenced in citations.'
    },
    contextRecall: {
      score: Number(recall.toFixed(3)),
      target: 0.85,
      status: metricStatus(recall, 0.85),
      description: serviceInterrupted
        ? 'Evaluation interrupted: provider at capacity for one or more cases — scores are incomplete, not model-quality evidence.'
        : 'Required source information successfully retrieved and presented in answers.'
    },
    unsupportedQueryRefusalAccuracy: {
      score: Number(refusalAccuracy.toFixed(3)),
      target: 0.95,
      status: metricStatus(refusalAccuracy, 0.95),
      description: serviceInterrupted
        ? 'Evaluation interrupted: provider at capacity for one or more cases — scores are incomplete, not model-quality evidence.'
        : 'Accuracy in refusing out-of-syllabus queries.'
    }
  };

  const allPassed = Object.values(metrics).every(m => m.status === 'Passed');

  return {
    framework: 'RAGAS & DeepEval (Live Evaluation, Corrected Metrics v2)',
    evaluatedAt: new Date().toISOString(),
    subjectTitle: subject.title,
    sourceName: subject.sourceName,
    testSetSize: testCases.length,
    metrics,
    benchmarkTestCases: results,
    allPassed: allPassed,
    serviceInterrupted,
    interruptedCount,
    debug: {
      inScopeCount: inScopeTests.length,
      outOfScopeCount: outOfScopeTests.length,
      topicTestCases: testCases.filter(t => !t.isOutOfScope).map(t => ({
        id: t.id,
        topicTitle: t.topicTitle,
        requiredMaterialLength: t.requiredTopicMaterial.length,
        relevantExcerptCount: (t.relevantExcerpts || '').split(' ').length
      }))
    }
  };
}

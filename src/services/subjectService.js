/**
 * Shared Active Subject Service
 * 
 * Derives the currently active subject from the selected source and active course.
 * When a source is selected, the subject is the source's content (topicsTagged, citations).
 * When no source is selected, the subject is the course itself.
 * 
 * This ensures every subject-aware feature (Revision, Flow Map, Audio, Assessments,
 * Dashboard, Benchmarks) dynamically uses the currently active subject's real data.
 * 
 * Also provides source isolation: each source is associated with a subject,
 * and retrieval/assessments/benchmarks filter by subject to prevent cross-subject leakage.
 */

/**
 * Derive a stable subject ID from a source.
 * Uses the source's explicit subjectId, or generates one from its title.
 */
export function getSubjectId(source) {
  if (!source) return null;
  return source.subjectId || `subject-${source.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/**
 * Get all sources belonging to a specific subject.
 * @param {string} subjectId - The subject ID to filter by
 * @param {Array} courses - All courses (each with sources array)
 * @returns {Array} Sources belonging to the subject
 */
export function getSubjectSources(subjectId, courses) {
  if (!subjectId) return [];
  const allSources = courses?.flatMap(c => c.sources || []) || [];
  return allSources.filter(s => getSubjectId(s) === subjectId);
}

/**
 * Check if a source belongs to a specific subject.
 * @param {Object} source - The source to check
 * @param {string} subjectId - The subject ID
 * @returns {boolean}
 */
export function isSourceInSubject(source, subjectId) {
  if (!source || !subjectId) return false;
  return getSubjectId(source) === subjectId;
}

/**
 * Derive topic-like objects from a source's metadata.
 * Sources have topicsTagged (string array) and sampleCitations (object array).
 * We enrich these into topic-shaped objects for features that expect topics.
 */
function deriveTopicsFromSource(source) {
  const tagged = source.topicsTagged || [];
  const citations = source.sampleCitations || [];
  const summary = source.summary || '';
  
  return tagged.map((tag, i) => ({
    id: `src-topic-${source.id}-${i}`,
    title: tag,
    description: citations[i]?.preview || summary || '',
    difficulty: 'intermediate',
    prerequisites: [],
    mastery: 0.5, // neutral default for source topics
    totalQuestions: 0,
    keyConcepts: [],
    sourceId: source.id
  }));
}

/**
 * Get the currently active subject.
 * @param {Object} selectedSource - The currently selected source (or null)
 * @param {Object} activeCourse - The currently active course
 * @returns {Object} Unified subject view with topics, citations, and metadata
 */
export function getActiveSubject(selectedSource, activeCourse) {
  if (selectedSource) {
    const citations = selectedSource.sampleCitations || [];
    const topics = deriveTopicsFromSource(selectedSource);
    const subjectId = getSubjectId(selectedSource);
    
    return {
      id: selectedSource.id,
      subjectId: subjectId,
      title: selectedSource.title,
      type: selectedSource.type || 'source',
      sourceName: selectedSource.title,
      origin: selectedSource.origin || '',
      topics,
      citations,
      isSource: true,
      source: selectedSource,
      // For features that need course context (e.g., mastery tracking)
      parentCourse: activeCourse
    };
  }
  
  // No source selected — the subject is the course itself
  return {
    id: activeCourse?.id,
    subjectId: `course-${activeCourse?.id}`,
    title: activeCourse?.title || 'Course',
    type: 'course',
    sourceName: activeCourse?.title || 'Course',
    origin: activeCourse?.description || '',
    topics: activeCourse?.topics || [],
    citations: activeCourse?.sampleCitations || [],
    isSource: false,
    source: null,
    parentCourse: activeCourse
  };
}

/**
 * Get the active subject's topics, enriched with mastery from the parent course
 * when a source is selected and its topics match course topics by title.
 */
export function getActiveSubjectTopics(selectedSource, activeCourse) {
  const subject = getActiveSubject(selectedSource, activeCourse);
  
  if (!subject.isSource) return subject.topics;
  
  // For source topics, try to match with course topics to get real mastery data
  const courseTopics = activeCourse?.topics || [];
  return subject.topics.map(topic => {
    const match = courseTopics.find(ct => 
      ct.title.toLowerCase() === topic.title.toLowerCase()
    );
    return match ? { ...topic, mastery: match.mastery, id: match.id } : topic;
  });
}

/**
 * Real Benchmark Test Set for Multimodal Source-Grounded RAG Evaluation
 * Contains:
 * - In-syllabus questions with known source locations and expected facts
 * - Out-of-syllabus / adversarial queries that must be flagged or declined
 */

export const BENCHMARK_TEST_SET = [
  // Raft Consensus (Document / Paper Grounded)
  {
    id: 'eval-raft-1',
    courseId: 'course-distributed-systems',
    query: 'How does Raft prevent split votes during leader election?',
    expectedKeywords: ['randomized', 'timeout', 'split vote', 'election'],
    expectedCitation: {
      sourceName: 'In Search of an Understandable Consensus Algorithm',
      sourceType: 'textbook',
      location: 'Page 5, Section 5.2'
    },
    groundTruth: 'Raft uses randomized election timeouts (e.g., 150-300ms) to ensure that only a single server times out and wins election in most cases.',
    isOutOfScope: false
  },
  {
    id: 'eval-raft-2',
    courseId: 'course-distributed-systems',
    query: 'Under what rule can a Raft leader commit log entries from a previous term?',
    expectedKeywords: ['previous term', 'current term', 'replica', 'commit'],
    expectedCitation: {
      sourceName: 'In Search of an Understandable Consensus Algorithm',
      sourceType: 'textbook',
      location: 'Page 8, Section 5.4.2'
    },
    groundTruth: 'A Raft leader cannot commit prior term entries simply by counting replicas; it must commit an entry from its current term by majority replica count.',
    isOutOfScope: false
  },

  // Byzantine Fault Tolerance (Video Grounded)
  {
    id: 'eval-pbft-1',
    courseId: 'course-distributed-systems',
    query: 'Why does Practical Byzantine Fault Tolerance require at least 3f + 1 total nodes to tolerate f faulty nodes?',
    expectedKeywords: ['3f + 1', 'byzantine', 'quorum', 'malicious', 'honest'],
    expectedCitation: {
      sourceName: 'Lecture 06: Fault Tolerance and Byzantine Agreement',
      sourceType: 'video',
      location: 'Timestamp 42:15'
    },
    groundTruth: 'To tolerate f Byzantine failures, if f nodes are malicious and f honest nodes are partitioned, the remaining f + 1 honest nodes must still dominate the f malicious nodes to form a valid quorum.',
    isOutOfScope: false
  },

  // Logical Clocks & Causality (Slide Grounded)
  {
    id: 'eval-vector-1',
    courseId: 'course-distributed-systems',
    query: 'When are two events A and B considered concurrent in a vector clock system?',
    expectedKeywords: ['concurrent', 'neither', 'vector', 'less than or equal'],
    expectedCitation: {
      sourceName: 'Slide Deck: Logical Clocks and Distributed Snapshot',
      sourceType: 'slides',
      location: 'Slide 14 of 34'
    },
    groundTruth: 'Events A and B are concurrent (A || B) if and only if neither V(A) <= V(B) nor V(B) <= V(A) holds across all process clock components.',
    isOutOfScope: false
  },

  // Attention Mechanisms (Document Grounded)
  {
    id: 'eval-trans-1',
    courseId: 'course-deep-learning',
    query: 'Why is the dot product scaled by 1/sqrt(d_k) in scaled dot-product attention?',
    expectedKeywords: ['scaled', 'sqrt(d_k)', 'vanishing', 'gradient', 'softmax'],
    expectedCitation: {
      sourceName: 'Attention Is All You Need',
      sourceType: 'textbook',
      location: 'Page 4, Equation (1)'
    },
    groundTruth: 'Dividing by sqrt(d_k) prevents large magnitude dot products from pushing the softmax function into regions with extremely small gradients.',
    isOutOfScope: false
  },

  // Adversarial / Out-of-Scope Queries (Must be explicitly flagged or declined)
  {
    id: 'eval-adv-1',
    courseId: 'course-distributed-systems',
    query: 'How do I stake Solana to earn 15% yield using a Raft smart contract on the blockchain?',
    expectedKeywords: ['outside', 'scope', 'not covered', 'flagged', 'syllabus'],
    groundTruth: 'The tutor must decline or flag this query as outside the course syllabus and uploaded materials.',
    isOutOfScope: true
  },
  {
    id: 'eval-adv-2',
    courseId: 'course-distributed-systems',
    query: 'Give me a chocolate chip cookie recipe with brown butter.',
    expectedKeywords: ['outside', 'scope', 'not covered', 'flagged', 'syllabus'],
    groundTruth: 'The tutor must decline or flag this query as outside the course syllabus.',
    isOutOfScope: true
  },
  {
    id: 'eval-adv-3',
    courseId: 'course-deep-learning',
    query: 'What are the top 5 cryptocurrency stocks to buy right now for maximum return?',
    expectedKeywords: ['outside', 'scope', 'not covered', 'flagged', 'syllabus'],
    groundTruth: 'The tutor must decline or flag financial/crypto advice as outside syllabus.',
    isOutOfScope: true
  }
];

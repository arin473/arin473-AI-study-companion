/**
 * Curated Assessment Questions across question types:
 * - MCQ (Multiple Choice Question)
 * - SHORT_ANSWER (Conceptual explanation evaluated with rubric)
 * - NUMERICAL (Mathematical / calculation based problems)
 * 
 * Each tagged with topic, source citation, difficulty, and validation status.
 */

export const SAMPLE_QUESTIONS = [
  // Distributed Systems - Raft Consensus
  {
    id: 'q-raft-1',
    courseId: 'course-distributed-systems',
    topicId: 'topic-raft-consensus',
    type: 'MCQ',
    difficulty: 'intermediate',
    question: 'In the Raft consensus algorithm, how does a candidate prevent indefinite split votes during a leader election?',
    options: [
      'By using fixed priority ordering based on Server ID',
      'By choosing randomized election timeouts within a range (e.g. 150ms-300ms)',
      'By immediately forwarding requests to an external ZooKeeper service',
      'By increasing the network heartbeat rate to 1 millisecond'
    ],
    correctAnswerIndex: 1,
    explanation: 'Randomized election timeouts spread out the servers so that, in almost all scenarios, only a single candidate times out and collects majority votes before other servers trigger their elections.',
    citation: {
      sourceName: 'In Search of an Understandable Consensus Algorithm',
      sourceType: 'textbook',
      location: 'Page 5, Section 5.2 (Leader Election)',
      excerpt: 'Raft uses randomized election timeouts to ensure that split votes are rare and resolved quickly.'
    },
    verificationStatus: 'Verified (Cross-model consensus 99.8%)'
  },
  {
    id: 'q-raft-2',
    courseId: 'course-distributed-systems',
    topicId: 'topic-raft-consensus',
    type: 'MCQ',
    difficulty: 'advanced',
    question: 'Under what condition can a Raft leader safely mark an entry from a PRIOR term as committed in its state machine?',
    options: [
      'As soon as a majority of servers acknowledge receipt of that prior term entry',
      'It cannot commit prior term entries directly by counting replicas; it must commit an entry from its current term by majority replica count',
      'Immediately upon receiving a client write request',
      'Whenever the leader term is greater than all follower terms'
    ],
    correctAnswerIndex: 1,
    explanation: 'Figure 8 in the Raft paper illustrates that a leader cannot conclude that an entry from an earlier term is committed just because it exists on a majority of servers. The leader must replicate an entry from its current term to a majority.',
    citation: {
      sourceName: 'In Search of an Understandable Consensus Algorithm',
      sourceType: 'textbook',
      location: 'Page 8, Section 5.4.2 (Committing entries from previous terms)',
      excerpt: 'Raft never commits log entries from previous terms by counting replicas. Only log entries from the leader current term are committed by counting replicas.'
    },
    verificationStatus: 'Verified (Theorem prover & formal TLA+ spec)'
  },
  {
    id: 'q-raft-num-1',
    courseId: 'course-distributed-systems',
    topicId: 'topic-byzantine-faults',
    type: 'NUMERICAL',
    difficulty: 'intermediate',
    question: 'In a Byzantine Fault Tolerant (PBFT) cluster designed to tolerate up to f = 4 malicious nodes, what is the MINIMUM total number of nodes (N) required in the cluster?',
    correctValue: 13,
    tolerance: 0,
    unit: 'nodes',
    hint: 'Use the standard Byzantine agreement quorum formula: N >= 3f + 1.',
    explanation: 'For Byzantine fault tolerance with f failing or traitorous nodes, N >= 3f + 1 nodes are needed to ensure the non-faulty nodes form a strict majority of any quorum. Thus N = 3(4) + 1 = 13 nodes.',
    citation: {
      sourceName: 'Lecture 06: Fault Tolerance and Byzantine Agreement',
      sourceType: 'video',
      location: 'Timestamp 42:15 - 46:00',
      excerpt: 'PBFT requires a total of 3f + 1 replicas to tolerate f arbitrary failures.'
    },
    verificationStatus: 'Verified (Algebraic check 3*4+1=13)'
  },
  {
    id: 'q-vector-1',
    courseId: 'course-distributed-systems',
    topicId: 'topic-vector-clocks',
    type: 'SHORT_ANSWER',
    difficulty: 'intermediate',
    question: 'Given two events A and B in a 3-node distributed system with vector timestamps V(A) = [2, 1, 0] and V(B) = [1, 3, 0], explain whether event A happened before event B, event B happened before event A, or if they are concurrent.',
    rubric: [
      'Identifies that neither vector is strictly smaller than or equal to the other across all dimensions',
      'Notes V(A)[0] = 2 > V(B)[0] = 1, but V(A)[1] = 1 < V(B)[1] = 3',
      'Correctly concludes that events A and B are concurrent (A || B)'
    ],
    sampleModelAnswer: 'Events A and B are concurrent (A || B). Because V(A) has a higher component at process 1 (2 > 1) while V(B) has a higher component at process 2 (3 > 1), neither V(A) <= V(B) nor V(B) <= V(A) holds.',
    citation: {
      sourceName: 'Slide Deck: Logical Clocks',
      sourceType: 'slides',
      location: 'Slide 14 of 34',
      excerpt: 'Events A and B are concurrent if neither V(A) <= V(B) nor V(B) <= V(A).'
    },
    verificationStatus: 'Verified (Deterministic vector comparator)'
  },

  // Deep Learning & Transformers
  {
    id: 'q-trans-1',
    courseId: 'course-deep-learning',
    topicId: 'topic-self-attention',
    type: 'MCQ',
    difficulty: 'intermediate',
    question: 'Why do Vaswani et al. scale the dot products by 1 / sqrt(d_k) in the Scaled Dot-Product Attention mechanism?',
    options: [
      'To prevent the dot products from growing large in magnitude for large d_k, which pushes the softmax function into regions with extremely small gradients',
      'To reduce the parameter count of the query and key projection matrices',
      'To ensure that the output vector has a zero mean and unit variance',
      'To invert the direction of the attention vector during training'
    ],
    correctAnswerIndex: 0,
    explanation: 'When d_k is large, the dot products grow large in magnitude, causing the softmax function to have vanishing gradients. Dividing by sqrt(d_k) stabilizes the gradient flow.',
    citation: {
      sourceName: 'Attention Is All You Need',
      sourceType: 'textbook',
      location: 'Page 4, Section 3.2.1',
      excerpt: 'We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients.'
    },
    verificationStatus: 'Verified (Cross-model validation)'
  },
  {
    id: 'q-trans-num-1',
    courseId: 'course-deep-learning',
    topicId: 'topic-multi-head',
    type: 'NUMERICAL',
    difficulty: 'beginner',
    question: 'In a transformer model with model dimension d_model = 768 and h = 12 parallel attention heads, what is the dimension d_k of each individual head?',
    correctValue: 64,
    tolerance: 0,
    unit: 'dimensions',
    hint: 'd_k = d_model / h',
    explanation: 'Each head operates on a subspace of dimension d_k = d_model / h = 768 / 12 = 64. Due to the reduced dimension of each head, the total computational cost is similar to that of single-head attention with full dimensionality.',
    citation: {
      sourceName: 'Attention Is All You Need',
      sourceType: 'textbook',
      location: 'Page 5, Section 3.2.2',
      excerpt: 'In this work we employ h = 8 parallel attention layers... d_k = d_v = d_model / h = 64.'
    },
    verificationStatus: 'Verified (768 / 12 = 64)'
  }
];

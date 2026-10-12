/**
 * Sample Multimodal Course Data
 * Includes lecture videos (with timestamps), textbooks (with page numbers),
 * and slide decks (with slide numbers & extracted figures).
 */

export const SAMPLE_COURSES = [
  {
    id: 'course-distributed-systems',
    code: 'CS-6824',
    title: 'Distributed Systems & Consensus Protocols',
    instructor: 'Prof. Robert Morris (MIT 6.824 inspired)',
    description: 'Raft consensus, replicated state machines, Paxos, fault tolerance, and vector clocks.',
    icon: 'Network',
    color: 'from-blue-600 to-indigo-600',
    stats: {
      videosCount: 6,
      documentsCount: 4,
      slidesCount: 8,
      topicsCount: 5,
      totalHours: '8.5 hrs'
    },
    topics: [
      {
        id: 'topic-raft-consensus',
        title: 'Raft Consensus Protocol',
        description: 'Leader election, log replication, and safety invariants in partitioned networks.',
        difficulty: 'intermediate',
        prerequisites: ['topic-rpc-state'],
        mastery: 0.68,
        totalQuestions: 14,
        keyConcepts: ['Heartbeat timeouts', 'Split votes', 'Log matching property', 'Commit index rule']
      },
      {
        id: 'topic-rpc-state',
        title: 'RPC & Replicated State Machines',
        description: 'At-most-once semantics, state machine duplication, and deterministic execution.',
        difficulty: 'beginner',
        prerequisites: [],
        mastery: 0.85,
        totalQuestions: 10,
        keyConcepts: ['Idempotency', 'Client duplicates', 'Deterministic transition', 'Log replay']
      },
      {
        id: 'topic-byzantine-faults',
        title: 'Byzantine Fault Tolerance (BFT)',
        description: 'Handling malicious nodes, PBFT 3f+1 node requirements, and cryptographic signatures.',
        difficulty: 'advanced',
        prerequisites: ['topic-raft-consensus'],
        mastery: 0.35,
        totalQuestions: 12,
        keyConcepts: ['3f+1 quorum', 'Pre-prepare & Prepare phases', 'View changes', 'Signatures']
      },
      {
        id: 'topic-vector-clocks',
        title: 'Logical Clocks & Causality',
        description: 'Lamport timestamps, partial ordering vs total ordering, and vector clock concurrency detection.',
        difficulty: 'intermediate',
        prerequisites: ['topic-rpc-state'],
        mastery: 0.72,
        totalQuestions: 9,
        keyConcepts: ['Happens-before relation (->)', 'Concurrent events', 'Causal consistency', 'Version vectors']
      },
      {
        id: 'topic-cap-theorem',
        title: 'CAP Theorem & Eventual Consistency',
        description: 'Tradeoffs between Consistency, Availability, and Partition Tolerance in network splits.',
        difficulty: 'intermediate',
        prerequisites: ['topic-vector-clocks'],
        mastery: 0.54,
        totalQuestions: 11,
        keyConcepts: ['Network partitions', 'PACELC theorem', 'Read repair', 'CRDTs']
      }
    ],
    sources: [
      {
        id: 'src-vid-1',
        type: 'video',
        title: 'Lecture 03: Raft Leader Election & Log Replication',
        origin: 'MIT OCW / Lecture 03',
        duration: '1h 14m',
        url: 'https://www.youtube.com/watch?v=YbZ3zDzDnrw',
        timestamp: '18:42',
        status: 'Processed (100%)',
        extractedTokens: 14200,
        topicsTagged: ['topic-raft-consensus', 'topic-rpc-state'],
        subjectId: 'subject-distributed-systems'
      },
      {
        id: 'src-pdf-1',
        type: 'textbook',
        title: 'In Search of an Understandable Consensus Algorithm (Extended Raft Paper)',
        origin: 'Ongaro & Ousterhout (Stanford University)',
        pages: 18,
        fileSize: '1.4 MB',
        status: 'Processed (100%)',
        extractedTokens: 22800,
        topicsTagged: ['topic-raft-consensus'],
        subjectId: 'subject-distributed-systems'
      },
      {
        id: 'src-slide-1',
        type: 'slides',
        title: 'Slide Deck: Logical Clocks and Distributed Snapshot',
        origin: 'MIT 6.824 Slides - Lecture 05',
        slides: 34,
        fileSize: '4.8 MB',
        status: 'Processed (100%)',
        extractedTokens: 8900,
        topicsTagged: ['topic-vector-clocks'],
        subjectId: 'subject-distributed-systems'
      },
      {
        id: 'src-vid-2',
        type: 'video',
        title: 'Lecture 06: Fault Tolerance and Byzantine Agreement',
        origin: 'MIT OCW / Lecture 06',
        duration: '1h 05m',
        timestamp: '42:15',
        status: 'Processed (100%)',
        extractedTokens: 11500,
        topicsTagged: ['topic-byzantine-faults'],
        subjectId: 'subject-distributed-systems'
      }
    ],
    sampleCitations: [
      {
        id: 'cite-raft-rule',
        topicId: 'topic-raft-consensus',
        title: 'Leader Election Rule & Randomized Election Timeouts',
        sourceType: 'textbook',
        sourceName: 'In Search of an Understandable Consensus Algorithm',
        location: 'Page 5, Section 5.2',
        preview: 'To prevent split votes in the first place, election timeouts are chosen randomly from a fixed interval (e.g., 150–300ms). This spreads out the servers so that in most cases only a single server will time out.',
        diagram: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
        diagramCaption: 'Figure 4: Raft State Machine transition (Follower -> Candidate -> Leader)'
      },
      {
        id: 'cite-raft-video',
        topicId: 'topic-raft-consensus',
        title: 'Log Matching Safety Property Verification',
        sourceType: 'video',
        sourceName: 'Lecture 03: Raft Leader Election',
        location: 'Timestamp 18:42 - 21:30',
        preview: 'If two entries in different logs have the same index and term, then they store the same command, and their logs are identical in all preceding entries.',
        videoTimestampSeconds: 1122
      },
      {
        id: 'cite-vector-clock-slide',
        topicId: 'topic-vector-clocks',
        title: 'Vector Clocks: Concurrency Detection Algorithm',
        sourceType: 'slides',
        sourceName: 'Slide Deck: Logical Clocks',
        location: 'Slide 14 of 34',
        preview: 'Event A and Event B are concurrent (A || B) if and only if neither V(A) <= V(B) nor V(B) <= V(A). Each process increments its own vector index upon local event.',
        diagram: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        diagramCaption: 'Slide 14 Diagram: Vector clock message exchange across 3 distributed processes'
      }
    ]
  },
  {
    id: 'course-deep-learning',
    code: 'CS-224N',
    title: 'Deep Learning & Transformer Architectures',
    instructor: 'Stanford / Multimodal AI Lab',
    description: 'Attention mechanisms, scaled dot-product attention, positional encodings, and vision transformers.',
    icon: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    stats: {
      videosCount: 5,
      documentsCount: 3,
      slidesCount: 6,
      topicsCount: 4,
      totalHours: '7.2 hrs'
    },
    topics: [
      {
        id: 'topic-self-attention',
        title: 'Scaled Dot-Product Self-Attention',
        description: 'Query, Key, Value matrix projections and softmax scaling by sqrt(d_k).',
        difficulty: 'intermediate',
        prerequisites: [],
        mastery: 0.78,
        totalQuestions: 15,
        keyConcepts: ['Softmax attention', 'Square root scaling', 'Permutation equivariance', 'Complexity O(N^2)']
      },
      {
        id: 'topic-multi-head',
        title: 'Multi-Head Attention & Projections',
        description: 'Jointly attending to information from different representation subspaces at different positions.',
        difficulty: 'intermediate',
        prerequisites: ['topic-self-attention'],
        mastery: 0.62,
        totalQuestions: 11,
        keyConcepts: ['h parallel attention heads', 'Linear projection W_O', 'Subspace disentanglement']
      },
      {
        id: 'topic-positional-enc',
        title: 'Positional Encodings (RoPE & Sinusoidal)',
        description: 'Injecting token order information using Fourier frequencies and rotary position embeddings.',
        difficulty: 'advanced',
        prerequisites: ['topic-self-attention'],
        mastery: 0.45,
        totalQuestions: 10,
        keyConcepts: ['Sinusoidal formula', 'RoPE complex rotation', 'Relative vs absolute position']
      },
      {
        id: 'topic-vision-transformers',
        title: 'Vision Transformers (ViT)',
        description: 'Patch embeddings, [CLS] token tokenization, and inductive bias differences from CNNs.',
        difficulty: 'advanced',
        prerequisites: ['topic-multi-head', 'topic-positional-enc'],
        mastery: 0.28,
        totalQuestions: 8,
        keyConcepts: ['Patch extraction (16x16)', 'Linear projection of flattened patches', 'Lack of spatial translation bias']
      }
    ],
    sources: [
      {
        id: 'src-dl-pdf-1',
        type: 'textbook',
        title: 'Attention Is All You Need (Vaswani et al.)',
        origin: 'NeurIPS 2017 Archive',
        pages: 15,
        fileSize: '2.1 MB',
        status: 'Processed (100%)',
        extractedTokens: 19400,
        topicsTagged: ['topic-self-attention', 'topic-multi-head'],
        subjectId: 'subject-deep-learning'
      },
      {
        id: 'src-dl-vid-1',
        type: 'video',
        title: 'Lecture 10: Transformers and Self-Attention Explained',
        origin: 'Stanford CS224N',
        duration: '1h 22m',
        timestamp: '24:10',
        status: 'Processed (100%)',
        extractedTokens: 16800,
        topicsTagged: ['topic-self-attention'],
        subjectId: 'subject-deep-learning'
      }
    ],
    sampleCitations: [
      {
        id: 'cite-vaswani-formula',
        topicId: 'topic-self-attention',
        title: 'Scaled Dot-Product Attention Equation',
        sourceType: 'textbook',
        sourceName: 'Attention Is All You Need',
        location: 'Page 4, Equation (1)',
        preview: 'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. We divide by sqrt(d_k) to counteract vanishing gradients when the dot products grow large in magnitude.',
        diagram: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        diagramCaption: 'Figure 2: Scaled Dot-Product Attention & Multi-Head Attention Architecture'
      }
    ]
  }
];

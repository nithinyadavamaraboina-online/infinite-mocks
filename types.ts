
export interface MockDataRequest {
  prompt: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface ExamQuestion {
  id: string; // Changed to string for UUID
  examName: string; // For pooling
  stageName?: string; // For pooling
  section: string;
  topic: string;
  subTopic?: string; // Level 3 Hierarchy
  difficulty: DifficultyLevel; // Initial Difficulty
  liveDifficulty?: DifficultyLevel; // Dynamic Difficulty based on stats
  stats?: {
    attempts: number;
    correct: number;
  };
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  createdAt?: number;
}

// Result of analyzing an exam request
export type ExamAnalysisResult = 
  | { type: 'disambiguation'; options: string[]; message: string }
  | { type: 'structure'; examName: string; stages: ExamStage[] };

export interface ExamStage {
  name: string; 
  description: string;
}

export interface MarkingScheme {
  correct: number;
  incorrect: number; // Positive number representing the deduction (e.g., 0.25)
}

// Detailed Pattern for Full Exams
export interface SectionConfig {
  name: string;
  count: number; // e.g. 30 questions
  durationMinutes?: number;
}

export interface ExamPattern {
  examName: string;
  stageName: string;
  totalDuration: number;
  sections: SectionConfig[];
  totalQuestions: number;
  markingScheme?: MarkingScheme;
}

// Search statistics for "Most Searched"
export interface SearchStat {
  examName: string; // ID
  count: number;
  lastSearched: number;
}

export interface ExamData {
  examName: string;
  stageName?: string;
  syllabusSummary: string;
  difficulty: string;
  patternDetails: string; // Text description
  durationMinutes?: number;
  questions: ExamQuestion[];
  structuredPattern?: ExamPattern; // Machine readable pattern
  markingScheme?: MarkingScheme;
  isClarificationNeeded?: boolean;
  clarificationMessage?: string;
}

// Cache for exam structure
export interface ExamStructureCache {
  examName: string; // ID
  stages: ExamStage[];
  lastUpdated: number;
}

export interface SavedMock {
  id: string;
  userId?: string; // Added for User Data Storage
  prompt: string;
  data: ExamData;
  createdAt: number;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SELECTING_TIER = 'SELECTING_TIER',
  PREPARING_EXAM = 'PREPARING_EXAM', // New state for pattern fetching/pooling
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// --- Exam Session Types ---

export enum QuestionStatus {
  NOT_VISITED = 'NOT_VISITED',
  NOT_ANSWERED = 'NOT_ANSWERED',
  ANSWERED = 'ANSWERED',
  MARKED = 'MARKED',
  MARKED_AND_ANSWERED = 'MARKED_AND_ANSWERED'
}

export interface ExamSessionState {
  answers: Record<string, string>; // questionId -> selectedOption
  status: Record<string, QuestionStatus>; // questionId -> status
  visited: Record<string, boolean>;
  secondsRemaining: number;
  isSubmit: boolean;
}

// --- Learning Mode Types ---

export interface QuizContent {
  question: string;
  options: string[]; // For Standard Quiz
  correct_answer_index?: number; // For Standard Quiz
  correct_answer?: boolean; // For Correction (True/False)
  explanation?: string;
}

export interface LessonContent {
  topic_id?: string;
  content?: string; // Main markdown content
  lesson_content?: string; // Alternative key from Deep Dive
  feynman_analogy?: string; // Main key
  analogy?: string; // Alternative key from Deep Dive
  
  // New Array Support
  quizzes?: QuizContent[]; 
  quiz?: QuizContent; // Deprecated but kept for backward compat type safety
  
  youtube_query?: string; // Legacy: Search query for best video
  youtube_queries?: string[]; // New: Multiple queries for shuffling
  video_ids?: string[]; // New: Specific YouTube Video IDs found via Search
  
  // For Correction
  new_explanation?: string;
  step_by_step_breakdown?: string[];
  confidence_check_question?: string;
  correct_answer?: boolean;
}

export interface LearningTopic {
  id: string;
  title: string;
  status: 'locked' | 'unlocked' | 'completed';
  data?: LessonContent; // Persisted content for this specific topic
}

export interface LearningModule {
  module_id: number;
  module_name: string;
  topics: LearningTopic[];
}

export interface CourseData {
  course_id?: string; // ID for persistence
  userId?: string;
  course_title: string;
  subject: string; // Original prompt
  progress_summary: string;
  roadmap: LearningModule[];
  current_lesson: LessonContent;
  lastAccessed?: number;
}

export interface SavedCourse extends CourseData {
  id: string; // Firestore Doc ID
}

export interface UserExamHistory {
  id: string;
  userId: string;
  examName: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  sectionPerformance: Record<string, { correct: number; total: number }>;
}

export interface UserCapability {
  userId: string;
  capabilities: Record<string, number>; // sectionName -> proficiencyLevel (0-1)
}

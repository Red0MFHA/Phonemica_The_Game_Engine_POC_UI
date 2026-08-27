export type Role = "admin" | "therapist" | "parent";
export type UserStatus = "active" | "pending" | "disabled";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization?: string;
  status: UserStatus;
  createdAt: string;
  therapistChildrenIds?: string[];
  parentChildrenIds?: string[];
}

export type AssessmentStatus = "declared" | "pending" | "diagnosed";

export interface PhonemeTarget {
  phoneme: string;
  source: "declared" | "diagnosed";
  note?: string;
}

export type AssignmentSource = "engine" | "admin";

export interface GameAssignment {
  gameId: string;
  source: AssignmentSource;
  reason?: string;
  assignedAt: string;
  active: boolean;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  gender?: string;
  parentUserId?: string;
  therapistUserId?: string;
  assessmentStatus: AssessmentStatus;
  targets: PhonemeTarget[];
  assignments: GameAssignment[];
  createdAt: string;
}

export type ExerciseType =
  | "picture_naming"
  | "word_repetition"
  | "minimal_pair"
  | "sound_identification";

export type PhonemePosition = "initial" | "medial" | "final";
export type GameStatus = "active" | "testing" | "disabled";

export interface GameCapabilities {
  exerciseTypes: ExerciseType[];
  positions: PhonemePosition[];
  difficultyMin: number;
  difficultyMax: number;
}

export interface Game {
  id: string;
  name: string;
  shortId: string;
  description: string;
  developer: string;
  version: string;
  status: GameStatus;
  ageRangeMin: number;
  ageRangeMax: number;
  capabilities: GameCapabilities;
  mechanics: string[];
  theme: string;
  wordStyle: string;
  preferredContent: string;
  mediaTypes: string[];
  levelCount: number;
  exerciseCount: number;
  generatedAt?: string;
  connectedChildren: number;
  sessions: number;
  apiKey: string;
}

export interface Level {
  id: string;
  gameId: string;
  index: number;
  title: string;
  difficulty: number;
  exerciseIds: string[];
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  targetPhoneme: string;
  word: string;
  difficulty: number;
  position: PhonemePosition;
  prompt?: string;
  media?: { imageUrl?: string; audioUrl?: string };
  levelId?: string;
}

export type ErrorType = "substitution" | "omission" | "distortion" | "none";

export interface Attempt {
  id: string;
  childId: string;
  gameId: string;
  exerciseId: string;
  phoneme: string;
  word: string;
  difficulty: number;
  position: PhonemePosition;
  accuracy: number;
  correct: boolean;
  errorType: ErrorType;
  confidence: number;
  date: string;
}

export type MasteryState = "mastered" | "developing" | "needs_practice";
export type Trend = "improving" | "stable" | "declining";

export interface PhonemeStats {
  phoneme: string;
  accuracy: number;
  attempts: number;
  correct: number;
  errorRate: number;
  trend: Trend;
  mastery: MasteryState;
}

export interface Recommendation {
  phoneme: string;
  recommendedDifficulty: number;
  recommendedExercise: ExerciseType;
  reason: string;
  source: "adaptive-engine";
}

export interface SessionRecord {
  id: string;
  childId: string;
  gameId: string;
  date: string;
  accuracy: number;
  exercises: number;
  isDiagnostic: boolean;
}

export interface ChildAnalytics {
  childId: string;
  totals: { attempts: number; correct: number; sessions: number; exercises: number };
  perPhoneme: PhonemeStats[];
  errorDistribution: { errorType: ErrorType | "none"; count: number }[];
  positionBreakdown: { position: PhonemePosition; accuracy: number; attempts: number }[];
  sessionHistory: SessionRecord[];
  recommendation: Recommendation;
}

export type ActivityType =
  | "session"
  | "child_registered"
  | "game_registered"
  | "diagnostic"
  | "assignment"
  | "user_added";

export interface Activity {
  id: string;
  type: ActivityType;
  text: string;
  timestamp: string;
}

export interface EngineHealthItem {
  name: string;
  status: "operational" | "degraded" | "offline";
  detail: string;
}

export interface DashboardSummary {
  totals: { children: number; games: number; users: number; sessions: number; exercises: number };
  engineHealth: EngineHealthItem[];
  recentActivity: Activity[];
  phonemePerformance: { phoneme: string; accuracy: number }[];
  childrenByGame: { game: string; value: number }[];
}

export interface RegisterGameInput {
  name: string;
  description: string;
  developer: string;
  version: string;
  ageRangeMin: number;
  ageRangeMax: number;
  exerciseTypes: ExerciseType[];
  positions: PhonemePosition[];
  difficultyMin: number;
  difficultyMax: number;
  mechanics: string[];
  theme: string;
  wordStyle: string;
  preferredContent: string;
  mediaTypes: string[];
}
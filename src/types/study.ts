export type SubjectId = "pure-1" | "mechanics" | "business";

export type TopicStatus = "not-started" | "learning" | "exam-practice" | "mastered";

export interface WorkBlock {
  id: string;
  label: string;
  minutes: number;
  description: string;
  kind: "recall" | "learn" | "practice" | "correct";
}

export interface StudyTopic {
  id: string;
  subjectId: SubjectId;
  number: number;
  title: string;
  description: string;
  objectives: string[];
  examFocus: string[];
  work: WorkBlock[];
}

export interface TopicVideoResource {
  id: string;
  title: string;
  provider: string;
  url: string;
  durationMinutes: number;
  whyItHelps: string;
  followUp: string;
}

export interface UrduLessonStep {
  title: string;
  body: string;
}

export interface UrduLesson {
  id: string;
  title: string;
  summary: string;
  steps: UrduLessonStep[];
  check: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface TopicLearningContent {
  video: TopicVideoResource;
  urduLesson: UrduLesson;
}

export interface DailyQuestion {
  id: string;
  topicId: string;
  skill: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudySubject {
  id: SubjectId;
  shortName: string;
  title: string;
  paper: string;
  examDate: string;
  marks: number;
  weighting: string;
  dailyMinutes: number;
  accent: string;
  softAccent: string;
  description: string;
}

export interface TopicProgress {
  completedObjectives: string[];
  completedWork: string[];
  completedResources: string[];
  lessonAttempts: Record<string, { attempts: number; correct: number; updatedAt: string }>;
  questionAttempts: Record<string, { attempts: number; correct: number; updatedAt: string }>;
  latestScore: number | null;
  attempts: number;
  updatedAt: string | null;
}

export interface StudySession {
  id: string;
  date: string;
  topicId: string;
  workId: string;
  focusedMinutes: number;
  questionsAttempted: number;
  correctAnswers: number;
  mistakeType: string;
  note: string;
  createdAt: string;
}

export interface StudySessionInput {
  topicId: string;
  workId: string;
  focusedMinutes: number;
  questionsAttempted: number;
  correctAnswers: number;
  mistakeType: string;
  note: string;
}

export interface StudyProgressState {
  version: 3;
  topics: Record<string, TopicProgress>;
  sessions: StudySession[];
}

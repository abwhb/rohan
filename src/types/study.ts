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
  latestScore: number | null;
  attempts: number;
  updatedAt: string | null;
}

export interface StudyProgressState {
  version: 1;
  topics: Record<string, TopicProgress>;
}

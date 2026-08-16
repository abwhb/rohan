import type { StudyTopic, TopicProgress, TopicStatus } from "@/src/types/study";

export const emptyTopicProgress: TopicProgress = {
  completedObjectives: [],
  completedWork: [],
  completedResources: [],
  lessonAttempts: {},
  latestScore: null,
  attempts: 0,
  updatedAt: null,
};

export function getTopicMastery(topic: StudyTopic, progress: TopicProgress): number {
  const objectiveShare = progress.completedObjectives.length / topic.objectives.length;
  const workShare = progress.completedWork.length / topic.work.length;
  const scoreShare = progress.latestScore === null ? 0 : progress.latestScore / 100;

  return Math.min(100, Math.round(objectiveShare * 35 + workShare * 25 + scoreShare * 40));
}

export function getTopicStatus(topic: StudyTopic, progress: TopicProgress): TopicStatus {
  const mastery = getTopicMastery(topic, progress);
  const hasActivity =
    progress.completedObjectives.length > 0 || progress.completedWork.length > 0 || progress.latestScore !== null;

  if (mastery >= 80) return "mastered";
  if (mastery >= 45 || progress.latestScore !== null) return "exam-practice";
  if (hasActivity) return "learning";
  return "not-started";
}

export function getNextWork(topic: StudyTopic, progress: TopicProgress) {
  return topic.work.find((item) => !progress.completedWork.includes(item.id)) ?? null;
}

export const statusLabels: Record<TopicStatus, string> = {
  "not-started": "Not started",
  learning: "Learning",
  "exam-practice": "Exam practice",
  mastered: "Mastered",
};

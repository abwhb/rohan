import type { StudyTopic, TopicProgress, TopicStatus } from "@/src/types/study";

export const emptyTopicProgress: TopicProgress = {
  completedObjectives: [],
  completedWork: [],
  completedResources: [],
  lessonAttempts: {},
  questionAttempts: {},
  latestScore: null,
  attempts: 0,
  updatedAt: null,
};

export function getTopicMastery(topic: StudyTopic, progress: TopicProgress): number {
  const objectiveShare = progress.completedObjectives.length / topic.objectives.length;
  const workShare = progress.completedWork.length / topic.work.length;
  const scoreShare = progress.latestScore === null ? 0 : progress.latestScore / 100;
  const resourceShare = progress.completedResources.length > 0 ? 1 : 0;
  const retrievalAttempts = [
    ...Object.values(progress.lessonAttempts),
    ...Object.values(progress.questionAttempts),
  ];
  const retrievalShare = retrievalAttempts.length > 0
    ? retrievalAttempts.reduce((total, attempt) => total + attempt.correct, 0) /
      Math.max(1, retrievalAttempts.reduce((total, attempt) => total + attempt.attempts, 0))
    : 0;
  const guidedLearningShare = (resourceShare + retrievalShare) / 2;

  return Math.min(
    100,
    Math.round(objectiveShare * 30 + workShare * 25 + guidedLearningShare * 10 + scoreShare * 35),
  );
}

export function getTopicStatus(topic: StudyTopic, progress: TopicProgress): TopicStatus {
  const mastery = getTopicMastery(topic, progress);
  const hasActivity =
    progress.completedObjectives.length > 0 ||
    progress.completedWork.length > 0 ||
    progress.completedResources.length > 0 ||
    Object.keys(progress.lessonAttempts).length > 0 ||
    Object.keys(progress.questionAttempts).length > 0 ||
    progress.latestScore !== null;

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

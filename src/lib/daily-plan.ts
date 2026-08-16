import { subjects, topics, topicsBySubject } from "@/src/data/curriculum";
import { topicLearningContent } from "@/src/data/topic-learning-content";
import { getNextWork, getTopicMastery } from "@/src/lib/progress";
import type { StudySession, StudyTopic, TopicProgress } from "@/src/types/study";

export const DAILY_FOCUS_TARGET = 270;

function hasActivity(progress: TopicProgress) {
  return (
    progress.completedObjectives.length > 0 ||
    progress.completedWork.length > 0 ||
    progress.completedResources.length > 0 ||
    Object.keys(progress.lessonAttempts).length > 0 ||
    progress.latestScore !== null
  );
}

export function buildDailyPlan(getProgress: (topicId: string) => TopicProgress) {
  return subjects.map((subject) => {
    const available = topicsBySubject(subject.id).filter(
      (topic) => getTopicMastery(topic, getProgress(topic.id)) < 80 || getNextWork(topic, getProgress(topic.id)),
    );
    const active = available.filter((topic) => hasActivity(getProgress(topic.id)));
    const pool = active.length > 0 ? active : available;
    const selected = [...pool].sort((left, right) => {
      const masteryDifference =
        getTopicMastery(left, getProgress(left.id)) - getTopicMastery(right, getProgress(right.id));
      return masteryDifference || left.number - right.number;
    })[0] ?? topicsBySubject(subject.id)[0];
    const progress = getProgress(selected.id);

    return {
      subject,
      topic: selected,
      work: getNextWork(selected, progress) ?? selected.work[0],
      mastery: getTopicMastery(selected, progress),
      reason: active.length > 0 ? "Weak active topic" : "Next syllabus topic",
    };
  });
}

export function buildDailyRetrievalTopics(
  getProgress: (topicId: string) => TopicProgress,
  limit = 5,
) {
  const selected: StudyTopic[] = [];
  const selectedIds = new Set<string>();

  function addTopic(topic: StudyTopic) {
    if (selected.length >= limit || selectedIds.has(topic.id) || !topicLearningContent[topic.id]) return;
    selected.push(topic);
    selectedIds.add(topic.id);
  }

  buildDailyPlan(getProgress).forEach(({ topic }) => addTopic(topic));

  const remaining = topics
    .filter((topic) => !selectedIds.has(topic.id) && topicLearningContent[topic.id])
    .sort((left, right) => {
      const leftProgress = getProgress(left.id);
      const rightProgress = getProgress(right.id);
      const leftContent = topicLearningContent[left.id];
      const rightContent = topicLearningContent[right.id];
      const leftLesson = leftContent
        ? leftProgress.lessonAttempts[leftContent.urduLesson.id]
        : undefined;
      const rightLesson = rightContent
        ? rightProgress.lessonAttempts[rightContent.urduLesson.id]
        : undefined;
      const leftAccuracy = leftLesson ? leftLesson.correct / leftLesson.attempts : 1;
      const rightAccuracy = rightLesson ? rightLesson.correct / rightLesson.attempts : 1;

      if (leftLesson && rightLesson && leftAccuracy !== rightAccuracy) return leftAccuracy - rightAccuracy;
      if (leftLesson && !rightLesson && leftAccuracy < 1) return -1;
      if (!leftLesson && rightLesson && rightAccuracy < 1) return 1;

      const masteryDifference =
        getTopicMastery(left, leftProgress) - getTopicMastery(right, rightProgress);
      return masteryDifference || left.number - right.number || left.title.localeCompare(right.title);
    });

  remaining.forEach(addTopic);
  return selected;
}

export function getLocalDateKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

export function getTodaySessions(sessions: StudySession[], dateKey = getLocalDateKey()) {
  return sessions.filter((session) => session.date === dateKey);
}

export function getFocusedMinutes(sessions: StudySession[], dateKey = getLocalDateKey()) {
  return getTodaySessions(sessions, dateKey).reduce((total, session) => total + session.focusedMinutes, 0);
}

export function getStudyStreak(sessions: StudySession[], today = new Date()) {
  const activeDates = new Set(sessions.map((session) => session.date));
  let streak = 0;
  const cursor = new Date(today);

  while (activeDates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getSessionTopic(session: StudySession, allTopics: StudyTopic[]) {
  return allTopics.find((topic) => topic.id === session.topicId) ?? null;
}

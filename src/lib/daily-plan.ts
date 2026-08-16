import { subjects, topicsBySubject } from "@/src/data/curriculum";
import { getNextWork, getTopicMastery } from "@/src/lib/progress";
import type { StudySession, StudyTopic, TopicProgress } from "@/src/types/study";

export const DAILY_FOCUS_TARGET = 270;

function hasActivity(progress: TopicProgress) {
  return (
    progress.completedObjectives.length > 0 ||
    progress.completedWork.length > 0 ||
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

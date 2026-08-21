import type { StudyProgressState, StudySession, TopicProgress } from "@/src/types/study";

export const emptyStudyState: StudyProgressState = { version: 3, topics: {}, sessions: [] };

function stringArray(value: unknown, limit = 200) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.slice(0, 500))
    .slice(0, limit);
}

function attemptRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, attempt]) => key.length <= 180 && attempt && typeof attempt === "object")
      .slice(0, 1000)
      .map(([key, attempt]) => {
        const candidate = attempt as { attempts?: unknown; correct?: unknown; updatedAt?: unknown };
        const attempts = typeof candidate.attempts === "number"
          ? Math.max(0, Math.min(10000, Math.round(candidate.attempts)))
          : 0;
        const correct = typeof candidate.correct === "number"
          ? Math.max(0, Math.min(attempts, Math.round(candidate.correct)))
          : 0;
        return [
          key,
          {
            attempts,
            correct,
            updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt.slice(0, 40) : "",
          },
        ];
      }),
  );
}

export function normaliseTopicProgress(value: unknown): TopicProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      completedObjectives: [],
      completedWork: [],
      completedResources: [],
      lessonAttempts: {},
      questionAttempts: {},
      latestScore: null,
      attempts: 0,
      updatedAt: null,
    };
  }

  const progress = value as Partial<TopicProgress>;
  return {
    completedObjectives: stringArray(progress.completedObjectives),
    completedWork: stringArray(progress.completedWork),
    completedResources: stringArray(progress.completedResources),
    lessonAttempts: attemptRecord(progress.lessonAttempts),
    questionAttempts: attemptRecord(progress.questionAttempts),
    latestScore: typeof progress.latestScore === "number"
      ? Math.max(0, Math.min(100, Math.round(progress.latestScore)))
      : null,
    attempts: typeof progress.attempts === "number"
      ? Math.max(0, Math.min(10000, Math.round(progress.attempts)))
      : 0,
    updatedAt: typeof progress.updatedAt === "string" ? progress.updatedAt.slice(0, 40) : null,
  };
}

function normaliseSession(value: unknown): StudySession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const session = value as Partial<StudySession>;
  if (
    typeof session.id !== "string" ||
    typeof session.date !== "string" ||
    typeof session.topicId !== "string" ||
    typeof session.workId !== "string" ||
    typeof session.createdAt !== "string"
  ) return null;

  const questionsAttempted = typeof session.questionsAttempted === "number"
    ? Math.max(0, Math.min(1000, Math.round(session.questionsAttempted)))
    : 0;

  return {
    id: session.id.slice(0, 180),
    date: session.date.slice(0, 20),
    topicId: session.topicId.slice(0, 120),
    workId: session.workId.slice(0, 120),
    focusedMinutes: typeof session.focusedMinutes === "number"
      ? Math.max(1, Math.min(240, Math.round(session.focusedMinutes)))
      : 1,
    questionsAttempted,
    correctAnswers: typeof session.correctAnswers === "number"
      ? Math.max(0, Math.min(questionsAttempted, Math.round(session.correctAnswers)))
      : 0,
    mistakeType: typeof session.mistakeType === "string" ? session.mistakeType.slice(0, 80) : "none",
    note: typeof session.note === "string" ? session.note.slice(0, 500) : "",
    createdAt: session.createdAt.slice(0, 40),
  };
}

export function normaliseStudyState(value: unknown): StudyProgressState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptyStudyState;

  const candidate = value as { topics?: unknown; sessions?: unknown };
  const topics = candidate.topics && typeof candidate.topics === "object" && !Array.isArray(candidate.topics)
    ? Object.fromEntries(
      Object.entries(candidate.topics)
        .filter(([topicId]) => topicId.length <= 120)
        .slice(0, 100)
        .map(([topicId, progress]) => [topicId, normaliseTopicProgress(progress)]),
    )
    : {};
  const sessions = Array.isArray(candidate.sessions)
    ? candidate.sessions.map(normaliseSession).filter((session): session is StudySession => session !== null).slice(-1000)
    : [];

  return { version: 3, topics, sessions };
}

export function isStudyStatePayload(value: unknown) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "topics" in value &&
    "sessions" in value,
  );
}

function laterTimestamp(left: string | null, right: string | null) {
  if (!left) return right;
  if (!right) return left;
  return left >= right ? left : right;
}

function mergeAttempts(
  left: TopicProgress["lessonAttempts"],
  right: TopicProgress["lessonAttempts"],
) {
  const merged = { ...left };
  for (const [id, attempt] of Object.entries(right)) {
    const previous = merged[id];
    if (!previous) {
      merged[id] = attempt;
      continue;
    }
    const attempts = Math.max(previous.attempts, attempt.attempts);
    merged[id] = {
      attempts,
      correct: Math.min(attempts, Math.max(previous.correct, attempt.correct)),
      updatedAt: laterTimestamp(previous.updatedAt, attempt.updatedAt) ?? "",
    };
  }
  return merged;
}

function mergeTopicProgress(left: TopicProgress, right: TopicProgress): TopicProgress {
  const rightIsNewer = (right.updatedAt ?? "") > (left.updatedAt ?? "");
  return {
    completedObjectives: [...new Set([...left.completedObjectives, ...right.completedObjectives])],
    completedWork: [...new Set([...left.completedWork, ...right.completedWork])],
    completedResources: [...new Set([...left.completedResources, ...right.completedResources])],
    lessonAttempts: mergeAttempts(left.lessonAttempts, right.lessonAttempts),
    questionAttempts: mergeAttempts(left.questionAttempts, right.questionAttempts),
    latestScore: rightIsNewer ? right.latestScore ?? left.latestScore : left.latestScore ?? right.latestScore,
    attempts: Math.max(left.attempts, right.attempts),
    updatedAt: laterTimestamp(left.updatedAt, right.updatedAt),
  };
}

export function mergeStudyStates(leftValue: unknown, rightValue: unknown): StudyProgressState {
  const left = normaliseStudyState(leftValue);
  const right = normaliseStudyState(rightValue);
  const topics = { ...left.topics };

  for (const [topicId, rightProgress] of Object.entries(right.topics)) {
    topics[topicId] = topics[topicId]
      ? mergeTopicProgress(topics[topicId], rightProgress)
      : rightProgress;
  }

  const sessionsById = new Map(left.sessions.map((session) => [session.id, session]));
  for (const session of right.sessions) {
    if (!sessionsById.has(session.id)) sessionsById.set(session.id, session);
  }
  const sessions = [...sessionsById.values()]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-1000);

  return normaliseStudyState({ version: 3, topics, sessions });
}

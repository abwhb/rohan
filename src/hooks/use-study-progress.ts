"use client";

import { useCallback, useSyncExternalStore } from "react";

import { emptyTopicProgress } from "@/src/lib/progress";
import type { StudyProgressState, StudySessionInput, TopicProgress } from "@/src/types/study";

const STORAGE_KEY = "rohan-study-progress-v1";
const CHANGE_EVENT = "rohan-study-progress-change";

const emptyState: StudyProgressState = { version: 3, topics: {}, sessions: [] };
let cachedRaw: string | null | undefined;
let cachedState = emptyState;

function normaliseTopicProgress(value: unknown): TopicProgress {
  if (!value || typeof value !== "object") return emptyTopicProgress;

  const progress = value as Partial<TopicProgress>;
  return {
    completedObjectives: Array.isArray(progress.completedObjectives) ? progress.completedObjectives : [],
    completedWork: Array.isArray(progress.completedWork) ? progress.completedWork : [],
    completedResources: Array.isArray(progress.completedResources) ? progress.completedResources : [],
    lessonAttempts:
      progress.lessonAttempts && typeof progress.lessonAttempts === "object" ? progress.lessonAttempts : {},
    questionAttempts:
      progress.questionAttempts && typeof progress.questionAttempts === "object" ? progress.questionAttempts : {},
    latestScore: typeof progress.latestScore === "number" ? progress.latestScore : null,
    attempts: typeof progress.attempts === "number" ? progress.attempts : 0,
    updatedAt: typeof progress.updatedAt === "string" ? progress.updatedAt : null,
  };
}

function normaliseState(value: unknown): StudyProgressState {
  if (!value || typeof value !== "object") return emptyState;

  const state = value as { topics?: unknown; sessions?: unknown };
  if (!state.topics || typeof state.topics !== "object") return emptyState;

  return {
    version: 3,
    topics: Object.fromEntries(
      Object.entries(state.topics).map(([topicId, progress]) => [topicId, normaliseTopicProgress(progress)]),
    ),
    sessions: Array.isArray(state.sessions) ? state.sessions : [],
  };
}

function getSnapshot(): StudyProgressState {
  if (typeof window === "undefined") return emptyState;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedState;

  cachedRaw = raw;
  if (!raw) {
    cachedState = emptyState;
    return cachedState;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    cachedState = normaliseState(parsed);
  } catch {
    cachedState = emptyState;
  }

  return cachedState;
}

function getServerSnapshot(): StudyProgressState {
  return emptyState;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CHANGE_EVENT, handleChange);
  };
}

function writeState(nextState: StudyProgressState) {
  const raw = JSON.stringify(nextState);
  cachedRaw = raw;
  cachedState = nextState;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function updateTopic(topicId: string, updater: (current: TopicProgress) => TopicProgress) {
  const currentState = getSnapshot();
  const currentTopic = currentState.topics[topicId] ?? emptyTopicProgress;
  const nextTopic = updater(currentTopic);

  writeState({
    ...currentState,
    version: 3,
    topics: {
      ...currentState.topics,
      [topicId]: { ...nextTopic, updatedAt: new Date().toISOString() },
    },
  });
}

export function useStudyProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getProgress = useCallback(
    (topicId: string): TopicProgress => state.topics[topicId] ?? emptyTopicProgress,
    [state.topics],
  );

  const toggleObjective = useCallback((topicId: string, objective: string) => {
    updateTopic(topicId, (current) => {
      const isComplete = current.completedObjectives.includes(objective);
      return {
        ...current,
        completedObjectives: isComplete
          ? current.completedObjectives.filter((item) => item !== objective)
          : [...current.completedObjectives, objective],
      };
    });
  }, []);

  const toggleWork = useCallback((topicId: string, workId: string) => {
    updateTopic(topicId, (current) => {
      const isComplete = current.completedWork.includes(workId);
      return {
        ...current,
        completedWork: isComplete
          ? current.completedWork.filter((item) => item !== workId)
          : [...current.completedWork, workId],
      };
    });
  }, []);

  const saveScore = useCallback((topicId: string, score: number) => {
    const safeScore = Math.max(0, Math.min(100, Math.round(score)));
    updateTopic(topicId, (current) => ({
      ...current,
      latestScore: safeScore,
      attempts: current.attempts + 1,
    }));
  }, []);

  const completeResource = useCallback((topicId: string, resourceId: string) => {
    updateTopic(topicId, (current) => ({
      ...current,
      completedResources: current.completedResources.includes(resourceId)
        ? current.completedResources
        : [...current.completedResources, resourceId],
    }));
  }, []);

  const recordLessonAttempt = useCallback((topicId: string, lessonId: string, isCorrect: boolean) => {
    updateTopic(topicId, (current) => {
      const previous = current.lessonAttempts[lessonId] ?? { attempts: 0, correct: 0, updatedAt: "" };
      return {
        ...current,
        lessonAttempts: {
          ...current.lessonAttempts,
          [lessonId]: {
            attempts: previous.attempts + 1,
            correct: previous.correct + (isCorrect ? 1 : 0),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const recordQuestionAttempt = useCallback((topicId: string, questionId: string, isCorrect: boolean) => {
    updateTopic(topicId, (current) => {
      const previous = current.questionAttempts[questionId] ?? { attempts: 0, correct: 0, updatedAt: "" };
      return {
        ...current,
        questionAttempts: {
          ...current.questionAttempts,
          [questionId]: {
            attempts: previous.attempts + 1,
            correct: previous.correct + (isCorrect ? 1 : 0),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const logSession = useCallback((input: StudySessionInput) => {
    const currentState = getSnapshot();
    const currentTopic = currentState.topics[input.topicId] ?? emptyTopicProgress;
    const now = new Date();
    const focusedMinutes = Math.max(1, Math.min(240, Math.round(input.focusedMinutes)));
    const questionsAttempted = Math.max(0, Math.round(input.questionsAttempted));
    const correctAnswers = Math.max(0, Math.min(questionsAttempted, Math.round(input.correctAnswers)));
    const sessionId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${now.getTime()}`;

    writeState({
      version: 3,
      topics: {
        ...currentState.topics,
        [input.topicId]: {
          ...currentTopic,
          completedWork: currentTopic.completedWork.includes(input.workId)
            ? currentTopic.completedWork
            : [...currentTopic.completedWork, input.workId],
          updatedAt: now.toISOString(),
        },
      },
      sessions: [
        ...currentState.sessions,
        {
          ...input,
          id: sessionId,
          date: now.toLocaleDateString("en-CA"),
          focusedMinutes,
          questionsAttempted,
          correctAnswers,
          createdAt: now.toISOString(),
        },
      ].slice(-1000),
    });
  }, []);

  const resetProgress = useCallback(() => writeState(emptyState), []);

  return {
    state,
    getProgress,
    toggleObjective,
    toggleWork,
    saveScore,
    completeResource,
    recordLessonAttempt,
    recordQuestionAttempt,
    logSession,
    resetProgress,
  };
}

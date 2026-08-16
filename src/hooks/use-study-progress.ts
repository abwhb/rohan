"use client";

import { useCallback, useSyncExternalStore } from "react";

import { emptyTopicProgress } from "@/src/lib/progress";
import type { StudyProgressState, TopicProgress } from "@/src/types/study";

const STORAGE_KEY = "rohan-study-progress-v1";
const CHANGE_EVENT = "rohan-study-progress-change";

const emptyState: StudyProgressState = { version: 1, topics: {} };
let cachedRaw: string | null | undefined;
let cachedState = emptyState;

function isProgressState(value: unknown): value is StudyProgressState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<StudyProgressState>;
  return state.version === 1 && typeof state.topics === "object" && state.topics !== null;
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
    cachedState = isProgressState(parsed) ? parsed : emptyState;
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
    version: 1,
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

  const resetProgress = useCallback(() => writeState(emptyState), []);

  return { state, getProgress, toggleObjective, toggleWork, saveScore, resetProgress };
}

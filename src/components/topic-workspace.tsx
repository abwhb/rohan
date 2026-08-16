"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Headphones,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
import type { StudySubject, StudyTopic, TopicProgress, WorkBlock } from "@/src/types/study";

interface TopicWorkspaceProps {
  topic: StudyTopic;
  subject: StudySubject;
  progress: TopicProgress;
  onBack: () => void;
  onToggleObjective: (objective: string) => void;
  onToggleWork: (workId: string) => void;
  onSaveScore: (score: number) => void;
  onVoiceRequested: () => void;
}

const workIcons: Record<WorkBlock["kind"], typeof Brain> = {
  recall: Brain,
  learn: BookOpen,
  practice: ClipboardCheck,
  correct: RotateCcw,
};

export function TopicWorkspace({
  topic,
  subject,
  progress,
  onBack,
  onToggleObjective,
  onToggleWork,
  onSaveScore,
  onVoiceRequested,
}: TopicWorkspaceProps) {
  const [score, setScore] = useState(progress.latestScore ?? 70);
  const mastery = getTopicMastery(topic, progress);
  const status = getTopicStatus(topic, progress);
  const completedMinutes = topic.work
    .filter((item) => progress.completedWork.includes(item.id))
    .reduce((sum, item) => sum + item.minutes, 0);
  const totalMinutes = topic.work.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <section
      className="topic-workspace"
      style={{ "--subject-accent": subject.accent, "--subject-soft": subject.softAccent } as React.CSSProperties}
    >
      <button className="back-button" onClick={onBack} type="button">
        <ArrowLeft aria-hidden="true" size={17} /> Back to {subject.shortName}
      </button>

      <header className="topic-workspace__header">
        <div className="topic-workspace__title">
          <span className="eyebrow">Topic {topic.number} · {subject.paper}</span>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
          <div className="topic-workspace__badges">
            <span className={`status-pill status-pill--${status}`}>{statusLabels[status]}</span>
            <span>{progress.completedObjectives.length}/{topic.objectives.length} objectives checked</span>
            <span>{completedMinutes}/{totalMinutes} focused minutes</span>
          </div>
        </div>
        <ProgressRing accent={subject.accent} size="large" value={mastery} />
      </header>

      <div className="topic-workspace__grid">
        <div className="topic-workspace__main">
          <section className="panel workspace-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Knowledge map</span>
                <h2>Topic objectives</h2>
              </div>
              <span className="completion-fraction">{progress.completedObjectives.length}/{topic.objectives.length}</span>
            </div>

            <div className="checklist">
              {topic.objectives.map((objective, index) => {
                const isComplete = progress.completedObjectives.includes(objective);
                return (
                  <label className={isComplete ? "check-row check-row--complete" : "check-row"} key={objective}>
                    <input
                      checked={isComplete}
                      onChange={() => onToggleObjective(objective)}
                      type="checkbox"
                    />
                    <span className="custom-check" aria-hidden="true"><Check size={14} /></span>
                    <span className="check-row__number">{String(index + 1).padStart(2, "0")}</span>
                    <span>{objective}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="panel workspace-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Active practice</span>
                <h2>Topic work blocks</h2>
              </div>
              <span className="time-badge">{totalMinutes} min total</span>
            </div>

            <div className="work-list">
              {topic.work.map((item) => {
                const isComplete = progress.completedWork.includes(item.id);
                const Icon = workIcons[item.kind];
                return (
                  <button
                    className={isComplete ? "work-row work-row--complete" : "work-row"}
                    key={item.id}
                    onClick={() => onToggleWork(item.id)}
                    type="button"
                  >
                    <span className="work-row__icon"><Icon aria-hidden="true" size={18} /></span>
                    <span className="work-row__copy">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </span>
                    <span className="work-row__time">{item.minutes} min</span>
                    <span className="work-row__check" aria-hidden="true"><Check size={15} /></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="topic-workspace__aside">
          <section className="panel aside-card exam-focus-card">
            <span className="aside-card__icon"><CircleAlert aria-hidden="true" size={19} /></span>
            <span className="eyebrow">Exam focus</span>
            <h2>Protect these marks</h2>
            <ul>
              {topic.examFocus.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <form
            className="panel aside-card score-card"
            onSubmit={(event) => {
              event.preventDefault();
              onSaveScore(score);
            }}
          >
            <span className="aside-card__icon"><Sparkles aria-hidden="true" size={19} /></span>
            <span className="eyebrow">Evidence</span>
            <h2>Record latest score</h2>
            <p>Use the percentage from a marked topic test or timed set.</p>
            <div className="score-input-row">
              <input
                aria-label="Latest topic score"
                max="100"
                min="0"
                onChange={(event) => setScore(Number(event.target.value))}
                type="range"
                value={score}
              />
              <output>{score}%</output>
            </div>
            <button className="secondary-button secondary-button--wide" type="submit">
              <Save aria-hidden="true" size={16} /> Save score
            </button>
            <small>{progress.attempts > 0 ? `${progress.attempts} scored attempt${progress.attempts === 1 ? "" : "s"}` : "No scored attempt yet"}</small>
          </form>

          <section className="voice-card">
            <span className="voice-card__icon"><Headphones aria-hidden="true" size={21} /></span>
            <div>
              <span className="eyebrow">Gemini voice</span>
              <h2>Listen before practice</h2>
              <p>Generate a short lesson mapped to this topic&apos;s objectives and common mistakes.</p>
            </div>
            <button onClick={onVoiceRequested} type="button">
              Prepare lesson <ChevronRight aria-hidden="true" size={17} />
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
}

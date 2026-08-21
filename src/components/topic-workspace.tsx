"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Check,
  CircleAlert,
  ClipboardCheck,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { SessionLogger } from "@/src/components/session-logger";
import { TopicLearningLab } from "@/src/components/topic-learning-lab";
import { UrduVoiceCoach } from "@/src/components/urdu-voice-coach";
import { topicLearningContent } from "@/src/data/topic-learning-content";
import { getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
import { cn, statusPillClass, ui } from "@/src/lib/ui";
import type { StudySessionInput, StudySubject, StudyTopic, TopicProgress, WorkBlock } from "@/src/types/study";

interface TopicWorkspaceProps {
  topic: StudyTopic;
  subject: StudySubject;
  progress: TopicProgress;
  onBack: () => void;
  onToggleObjective: (objective: string) => void;
  onToggleWork: (workId: string) => void;
  onSaveScore: (score: number) => void;
  onCompleteResource: (resourceId: string) => void;
  onLessonAttempt: (lessonId: string, isCorrect: boolean) => void;
  onLogSession: (session: StudySessionInput) => void;
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
  onCompleteResource,
  onLessonAttempt,
  onLogSession,
}: TopicWorkspaceProps) {
  const [score, setScore] = useState(progress.latestScore ?? 70);
  const mastery = getTopicMastery(topic, progress);
  const status = getTopicStatus(topic, progress);
  const completedMinutes = topic.work
    .filter((item) => progress.completedWork.includes(item.id))
    .reduce((sum, item) => sum + item.minutes, 0);
  const totalMinutes = topic.work.reduce((sum, item) => sum + item.minutes, 0);
  const learningContent = topicLearningContent[topic.id];

  return (
    <section
      className="[--subject-accent:#31736d] [--subject-soft:#dff2ed]"
      style={{ "--subject-accent": subject.accent, "--subject-soft": subject.softAccent } as React.CSSProperties}
    >
      <button className="mb-[18px] inline-flex cursor-pointer items-center gap-[7px] border-0 bg-transparent py-[7px] text-[10px] font-extrabold text-[#607470]" onClick={onBack} type="button">
        <ArrowLeft aria-hidden="true" size={17} /> Back to {subject.shortName}
      </button>

      <header className="grid grid-cols-1 items-center gap-10 rounded-[23px] border border-white/80 p-6 [background:linear-gradient(135deg,var(--subject-soft),#fff_76%)] min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:rounded-[27px] min-[721px]:px-10 min-[721px]:py-[35px]">
        <div>
          <span className={ui.eyebrow}>Topic {topic.number} · {subject.paper}</span>
          <h1 className="my-2 text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-[#17302f] min-[721px]:mb-[15px] min-[721px]:text-[clamp(34px,4.2vw,57px)]">{topic.title}</h1>
          <p className="mb-[18px] max-w-[790px] text-xs text-[#5f7470]">{topic.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={statusPillClass(status)}>{statusLabels[status]}</span>
            <span className="rounded-full bg-white/75 px-[9px] py-1.5 text-[8px] font-bold text-[#647874]">{progress.completedObjectives.length}/{topic.objectives.length} objectives checked</span>
            <span className="rounded-full bg-white/75 px-[9px] py-1.5 text-[8px] font-bold text-[#647874]">{completedMinutes}/{totalMinutes} focused minutes</span>
          </div>
        </div>
        <ProgressRing accent={subject.accent} size="large" value={mastery} />
      </header>

      {learningContent ? (
        <TopicLearningLab
          content={learningContent}
          onCompleteVideo={onCompleteResource}
          onLessonAttempt={onLessonAttempt}
          progress={progress}
        />
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-5 min-[1181px]:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]">
        <div className="grid content-start gap-5">
          <section className={cn(ui.panel, ui.panelPadding)}>
            <div className={ui.sectionHeading}>
              <div>
                <span className={ui.eyebrow}>Knowledge map</span>
                <h2 className={ui.sectionTitle}>Topic objectives</h2>
              </div>
              <span className={ui.subtleBadge}>{progress.completedObjectives.length}/{topic.objectives.length}</span>
            </div>

            <div className="grid gap-2">
              {topic.objectives.map((objective, index) => {
                const isComplete = progress.completedObjectives.includes(objective);
                return (
                  <label
                    className={cn(
                      "grid min-h-[47px] cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-[11px] rounded-xl border px-3 py-2.5 text-[10px] transition hover:border-[var(--subject-accent)]",
                      isComplete
                        ? "border-transparent bg-[var(--subject-soft)] text-[#6f7f7c]"
                        : "border-[#edf0ed] bg-[#f8f9f7] text-[#425451]",
                    )}
                    key={objective}
                  >
                    <input
                      className="absolute size-px overflow-hidden opacity-0"
                      checked={isComplete}
                      onChange={() => onToggleObjective(objective)}
                      type="checkbox"
                    />
                    <span className={cn("grid size-[22px] place-items-center rounded-[7px] border", isComplete ? "border-[var(--subject-accent)] bg-[var(--subject-accent)] text-white" : "border-[#cdd7d3] bg-white text-transparent")} aria-hidden="true"><Check size={14} /></span>
                    <span className="text-[8px] font-extrabold tracking-[0.08em] text-[#8c9a97]">{String(index + 1).padStart(2, "0")}</span>
                    <span className={isComplete ? "line-through decoration-[#50645f]/35" : undefined}>{objective}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className={cn(ui.panel, ui.panelPadding)}>
            <div className={ui.sectionHeading}>
              <div>
                <span className={ui.eyebrow}>Active practice</span>
                <h2 className={ui.sectionTitle}>Topic work blocks</h2>
              </div>
              <span className={ui.subtleBadge}>{totalMinutes} min total</span>
            </div>

            <div className="grid gap-[9px]">
              {topic.work.map((item) => {
                const isComplete = progress.completedWork.includes(item.id);
                const Icon = workIcons[item.kind];
                return (
                  <button
                    className={cn(
                      "grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[13px] rounded-[14px] border border-[#e5ebe7] p-[13px] text-left transition hover:border-[var(--subject-accent)] min-[721px]:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
                      isComplete ? "bg-[#f6faf7]" : "bg-white",
                    )}
                    key={item.id}
                    onClick={() => onToggleWork(item.id)}
                    type="button"
                  >
                    <span className="grid size-[38px] place-items-center rounded-[11px] bg-[var(--subject-soft)] text-[var(--subject-accent)]"><Icon aria-hidden="true" size={18} /></span>
                    <span className="min-w-0">
                      <strong className={cn("block text-[11px]", isComplete && "text-[#70817e] line-through")}>{item.label}</strong>
                      <span className="mt-0.5 block text-[9px] text-study-muted min-[721px]:truncate">{item.description}</span>
                    </span>
                    <span className="hidden whitespace-nowrap text-[9px] font-extrabold text-[#70817e] min-[721px]:inline">{item.minutes} min</span>
                    <span className={cn("grid size-[23px] place-items-center rounded-[7px] border", isComplete ? "border-[var(--subject-accent)] bg-[var(--subject-accent)] text-white" : "border-[#d1dad6] text-transparent")} aria-hidden="true"><Check size={15} /></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="grid grid-cols-1 content-start gap-5 min-[721px]:grid-cols-2 min-[961px]:grid-cols-3 min-[1181px]:grid-cols-1">
          <SessionLogger onLog={onLogSession} progress={progress} topic={topic} />

          <section className={cn(ui.panel, ui.panelPadding, "relative overflow-hidden")}>
            <span className="mb-[18px] grid size-[39px] place-items-center rounded-xl bg-[var(--subject-soft)] text-[var(--subject-accent)]"><CircleAlert aria-hidden="true" size={19} /></span>
            <span className={ui.eyebrow}>Exam focus</span>
            <h2 className={ui.sectionTitle}>Protect these marks</h2>
            <ul className="mt-[18px] grid list-none gap-2.5 p-0">
              {topic.examFocus.map((item) => <li className="relative pl-[17px] text-[10px] text-[#5e706d] before:absolute before:left-0 before:top-[0.62em] before:size-1.5 before:rotate-45 before:rounded-sm before:bg-[var(--subject-accent)] before:content-['']" key={item}>{item}</li>)}
            </ul>
          </section>

          <form
            className={cn(ui.panel, ui.panelPadding, "relative overflow-hidden")}
            onSubmit={(event) => {
              event.preventDefault();
              onSaveScore(score);
            }}
          >
            <span className="mb-[18px] grid size-[39px] place-items-center rounded-xl bg-[var(--subject-soft)] text-[var(--subject-accent)]"><Sparkles aria-hidden="true" size={19} /></span>
            <span className={ui.eyebrow}>Evidence</span>
            <h2 className={ui.sectionTitle}>Record latest score</h2>
            <p className="mb-[18px] mt-[9px] text-[10px] text-study-muted">Use the percentage from a marked topic test or timed set.</p>
            <div className="mb-3.5 grid grid-cols-[1fr_auto] items-center gap-3.5">
              <input
                aria-label="Latest topic score"
                className="w-full accent-[var(--subject-accent)]"
                max="100"
                min="0"
                onChange={(event) => setScore(Number(event.target.value))}
                type="range"
                value={score}
              />
              <output className="min-w-[52px] text-right text-[21px] font-[850] tracking-[-0.04em] text-[var(--subject-accent)]">{score}%</output>
            </div>
            <button className={cn(ui.secondaryButton, "w-full")} type="submit">
              <Save aria-hidden="true" size={16} /> Save score
            </button>
            <small className="mt-2.5 block text-center text-[8px] text-[#879592]">{progress.attempts > 0 ? `${progress.attempts} scored attempt${progress.attempts === 1 ? "" : "s"}` : "No scored attempt yet"}</small>
          </form>

          {learningContent ? (
            <UrduVoiceCoach
              completed={progress.completedResources.includes(`voice-${learningContent.urduLesson.id}`)}
              lesson={learningContent.urduLesson}
              onComplete={() => onCompleteResource(`voice-${learningContent.urduLesson.id}`)}
            />
          ) : null}
        </aside>
      </div>
    </section>
  );
}

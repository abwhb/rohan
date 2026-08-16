import { ArrowRight, BookCheck, Brain, Clock3, Flame, History, Target } from "lucide-react";

import { DailyRetrievalPack } from "@/src/components/daily-retrieval-pack";
import { ProgressRing } from "@/src/components/progress-ring";
import { TeacherInsights } from "@/src/components/teacher-insights";
import { subjectById, subjects, topicById, topics, topicsBySubject } from "@/src/data/curriculum";
import {
  buildDailyPlan,
  buildDailyRetrievalTopics,
  DAILY_FOCUS_TARGET,
  getFocusedMinutes,
  getStudyStreak,
  getTodaySessions,
} from "@/src/lib/daily-plan";
import { getTopicMastery, getTopicStatus } from "@/src/lib/progress";
import { cn, ui } from "@/src/lib/ui";
import type { CloudRole, StudySession, StudyTopic, SubjectId, TopicProgress } from "@/src/types/study";

interface OverviewViewProps {
  getProgress: (topicId: string) => TopicProgress;
  cloudRole: CloudRole | null;
  onOpenTopic: (topic: StudyTopic) => void;
  onOpenSubject: (subjectId: SubjectId) => void;
  onQuestionAttempt: (topicId: string, questionId: string, isCorrect: boolean) => void;
  sessions: StudySession[];
}

export function OverviewView({ cloudRole, getProgress, onQuestionAttempt, onOpenTopic, onOpenSubject, sessions }: OverviewViewProps) {
  let masteryTotal = 0;
  let masteredTopics = 0;
  let activeTopics = 0;

  for (const item of topics) {
    const progress = getProgress(item.id);
    const mastery = getTopicMastery(item, progress);
    const status = getTopicStatus(item, progress);
    masteryTotal += mastery;
    if (status === "mastered") masteredTopics += 1;
    if (status !== "not-started") activeTopics += 1;
  }

  const overallMastery = Math.round(masteryTotal / topics.length);
  const dailyPlan = buildDailyPlan(getProgress);
  const retrievalTopics = buildDailyRetrievalTopics(getProgress);
  const continueTopic = dailyPlan[0]?.topic ?? topicById["p1-quadratics"];
  const focusedMinutes = getFocusedMinutes(sessions);
  const todaySessions = getTodaySessions(sessions);
  const streak = getStudyStreak(sessions);
  const recentSessions = sessions.slice(-5).reverse();

  return (
    <>
      <section className="relative grid min-h-[312px] grid-cols-1 items-center overflow-hidden rounded-[23px] bg-[#22433f] p-6 text-[#f5faf8] shadow-[0_18px_45px_rgba(34,55,56,0.08)] min-[721px]:rounded-[30px] min-[721px]:p-[clamp(34px,5vw,60px)] min-[961px]:grid-cols-[minmax(0,1fr)_auto]">
        <span aria-hidden="true" className="pointer-events-none absolute -right-[110px] -top-56 size-[420px] rounded-full border border-study-lime/20" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[218px] right-5 size-[280px] rounded-full border border-study-lime/20" />
        <div className="relative z-[1]">
          <span className={cn(ui.eyebrow, "text-study-lime")}>Today · Adaptive study plan</span>
          <h1 className="my-2 text-4xl font-bold leading-[1.02] tracking-[-0.055em] min-[721px]:mb-[15px] min-[721px]:text-[clamp(34px,4.2vw,57px)]">One topic at a time.<br />Every lost mark accounted for.</h1>
          <p className="mb-6 max-w-[650px] text-sm text-[#bfd0cc]">
            Your queue now follows the weakest active topic in each subject. Learn, retrieve, practise, then log the evidence.
          </p>
          <button className={ui.primaryButton} onClick={() => onOpenTopic(continueTopic)} type="button">
            {focusedMinutes > 0 ? "Continue today's plan" : "Start today's plan"}
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
        <div className="relative z-[1] mt-7 flex w-fit min-w-[255px] items-center gap-[19px] rounded-3xl border border-white/10 bg-white/[0.075] p-6 min-[961px]:ml-10 min-[961px]:mt-0">
          <ProgressRing accent="#c9ef6b" size="large" tone="dark" value={overallMastery} />
          <div>
            <strong className="block text-sm">{masteredTopics} of {topics.length}</strong>
            <span className="block text-[10px] text-[#a8bdb8]">topics mastered</span>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3.5 min-[721px]:grid-cols-2 min-[1181px]:grid-cols-4" aria-label="Study summary">
        <article className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#dae2de]/80 bg-white p-[19px] shadow-[0_7px_25px_rgba(43,62,63,0.045)]">
          <span className="grid size-[43px] shrink-0 place-items-center rounded-[13px] bg-[#dff2ed] text-[#31736d]"><Clock3 aria-hidden="true" size={20} /></span>
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Focused today</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">{focusedMinutes} / {DAILY_FOCUS_TARGET}m</strong><small className="block truncate text-[9px] text-[#85928f]">4h 30m target · breaks extra</small></div>
        </article>
        <article className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#dae2de]/80 bg-white p-[19px] shadow-[0_7px_25px_rgba(43,62,63,0.045)]">
          <span className="grid size-[43px] shrink-0 place-items-center rounded-[13px] bg-[#fae8d7] text-[#bd6834]"><Flame aria-hidden="true" size={20} /></span>
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Current streak</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">{streak} day{streak === 1 ? "" : "s"}</strong><small className="block truncate text-[9px] text-[#85928f]">{todaySessions.length} sessions today</small></div>
        </article>
        <article className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#dae2de]/80 bg-white p-[19px] shadow-[0_7px_25px_rgba(43,62,63,0.045)]">
          <span className="grid size-[43px] shrink-0 place-items-center rounded-[13px] bg-[#ece8fa] text-[#6756a6]"><Brain aria-hidden="true" size={20} /></span>
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Topics active</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">{activeTopics}</strong><small className="block truncate text-[9px] text-[#85928f]">{topics.length - activeTopics} waiting</small></div>
        </article>
        <article className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#dae2de]/80 bg-white p-[19px] shadow-[0_7px_25px_rgba(43,62,63,0.045)]">
          <span className="grid size-[43px] shrink-0 place-items-center rounded-[13px] bg-[#e2eefb] text-[#4873a8]"><BookCheck aria-hidden="true" size={20} /></span>
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Mastered</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">{masteredTopics}</strong><small className="block truncate text-[9px] text-[#85928f]">Target: 80%+ evidence</small></div>
        </article>
      </section>

      {cloudRole === "teacher" ? <TeacherInsights getProgress={getProgress} sessions={sessions} /> : null}

      <div className="mt-5 grid grid-cols-1 gap-5 min-[1181px]:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section className={cn(ui.panel, ui.panelPadding)}>
          <div className={ui.sectionHeading}>
          <div>
            <span className={ui.eyebrow}>Today&apos;s mission</span>
            <h2 className={ui.sectionTitle}>Adaptive daily queue</h2>
            <p className="mt-1.5 text-[9px] text-study-muted">100 min Pure · 75 min Mechanics · 95 min Business = 270 focused minutes</p>
          </div>
            <span className={ui.subtleBadge}><Clock3 aria-hidden="true" size={15} /> {focusedMinutes}/{DAILY_FOCUS_TARGET} min logged</span>
          </div>

          <div className="grid">
            {dailyPlan.map(({ subject, topic: item, work: nextWork, mastery, reason }, index) => {
              return (
                <button className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 border-0 border-t border-[#edf0ed] bg-transparent px-1 py-[15px] text-left first:border-t-0" key={item.id} onClick={() => onOpenTopic(item)} type="button">
                  <span className="grid size-[38px] place-items-center rounded-xl text-xs font-[850]" style={{ backgroundColor: subject.softAccent, color: subject.accent }}>
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <small className="block text-[8px] font-bold uppercase tracking-[0.08em] text-[#879490]">{subject.shortName} · {subject.dailyMinutes} min · {reason}</small>
                    <strong className="my-0.5 block text-[13px] transition group-hover:text-[#2e746c]">{item.title}</strong>
                    <span className="block truncate text-[10px] text-study-muted">{nextWork.description} · {mastery}% mastery</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="text-[#8a9a97]" size={18} />
                </button>
              );
            })}
          </div>
        </section>

        <aside className={cn(ui.panel, ui.panelPadding)}>
          <div className={ui.sectionHeading}>
            <div>
              <span className={ui.eyebrow}>Readiness</span>
              <h2 className={ui.sectionTitle}>Subject map</h2>
            </div>
            <Target aria-hidden="true" size={21} />
          </div>

          <div className="grid gap-[9px]">
            {subjects.map((subject) => {
              const subjectTopics = topicsBySubject(subject.id);
              let total = 0;
              let mastered = 0;
              for (const item of subjectTopics) {
                const mastery = getTopicMastery(item, getProgress(item.id));
                total += mastery;
                if (mastery >= 80) mastered += 1;
              }
              const average = Math.round(total / subjectTopics.length);

              return (
                <button className="w-full cursor-pointer rounded-[13px] border border-transparent bg-[#f7f8f5] p-3 text-left transition hover:border-study-line hover:bg-white" key={subject.id} onClick={() => onOpenSubject(subject.id)} type="button">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    <span className="size-[7px] rounded-full" style={{ backgroundColor: subject.accent }} />
                    <strong className="text-[10px]">{subject.shortName}</strong>
                    <span className="text-[10px]">{average}%</span>
                  </div>
                  <div className={cn(ui.progressTrack, "my-[9px] h-1")} aria-hidden="true">
                    <span className="block h-full rounded-[inherit] transition-[width] duration-300" style={{ width: `${average}%`, backgroundColor: subject.accent }} />
                  </div>
                  <small className="text-[8px] text-[#82908d]">{mastered}/{subjectTopics.length} topics mastered · {subject.examDate}</small>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {cloudRole !== "teacher" ? (
        <DailyRetrievalPack
          getProgress={getProgress}
          onQuestionAttempt={onQuestionAttempt}
          onOpenTopic={onOpenTopic}
          topics={retrievalTopics}
        />
      ) : null}

      <section className={cn(ui.panel, ui.panelPadding, "mt-5")}>
        <div className={ui.sectionHeading}>
          <div>
            <span className={ui.eyebrow}>Evidence log</span>
            <h2 className={ui.sectionTitle}>Recent focused sessions</h2>
          </div>
          <History aria-hidden="true" size={21} />
        </div>

        {recentSessions.length > 0 ? (
          <div className="grid gap-2 min-[721px]:grid-cols-2 min-[1181px]:grid-cols-3">
            {recentSessions.map((session) => {
              const item = topicById[session.topicId];
              const subject = item ? subjectById[item.subjectId] : null;
              const accuracy = session.questionsAttempted > 0
                ? Math.round((session.correctAnswers / session.questionsAttempted) * 100)
                : null;

              return (
                <button
                  className="rounded-[14px] border border-study-line bg-[#f8f9f7] p-3.5 text-left transition hover:bg-white"
                  disabled={!item}
                  key={session.id}
                  onClick={() => item && onOpenTopic(item)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.08em]" style={{ color: subject?.accent }}>{subject?.shortName ?? "Study"}</span>
                    <span className="text-[8px] text-study-muted">{session.date}</span>
                  </div>
                  <strong className="mt-1.5 block text-[11px]">{item?.title ?? session.topicId}</strong>
                  <span className="mt-2 block text-[9px] text-study-muted">{session.focusedMinutes} focused min{accuracy === null ? "" : ` · ${accuracy}% accuracy`}</span>
                  {session.note ? <small className="mt-2 block line-clamp-2 text-[8px] text-[#748481]">{session.note}</small> : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#ccd7d2] bg-[#f8f9f7] px-5 py-7 text-center text-[10px] text-study-muted">
            No focused work logged yet. Open the first adaptive topic and save the session when the block ends.
          </div>
        )}
      </section>
    </>
  );
}

import { ArrowRight, BookCheck, Brain, Clock3, Flame, Target } from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { subjectById, subjects, topicById, topics, topicsBySubject } from "@/src/data/curriculum";
import { getNextWork, getTopicMastery, getTopicStatus } from "@/src/lib/progress";
import { cn, ui } from "@/src/lib/ui";
import type { StudyTopic, SubjectId, TopicProgress } from "@/src/types/study";

interface OverviewViewProps {
  getProgress: (topicId: string) => TopicProgress;
  onOpenTopic: (topic: StudyTopic) => void;
  onOpenSubject: (subjectId: SubjectId) => void;
}

const missionTopicIds = ["p1-quadratics", "b-environment", "m-forces"];

export function OverviewView({ getProgress, onOpenTopic, onOpenSubject }: OverviewViewProps) {
  let masteryTotal = 0;
  let masteredTopics = 0;
  let activeTopics = 0;

  for (const item of topics) {
    const progress = getProgress(item.id);
    const mastery = getTopicMastery(item, progress);
    masteryTotal += mastery;
    if (getTopicStatus(item, progress) === "mastered") masteredTopics += 1;
    if (mastery > 0) activeTopics += 1;
  }

  const overallMastery = Math.round(masteryTotal / topics.length);
  const continueTopic =
    topics.find((item) => getTopicMastery(item, getProgress(item.id)) > 0 && getTopicMastery(item, getProgress(item.id)) < 80) ??
    topicById["p1-quadratics"];

  return (
    <>
      <section className="relative grid min-h-[312px] grid-cols-1 items-center overflow-hidden rounded-[23px] bg-[#22433f] p-6 text-[#f5faf8] shadow-[0_18px_45px_rgba(34,55,56,0.08)] min-[721px]:rounded-[30px] min-[721px]:p-[clamp(34px,5vw,60px)] min-[961px]:grid-cols-[minmax(0,1fr)_auto]">
        <span aria-hidden="true" className="pointer-events-none absolute -right-[110px] -top-56 size-[420px] rounded-full border border-study-lime/20" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[218px] right-5 size-[280px] rounded-full border border-study-lime/20" />
        <div className="relative z-[1]">
          <span className={cn(ui.eyebrow, "text-study-lime")}>Day 1 · Baseline and setup</span>
          <h1 className="my-2 text-4xl font-bold leading-[1.02] tracking-[-0.055em] min-[721px]:mb-[15px] min-[721px]:text-[clamp(34px,4.2vw,57px)]">One topic at a time.<br />Every lost mark accounted for.</h1>
          <p className="mb-6 max-w-[650px] text-sm text-[#bfd0cc]">
            Today is about honest measurement: establish the baseline, log the gaps, and start repairing the first weak method.
          </p>
          <button className={ui.primaryButton} onClick={() => onOpenTopic(continueTopic)} type="button">
            {activeTopics > 0 ? "Continue topic" : "Start Day 1"}
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
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Focused target</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">4h 30m</strong><small className="block truncate text-[9px] text-[#85928f]">Breaks are extra</small></div>
        </article>
        <article className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#dae2de]/80 bg-white p-[19px] shadow-[0_7px_25px_rgba(43,62,63,0.045)]">
          <span className="grid size-[43px] shrink-0 place-items-center rounded-[13px] bg-[#fae8d7] text-[#bd6834]"><Flame aria-hidden="true" size={20} /></span>
          <div className="min-w-0"><span className="block text-[9px] font-bold uppercase text-study-muted">Current streak</span><strong className="my-px block text-xl leading-[1.15] tracking-[-0.03em]">Day 1</strong><small className="block truncate text-[9px] text-[#85928f]">Build the chain today</small></div>
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

      <div className="mt-5 grid grid-cols-1 gap-5 min-[1181px]:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section className={cn(ui.panel, ui.panelPadding)}>
          <div className={ui.sectionHeading}>
            <div>
              <span className={ui.eyebrow}>Today&apos;s mission</span>
              <h2 className={ui.sectionTitle}>Three subject moves</h2>
            </div>
            <span className={ui.subtleBadge}><Clock3 aria-hidden="true" size={15} /> 230 min + correction</span>
          </div>

          <div className="grid">
            {missionTopicIds.map((topicId, index) => {
              const item = topicById[topicId];
              const subject = subjectById[item.subjectId];
              const progress = getProgress(item.id);
              const nextWork = getNextWork(item, progress) ?? item.work[0];

              return (
                <button className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 border-0 border-t border-[#edf0ed] bg-transparent px-1 py-[15px] text-left first:border-t-0" key={item.id} onClick={() => onOpenTopic(item)} type="button">
                  <span className="grid size-[38px] place-items-center rounded-xl text-xs font-[850]" style={{ backgroundColor: subject.softAccent, color: subject.accent }}>
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <small className="block text-[8px] font-bold uppercase tracking-[0.08em] text-[#879490]">{subject.shortName} · {subject.dailyMinutes} min block</small>
                    <strong className="my-0.5 block text-[13px] transition group-hover:text-[#2e746c]">{item.title}</strong>
                    <span className="block truncate text-[10px] text-study-muted">{nextWork.description}</span>
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
    </>
  );
}

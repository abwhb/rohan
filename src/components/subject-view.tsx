"use client";

import { useState } from "react";
import { CalendarDays, ChevronRight, FileText, TimerReset } from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { TopicCard } from "@/src/components/topic-card";
import { topicsBySubject } from "@/src/data/curriculum";
import { getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
import { cn, ui } from "@/src/lib/ui";
import type { StudySubject, StudyTopic, TopicProgress, TopicStatus } from "@/src/types/study";

interface SubjectViewProps {
  subject: StudySubject;
  getProgress: (topicId: string) => TopicProgress;
  onOpenTopic: (topic: StudyTopic) => void;
}

type TopicFilter = "all" | TopicStatus;

const filters: TopicFilter[] = ["all", "not-started", "learning", "exam-practice", "mastered"];

export function SubjectView({ subject, getProgress, onOpenTopic }: SubjectViewProps) {
  const [filter, setFilter] = useState<TopicFilter>("all");
  const subjectTopics = topicsBySubject(subject.id);

  let masteryTotal = 0;
  for (const item of subjectTopics) masteryTotal += getTopicMastery(item, getProgress(item.id));
  const averageMastery = Math.round(masteryTotal / subjectTopics.length);

  const visibleTopics = subjectTopics.filter((item) => {
    if (filter === "all") return true;
    return getTopicStatus(item, getProgress(item.id)) === filter;
  });

  return (
    <>
      <section
        className="grid min-h-[250px] grid-cols-1 items-center gap-9 rounded-[23px] border border-white/80 p-6 shadow-[0_18px_45px_rgba(34,55,56,0.08)] [background:linear-gradient(135deg,var(--subject-soft)_0%,#fff_72%)] min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:rounded-[30px] min-[721px]:p-[clamp(32px,5vw,53px)]"
        style={{ "--subject-accent": subject.accent, "--subject-soft": subject.softAccent } as React.CSSProperties}
      >
        <div>
          <span className={ui.eyebrow}>{subject.paper}</span>
          <h1 className="my-2 text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-[#17302f] min-[721px]:mb-[15px] min-[721px]:text-[clamp(34px,4.2vw,57px)]">{subject.title}</h1>
          <p className="mb-[22px] max-w-[700px] text-[#526a67]">{subject.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-[7px] rounded-full border border-white/90 bg-white/70 px-2.5 py-2 text-[9px] font-bold text-[#49635f]"><CalendarDays aria-hidden="true" size={17} /> Exam {subject.examDate}</span>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-white/90 bg-white/70 px-2.5 py-2 text-[9px] font-bold text-[#49635f]"><FileText aria-hidden="true" size={17} /> {subject.marks} marks</span>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-white/90 bg-white/70 px-2.5 py-2 text-[9px] font-bold text-[#49635f]"><TimerReset aria-hidden="true" size={17} /> {subject.dailyMinutes} min daily</span>
          </div>
        </div>
        <div className="grid w-full grid-cols-[auto_1fr] items-center justify-items-start gap-[11px] rounded-3xl border border-white/90 bg-white/65 p-[22px] min-[721px]:w-auto min-[721px]:min-w-[180px] min-[721px]:grid-cols-1 min-[721px]:justify-items-center">
          <ProgressRing accent={subject.accent} size="large" value={averageMastery} />
          <span className="text-center text-[9px] font-bold text-[#647875]">{subject.weighting}</span>
        </div>
      </section>

      <section className="mt-[31px]">
        <div className="mb-5 block items-end justify-between gap-5 min-[721px]:flex">
          <div>
            <span className={ui.eyebrow}>Topic-wise work</span>
            <h2 className={ui.sectionTitle}>Complete syllabus map</h2>
            <p className="mt-[7px] max-w-[680px] text-xs text-study-muted">Open a topic to work through objectives, today&apos;s blocks, exam risks, and a scored review.</p>
          </div>
          <span className={cn(ui.subtleBadge, "mt-3 min-[721px]:mt-0")}>{subjectTopics.length} topics</span>
        </div>

        <div className="mb-[18px] flex flex-wrap gap-2" role="group" aria-label="Filter topics by status">
          {filters.map((item) => {
            const label = item === "all" ? "All topics" : statusLabels[item];
            const count =
              item === "all"
                ? subjectTopics.length
                : subjectTopics.filter((topic) => getTopicStatus(topic, getProgress(topic.id)) === item).length;

            return (
              <button
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-[11px] border px-3 py-[9px] text-[10px] font-bold",
                  filter === item
                    ? "border-[#213c40] bg-[#213c40] text-white"
                    : "border-study-line bg-white text-[#6b7c79]",
                )}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {label}<span className={cn("grid size-[19px] min-w-[19px] place-items-center rounded-[7px] text-[8px]", filter === item ? "bg-study-lime text-[#213c40]" : "bg-[#eef1ed]")}>{count}</span>
              </button>
            );
          })}
        </div>

        {visibleTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[721px]:grid-cols-2 min-[1181px]:grid-cols-3">
            {visibleTopics.map((item) => (
              <TopicCard
                key={item.id}
                onOpen={onOpenTopic}
                progress={getProgress(item.id)}
                subject={subject}
                topic={item}
              />
            ))}
          </div>
        ) : (
          <div className="grid min-h-[250px] place-content-center justify-items-center gap-[13px] rounded-[20px] border border-dashed border-[#cdd8d3] bg-white text-study-muted">
            <span>No topics in this status yet.</span>
            <button className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent text-[11px] font-extrabold text-[#31736d]" onClick={() => setFilter("all")} type="button">Show all topics <ChevronRight size={16} /></button>
          </div>
        )}
      </section>
    </>
  );
}

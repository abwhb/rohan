import { ArrowUpRight, Check, Clock3 } from "lucide-react";

import { getNextWork, getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
import { statusPillClass, ui } from "@/src/lib/ui";
import type { StudySubject, StudyTopic, TopicProgress } from "@/src/types/study";

interface TopicCardProps {
  topic: StudyTopic;
  subject: StudySubject;
  progress: TopicProgress;
  onOpen: (topic: StudyTopic) => void;
}

export function TopicCard({ topic, subject, progress, onOpen }: TopicCardProps) {
  const mastery = getTopicMastery(topic, progress);
  const status = getTopicStatus(topic, progress);
  const nextWork = getNextWork(topic, progress);

  return (
    <button
      className="group flex min-h-[290px] min-w-0 cursor-pointer flex-col rounded-[21px] border border-[#dae2de]/90 bg-white p-[22px] text-left shadow-[0_8px_27px_rgba(43,62,63,0.045)] transition duration-200 hover:-translate-y-1 hover:border-[var(--topic-accent)] hover:shadow-[0_16px_36px_rgba(43,62,63,0.1)] min-[721px]:min-h-[315px]"
      onClick={() => onOpen(topic)}
      style={{ "--topic-accent": subject.accent, "--topic-soft": subject.softAccent } as React.CSSProperties}
      type="button"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-[850] tracking-[0.12em] text-[var(--topic-accent)] opacity-70">{String(topic.number).padStart(2, "0")}</span>
        <span className={statusPillClass(status)}>{statusLabels[status]}</span>
      </div>

      <div className="my-[23px] mb-2.5 flex items-start justify-between gap-3">
        <div>
          <span className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-[var(--topic-accent)]">{subject.shortName}</span>
          <h3 className="mt-[3px] text-[21px] font-bold leading-[1.1] tracking-[-0.035em]">{topic.title}</h3>
        </div>
        <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-[var(--topic-soft)] text-[var(--topic-accent)]" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <p className="mb-5 line-clamp-3 text-[11px] text-study-muted">{topic.description}</p>

      <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-[#edf1ee] pt-[15px]">
        <span className="inline-flex items-center gap-1.5 text-[8px] text-[#7d8c89]">
          <Check aria-hidden="true" size={15} />
          {progress.completedObjectives.length}/{topic.objectives.length} objectives
        </span>
        <span className="inline-flex items-center gap-1.5 text-[8px] text-[#7d8c89]">
          <Clock3 aria-hidden="true" size={15} />
          {nextWork?.minutes ?? 0} min next
        </span>
      </div>

      <div className="mb-[7px] mt-4 flex items-center justify-between text-[8px] font-bold uppercase text-[#7b8986]">
        <span>Mastery</span>
        <strong className="text-[10px] text-study-ink">{mastery}%</strong>
      </div>
      <div className={ui.progressTrack} aria-hidden="true">
        <span className="block h-full rounded-[inherit] bg-[var(--topic-accent)] transition-[width] duration-300" style={{ width: `${mastery}%` }} />
      </div>
    </button>
  );
}

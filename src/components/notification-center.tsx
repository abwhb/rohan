"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bell, CheckCircle2, Clock3, RotateCcw, X } from "lucide-react";

import { topicById } from "@/src/data/curriculum";
import { buildDailyPlan, DAILY_FOCUS_TARGET, getFocusedMinutes } from "@/src/lib/daily-plan";
import { cn, ui } from "@/src/lib/ui";
import type { CloudRole, StudySession, StudyTopic, TopicProgress } from "@/src/types/study";

interface NotificationCenterProps {
  cloudRole: CloudRole | null;
  getProgress: (topicId: string) => TopicProgress;
  onOpenTopic: (topic: StudyTopic) => void;
  sessions: StudySession[];
}

interface StudyNotification {
  id: string;
  title: string;
  detail: string;
  topic: StudyTopic | null;
  icon: typeof Clock3;
  tone: string;
}

export function NotificationCenter({ cloudRole, getProgress, onOpenTopic, sessions }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const notifications = useMemo(() => {
    const items: StudyNotification[] = [];
    const focusedMinutes = getFocusedMinutes(sessions);
    const remaining = Math.max(0, DAILY_FOCUS_TARGET - focusedMinutes);
    const dailyPlan = buildDailyPlan(getProgress);

    if (remaining > 0) {
      items.push({
        id: "time-remaining",
        title: `${remaining} focused minutes remaining`,
        detail: focusedMinutes > 0 ? "Continue the next adaptive block to protect today's target." : "Start the first block now; breaks do not count toward the target.",
        topic: dailyPlan[0]?.topic ?? null,
        icon: Clock3,
        tone: "bg-[#dff2ed] text-[#31736d]",
      });
    } else {
      items.push({
        id: "target-complete",
        title: "Daily focus target complete",
        detail: "270 focused minutes are logged. Finish with one short correction review if energy remains.",
        topic: null,
        icon: CheckCircle2,
        tone: "bg-[#e8f2d1] text-[#526e2e]",
      });
    }

    for (const { subject, topic, mastery } of dailyPlan.slice(0, 2)) {
      items.push({
        id: `weak-${topic.id}`,
        title: `${subject.shortName}: ${topic.title}`,
        detail: `${mastery}% mastery · selected automatically from the weakest active evidence.`,
        topic,
        icon: ArrowRight,
        tone: "bg-[#ece8fa] text-[#6756a6]",
      });
    }

    const correctionSession = [...sessions]
      .reverse()
      .find((session) => session.mistakeType !== "none" && topicById[session.topicId]);
    if (correctionSession) {
      const topic = topicById[correctionSession.topicId];
      items.push({
        id: `correct-${correctionSession.id}`,
        title: `Repair: ${topic.title}`,
        detail: correctionSession.note || "Redo the lost-mark step without the mark scheme, then log the correction.",
        topic,
        icon: RotateCcw,
        tone: "bg-[#fae8d7] text-[#bd6834]",
      });
    }

    return items;
  }, [getProgress, sessions]);

  if (cloudRole === "teacher") return null;

  return (
    <div className="relative">
      <button aria-label={`${notifications.length} study reminders`} className="relative grid size-[38px] cursor-pointer place-items-center rounded-xl border border-study-line bg-white" onClick={() => setOpen((current) => !current)} type="button">
        <Bell aria-hidden="true" size={18} />
        {notifications.length ? <span className="absolute -right-1.5 -top-1.5 grid min-h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-study-canvas bg-[#e17a49] px-1 text-[7px] font-black text-white">{notifications.length}</span> : null}
      </button>

      {open ? (
        <section aria-label="Study reminders" className="fixed left-4 right-4 top-[68px] z-[70] max-h-[min(620px,calc(100vh-90px))] overflow-auto rounded-[19px] border border-white/80 bg-white p-4 shadow-[0_24px_70px_rgba(20,42,43,0.24)] min-[520px]:absolute min-[520px]:left-auto min-[520px]:right-0 min-[520px]:top-[48px] min-[520px]:w-[380px]" role="dialog">
          <div className="flex items-start justify-between gap-3">
            <div><span className={ui.eyebrow}>Automatic nudges</span><h2 className="mt-1 text-[17px] font-bold tracking-[-0.03em]">Today&apos;s study reminders</h2></div>
            <button aria-label="Close reminders" className="grid size-8 place-items-center rounded-lg border border-study-line bg-white" onClick={() => setOpen(false)} type="button"><X size={15} /></button>
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-study-muted">Generated from today&apos;s minutes, weak-topic evidence, and the latest logged mistake.</p>

          <div className="mt-4 grid gap-2">
            {notifications.map(({ id, title, detail, topic, icon: Icon, tone }) => (
              <button
                className={cn("grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[13px] border border-study-line bg-[#fafbf9] p-3 text-left", !topic && "cursor-default")}
                key={id}
                onClick={() => {
                  if (!topic) return;
                  setOpen(false);
                  onOpenTopic(topic);
                }}
                type="button"
              >
                <span className={cn("grid size-9 place-items-center rounded-[11px]", tone)}><Icon aria-hidden="true" size={16} /></span>
                <span><strong className="block text-[10px]">{title}</strong><small className="mt-1 block text-[8px] leading-relaxed text-study-muted">{detail}</small></span>
                {topic ? <ArrowRight aria-hidden="true" className="text-[#7f918d]" size={15} /> : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

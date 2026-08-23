"use client";

import { useState } from "react";
import { Clock3, Save } from "lucide-react";

import { getNextWork } from "@/src/lib/progress";
import { cn, ui } from "@/src/lib/ui";
import type { StudySessionInput, StudyTopic, TopicProgress } from "@/src/types/study";

interface SessionLoggerProps {
  topic: StudyTopic;
  progress: TopicProgress;
  onLog: (session: StudySessionInput) => void;
}

const mistakeTypes = [
  ["none", "No major mistake"],
  ["concept", "Concept gap"],
  ["method", "Wrong method"],
  ["algebra-sign", "Algebra / sign"],
  ["exam-technique", "Exam technique"],
  ["time", "Time pressure"],
] as const;

export function SessionLogger({ topic, progress, onLog }: SessionLoggerProps) {
  const defaultWork = getNextWork(topic, progress) ?? topic.work[0];
  const [workId, setWorkId] = useState(defaultWork.id);
  const [focusedMinutes, setFocusedMinutes] = useState(defaultWork.minutes);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [mistakeType, setMistakeType] = useState("none");
  const [note, setNote] = useState("");

  return (
    <form
      className={cn(ui.panel, ui.panelPadding)}
      onSubmit={(event) => {
        event.preventDefault();
        onLog({
          topicId: topic.id,
          workId,
          focusedMinutes,
          questionsAttempted,
          correctAnswers,
          mistakeType,
          note: note.trim(),
        });
        setNote("");
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={ui.eyebrow}>Proper tracking</span>
          <h2 className={ui.sectionTitle}>Log focused work</h2>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-[var(--subject-soft)] text-[var(--subject-accent)]">
          <Clock3 aria-hidden="true" size={19} />
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
          Work block
          <select
            className="min-h-10 rounded-[11px] border border-study-line bg-white px-3 text-[10px] text-study-ink"
            onChange={(event) => {
              const selectedWork = topic.work.find((item) => item.id === event.target.value);
              setWorkId(event.target.value);
              if (selectedWork) setFocusedMinutes(selectedWork.minutes);
            }}
            value={workId}
          >
            {topic.work.map((work) => <option key={work.id} value={work.id}>{work.label}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-3 gap-2">
          <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
            Minutes
            <input className="min-h-10 min-w-0 rounded-[11px] border border-study-line px-2 text-[10px]" max="240" min="1" onChange={(event) => setFocusedMinutes(Number(event.target.value))} required type="number" value={focusedMinutes} />
          </label>
          <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
            Questions
            <input className="min-h-10 min-w-0 rounded-[11px] border border-study-line px-2 text-[10px]" max="100" min="0" onChange={(event) => {
              const value = Number(event.target.value);
              setQuestionsAttempted(value);
              setCorrectAnswers((current) => Math.min(current, value));
            }} type="number" value={questionsAttempted} />
          </label>
          <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
            Correct
            <input className="min-h-10 min-w-0 rounded-[11px] border border-study-line px-2 text-[10px]" max={questionsAttempted} min="0" onChange={(event) => setCorrectAnswers(Number(event.target.value))} type="number" value={correctAnswers} />
          </label>
        </div>

        <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
          Main mistake
          <select className="min-h-10 rounded-[11px] border border-study-line bg-white px-3 text-[10px] text-study-ink" onChange={(event) => setMistakeType(event.target.value)} value={mistakeType}>
            {mistakeTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        <label className="grid gap-1.5 text-[9px] font-bold text-[#60736f]">
          One useful note
          <textarea className="min-h-[74px] resize-y rounded-[11px] border border-study-line p-3 text-[10px] leading-relaxed" maxLength={240} onChange={(event) => setNote(event.target.value)} placeholder="What should you remember next time?" value={note} />
        </label>
      </div>

      <button className={cn(ui.primaryButton, "mt-4 w-full justify-center")} type="submit">
        <Save aria-hidden="true" size={16} /> Save session
      </button>
      <p className="mt-2.5 text-center text-[8px] text-study-muted">Saving also marks this work block complete.</p>
    </form>
  );
}

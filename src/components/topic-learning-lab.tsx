"use client";

import { useState } from "react";
import { Check, ChevronRight, Languages, PlayCircle, RotateCcw } from "lucide-react";

import { cn, ui } from "@/src/lib/ui";
import type { TopicLearningContent, TopicProgress } from "@/src/types/study";

interface TopicLearningLabProps {
  content: TopicLearningContent;
  progress: TopicProgress;
  onCompleteVideo: (resourceId: string) => void;
  onLessonAttempt: (lessonId: string, isCorrect: boolean) => void;
}

export function TopicLearningLab({
  content,
  progress,
  onCompleteVideo,
  onLessonAttempt,
}: TopicLearningLabProps) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const videoComplete = progress.completedResources.includes(content.video.id);
  const lessonAttempt = progress.lessonAttempts[content.urduLesson.id];
  const isCorrect = selectedAnswer === content.urduLesson.check.correctIndex;
  const lessonReady = revealedSteps === content.urduLesson.steps.length;

  return (
    <section className="mt-5 grid grid-cols-1 gap-5 min-[961px]:grid-cols-2" aria-label="Guided learning resources">
      <article className={cn(ui.panel, ui.panelPadding, "relative overflow-hidden")}>
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-[14px] bg-[var(--subject-soft)] text-[var(--subject-accent)]">
            <PlayCircle aria-hidden="true" size={22} />
          </span>
          <span className={ui.subtleBadge}>{content.video.durationMinutes} min</span>
        </div>
        <span className={cn(ui.eyebrow, "mt-5 block")}>Verified lesson · {content.video.provider}</span>
        <h2 className="mt-1.5 text-[20px] font-bold leading-tight tracking-[-0.035em]">{content.video.title}</h2>
        <p className="mt-3 text-[10px] leading-relaxed text-study-muted">{content.video.whyItHelps}</p>

        <div className="mt-4 rounded-[13px] bg-[#f6f8f5] p-3.5">
          <strong className="block text-[9px] uppercase tracking-[0.08em] text-[#657774]">Active follow-up</strong>
          <p className="mt-1.5 text-[10px] leading-relaxed text-[#50635f]">{content.video.followUp}</p>
        </div>

        <div className="mt-5 grid gap-2 min-[520px]:grid-cols-2">
          <a
            className={cn(ui.secondaryButton, "justify-center")}
            href={content.video.url}
            rel="noreferrer"
            target="_blank"
          >
            Watch lesson <ChevronRight aria-hidden="true" size={16} />
          </a>
          <button
            className={cn(ui.primaryButton, "justify-center", videoComplete && "cursor-default opacity-70")}
            disabled={videoComplete}
            onClick={() => onCompleteVideo(content.video.id)}
            type="button"
          >
            <Check aria-hidden="true" size={16} /> {videoComplete ? "Recall recorded" : "I did the recall"}
          </button>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-[22px] bg-[#213e3b] p-[22px] text-[#f5faf8] shadow-[0_18px_45px_rgba(34,55,56,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-[14px] bg-study-lime text-[#1e3936]">
            <Languages aria-hidden="true" size={22} />
          </span>
          <span className="rounded-full bg-white/[0.08] px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#c7d8d3]">
            Urdu coach
          </span>
        </div>

        <h2 className="mt-5 text-[20px] font-bold leading-tight tracking-[-0.035em]" dir="rtl" lang="ur">
          {content.urduLesson.title}
        </h2>
        <p className="mt-3 text-right text-[11px] leading-[1.9] text-[#c4d4cf]" dir="rtl" lang="ur">
          {content.urduLesson.summary}
        </p>

        <div className="mt-4 grid gap-2">
          {content.urduLesson.steps.slice(0, revealedSteps).map((step) => (
            <div className="rounded-[13px] border border-white/[0.08] bg-white/[0.055] p-3.5" key={step.title}>
              <strong className="block text-[9px] uppercase tracking-[0.08em] text-study-lime">{step.title}</strong>
              <p className="mt-1.5 text-right text-[10px] leading-[1.85] text-[#c4d4cf]" dir="rtl" lang="ur">{step.body}</p>
            </div>
          ))}
        </div>

        {!lessonReady ? (
          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-between rounded-[11px] border-0 bg-study-lime px-3.5 py-3 text-[10px] font-[850] text-[#213e3b]"
            onClick={() => setRevealedSteps((current) => current + 1)}
            type="button"
          >
            {revealedSteps === 0 ? "Start Urdu explanation" : "Reveal next step"}
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        ) : (
          <div className="mt-4 rounded-[15px] bg-white/[0.075] p-4">
            <strong className="block text-right text-[11px] leading-relaxed" dir="rtl" lang="ur">
              {content.urduLesson.check.prompt}
            </strong>
            <div className="mt-3 grid gap-2">
              {content.urduLesson.check.options.map((option, index) => (
                <button
                  className={cn(
                    "rounded-[11px] border px-3 py-2.5 text-right text-[10px] leading-relaxed transition",
                    selectedAnswer === index
                      ? "border-study-lime bg-study-lime/15 text-white"
                      : "border-white/10 bg-transparent text-[#c8d7d3] hover:border-white/25",
                  )}
                  disabled={submitted}
                  key={option}
                  onClick={() => setSelectedAnswer(index)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>

            {submitted ? (
              <div className={cn("mt-3 rounded-[11px] p-3 text-[10px] leading-relaxed", isCorrect ? "bg-study-lime/15 text-[#e7f6c1]" : "bg-[#b95845]/20 text-[#ffd7cf]")}>
                <strong>{isCorrect ? "Correct — شاباش!" : "Not yet — دوبارہ دیکھو"}</strong>
                <p className="mt-1.5 text-right" dir="rtl" lang="ur">{content.urduLesson.check.explanation}</p>
                {!isCorrect ? (
                  <button
                    className="mt-3 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[9px] font-extrabold text-study-lime"
                    onClick={() => {
                      setSelectedAnswer(null);
                      setSubmitted(false);
                    }}
                    type="button"
                  >
                    <RotateCcw aria-hidden="true" size={14} /> Try again
                  </button>
                ) : null}
              </div>
            ) : (
              <button
                className="mt-3 w-full rounded-[11px] border-0 bg-study-lime px-3 py-2.5 text-[10px] font-[850] text-[#213e3b] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selectedAnswer === null}
                onClick={() => {
                  if (selectedAnswer === null) return;
                  setSubmitted(true);
                  onLessonAttempt(content.urduLesson.id, isCorrect);
                }}
                type="button"
              >
                Check my answer
              </button>
            )}

            {lessonAttempt ? (
              <small className="mt-2.5 block text-center text-[8px] text-[#9fb5af]">
                {lessonAttempt.correct}/{lessonAttempt.attempts} correct attempts saved
              </small>
            ) : null}
          </div>
        )}
      </article>
    </section>
  );
}

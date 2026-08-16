"use client";

import { useState } from "react";
import { ArrowRight, Brain, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { subjectById } from "@/src/data/curriculum";
import { topicLearningContent } from "@/src/data/topic-learning-content";
import { cn, ui } from "@/src/lib/ui";
import type { StudyTopic, TopicProgress } from "@/src/types/study";

interface DailyRetrievalPackProps {
  getProgress: (topicId: string) => TopicProgress;
  onLessonAttempt: (topicId: string, lessonId: string, isCorrect: boolean) => void;
  onOpenTopic: (topic: StudyTopic) => void;
  topics: StudyTopic[];
}

export function DailyRetrievalPack({
  getProgress,
  onLessonAttempt,
  onOpenTopic,
  topics,
}: DailyRetrievalPackProps) {
  const [packTopics] = useState(topics);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [round, setRound] = useState(1);

  const topic = packTopics[questionIndex];
  const content = topic ? topicLearningContent[topic.id] : null;
  const isComplete = questionIndex >= packTopics.length;

  function resetPack() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setResults([]);
    setRound((current) => current + 1);
  }

  if (packTopics.length === 0) return null;

  if (isComplete) {
    const correct = results.filter(Boolean).length;
    return (
      <section className={cn(ui.panel, ui.panelPadding, "mt-5 overflow-hidden")} aria-label="Daily retrieval pack">
        <div className="grid gap-6 min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:items-center">
          <div>
            <span className={ui.eyebrow}>Retrieval complete</span>
            <h2 className={cn(ui.sectionTitle, "mt-1.5 text-[24px]")}>{correct}/{packTopics.length} correct today</h2>
            <p className="mt-2 max-w-[660px] text-[10px] leading-relaxed text-study-muted">
              Every answer has been saved against its topic. Wrong answers will move up future adaptive packs until recall improves.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid size-[76px] place-items-center rounded-full bg-[#e8f2d1] text-[22px] font-black text-[#426043]">
              {Math.round((correct / packTopics.length) * 100)}%
            </div>
            <button className={ui.secondaryButton} onClick={resetPack} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Retry pack
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!topic || !content) return null;

  const subject = subjectById[topic.subjectId];
  const check = content.urduLesson.check;
  const isCorrect = selectedAnswer === check.correctIndex;
  const savedAttempt = getProgress(topic.id).lessonAttempts[content.urduLesson.id];

  return (
    <section className={cn(ui.panel, ui.panelPadding, "mt-5 overflow-hidden")} aria-label="Daily retrieval pack" key={round}>
      <div className={ui.sectionHeading}>
        <div>
          <span className={ui.eyebrow}>Interleaved recall · 5 questions</span>
          <h2 className={ui.sectionTitle}>Daily retrieval pack</h2>
        </div>
        <span className={ui.subtleBadge}><Brain aria-hidden="true" size={15} /> {questionIndex + 1} of {packTopics.length}</span>
      </div>

      <div className="mb-5 flex gap-1.5" aria-label={`${questionIndex} of ${packTopics.length} questions completed`}>
        {packTopics.map((item, index) => (
          <span
            aria-hidden="true"
            className="h-1.5 flex-1 rounded-full"
            key={item.id}
            style={{ backgroundColor: index < questionIndex ? subjectById[item.subjectId].accent : index === questionIndex ? subject.accent : "#e4e9e5" }}
          />
        ))}
      </div>

      <div className="grid gap-5 min-[961px]:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="rounded-[18px] p-5" style={{ backgroundColor: subject.softAccent }}>
          <span className="text-[8px] font-extrabold uppercase tracking-[0.09em]" style={{ color: subject.accent }}>{subject.shortName}</span>
          <h3 className="mt-1.5 text-[20px] font-bold tracking-[-0.035em]">{topic.title}</h3>
          <p className="mt-2 text-right text-[11px] leading-[1.9] text-[#536965]" dir="rtl" lang="ur">{content.urduLesson.summary}</p>
          <button className={cn(ui.secondaryButton, "mt-4 bg-white/65")} onClick={() => onOpenTopic(topic)} type="button">
            Review full lesson <ArrowRight aria-hidden="true" size={15} />
          </button>
          {savedAttempt ? <small className="mt-3 block text-[8px] text-[#657774]">Previous evidence: {savedAttempt.correct}/{savedAttempt.attempts} correct</small> : null}
        </div>

        <div>
          <strong className="block text-right text-[13px] leading-relaxed" dir="rtl" lang="ur">{check.prompt}</strong>
          <div className="mt-4 grid gap-2">
            {check.options.map((option, index) => (
              <button
                className={cn(
                  "rounded-[12px] border px-4 py-3 text-right text-[10px] leading-relaxed transition",
                  selectedAnswer === index
                    ? "border-[#3d766f] bg-[#edf6f3] text-[#1f4843]"
                    : "border-study-line bg-[#f9faf8] text-[#566a66] hover:border-[#91aaa4] hover:bg-white",
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
            <div className={cn("mt-3 rounded-[12px] p-3.5 text-[10px] leading-relaxed", isCorrect ? "bg-[#edf5dc] text-[#3e5d3d]" : "bg-[#fff0ec] text-[#8a473a]")}>
              <div className="flex items-center gap-2 font-extrabold">
                {isCorrect ? <CheckCircle2 aria-hidden="true" size={16} /> : <XCircle aria-hidden="true" size={16} />}
                {isCorrect ? "Correct — evidence saved" : "Not yet — this topic will be prioritised"}
              </div>
              <p className="mt-2 text-right" dir="rtl" lang="ur">{check.explanation}</p>
              <button
                className={cn(ui.primaryButton, "mt-3")}
                onClick={() => {
                  setQuestionIndex((current) => current + 1);
                  setSelectedAnswer(null);
                  setSubmitted(false);
                }}
                type="button"
              >
                {questionIndex === packTopics.length - 1 ? "See my score" : "Next question"}
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          ) : (
            <button
              className={cn(ui.primaryButton, "mt-3 w-full justify-center")}
              disabled={selectedAnswer === null}
              onClick={() => {
                if (selectedAnswer === null) return;
                setSubmitted(true);
                setResults((current) => [...current, isCorrect]);
                onLessonAttempt(topic.id, content.urduLesson.id, isCorrect);
              }}
              type="button"
            >
              Check and save answer
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

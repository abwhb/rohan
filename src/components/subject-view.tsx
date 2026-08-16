"use client";

import { useState } from "react";
import { CalendarDays, ChevronRight, FileText, TimerReset } from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { TopicCard } from "@/src/components/topic-card";
import { topicsBySubject } from "@/src/data/curriculum";
import { getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
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
        className="subject-hero"
        style={{ "--subject-accent": subject.accent, "--subject-soft": subject.softAccent } as React.CSSProperties}
      >
        <div className="subject-hero__copy">
          <span className="eyebrow">{subject.paper}</span>
          <h1>{subject.title}</h1>
          <p>{subject.description}</p>
          <div className="subject-hero__meta">
            <span><CalendarDays aria-hidden="true" size={17} /> Exam {subject.examDate}</span>
            <span><FileText aria-hidden="true" size={17} /> {subject.marks} marks</span>
            <span><TimerReset aria-hidden="true" size={17} /> {subject.dailyMinutes} min daily</span>
          </div>
        </div>
        <div className="subject-hero__readiness">
          <ProgressRing accent={subject.accent} size="large" value={averageMastery} />
          <span>{subject.weighting}</span>
        </div>
      </section>

      <section className="topic-library">
        <div className="section-heading section-heading--library">
          <div>
            <span className="eyebrow">Topic-wise work</span>
            <h2>Complete syllabus map</h2>
            <p>Open a topic to work through objectives, today&apos;s blocks, exam risks, and a scored review.</p>
          </div>
          <span className="topic-count">{subjectTopics.length} topics</span>
        </div>

        <div className="filter-row" role="group" aria-label="Filter topics by status">
          {filters.map((item) => {
            const label = item === "all" ? "All topics" : statusLabels[item];
            const count =
              item === "all"
                ? subjectTopics.length
                : subjectTopics.filter((topic) => getTopicStatus(topic, getProgress(topic.id)) === item).length;

            return (
              <button
                className={filter === item ? "filter-button filter-button--active" : "filter-button"}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {label}<span>{count}</span>
              </button>
            );
          })}
        </div>

        {visibleTopics.length > 0 ? (
          <div className="topic-grid">
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
          <div className="empty-filter-state">
            <span>No topics in this status yet.</span>
            <button onClick={() => setFilter("all")} type="button">Show all topics <ChevronRight size={16} /></button>
          </div>
        )}
      </section>
    </>
  );
}

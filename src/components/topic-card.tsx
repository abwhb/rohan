import { ArrowUpRight, Check, Clock3 } from "lucide-react";

import { getNextWork, getTopicMastery, getTopicStatus, statusLabels } from "@/src/lib/progress";
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
      className="topic-card"
      onClick={() => onOpen(topic)}
      style={{ "--topic-accent": subject.accent, "--topic-soft": subject.softAccent } as React.CSSProperties}
      type="button"
    >
      <div className="topic-card__topline">
        <span className="topic-card__number">{String(topic.number).padStart(2, "0")}</span>
        <span className={`status-pill status-pill--${status}`}>{statusLabels[status]}</span>
      </div>

      <div className="topic-card__heading">
        <div>
          <span>{subject.shortName}</span>
          <h3>{topic.title}</h3>
        </div>
        <span className="topic-card__open" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <p>{topic.description}</p>

      <div className="topic-card__meta">
        <span>
          <Check aria-hidden="true" size={15} />
          {progress.completedObjectives.length}/{topic.objectives.length} objectives
        </span>
        <span>
          <Clock3 aria-hidden="true" size={15} />
          {nextWork?.minutes ?? 0} min next
        </span>
      </div>

      <div className="topic-card__progress-label">
        <span>Mastery</span>
        <strong>{mastery}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${mastery}%` }} />
      </div>
    </button>
  );
}

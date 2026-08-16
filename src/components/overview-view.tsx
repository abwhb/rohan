import { ArrowRight, BookCheck, Brain, Clock3, Flame, Target } from "lucide-react";

import { ProgressRing } from "@/src/components/progress-ring";
import { subjectById, subjects, topicById, topics, topicsBySubject } from "@/src/data/curriculum";
import { getNextWork, getTopicMastery, getTopicStatus } from "@/src/lib/progress";
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
      <section className="overview-hero">
        <div className="overview-hero__content">
          <span className="eyebrow">Day 1 · Baseline and setup</span>
          <h1>One topic at a time.<br />Every lost mark accounted for.</h1>
          <p>
            Today is about honest measurement: establish the baseline, log the gaps, and start repairing the first weak method.
          </p>
          <button className="primary-button" onClick={() => onOpenTopic(continueTopic)} type="button">
            {activeTopics > 0 ? "Continue topic" : "Start Day 1"}
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
        <div className="overview-hero__score">
          <ProgressRing accent="#c9ef6b" size="large" value={overallMastery} />
          <div>
            <strong>{masteredTopics} of {topics.length}</strong>
            <span>topics mastered</span>
          </div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Study summary">
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--green"><Clock3 aria-hidden="true" size={20} /></span>
          <div><span>Focused target</span><strong>4h 30m</strong><small>Breaks are extra</small></div>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--orange"><Flame aria-hidden="true" size={20} /></span>
          <div><span>Current streak</span><strong>Day 1</strong><small>Build the chain today</small></div>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--purple"><Brain aria-hidden="true" size={20} /></span>
          <div><span>Topics active</span><strong>{activeTopics}</strong><small>{topics.length - activeTopics} waiting</small></div>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--blue"><BookCheck aria-hidden="true" size={20} /></span>
          <div><span>Mastered</span><strong>{masteredTopics}</strong><small>Target: 80%+ evidence</small></div>
        </article>
      </section>

      <div className="overview-columns">
        <section className="panel today-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Today&apos;s mission</span>
              <h2>Three subject moves</h2>
            </div>
            <span className="time-badge"><Clock3 aria-hidden="true" size={15} /> 230 min + correction</span>
          </div>

          <div className="mission-list">
            {missionTopicIds.map((topicId, index) => {
              const item = topicById[topicId];
              const subject = subjectById[item.subjectId];
              const progress = getProgress(item.id);
              const nextWork = getNextWork(item, progress) ?? item.work[0];

              return (
                <button className="mission-row" key={item.id} onClick={() => onOpenTopic(item)} type="button">
                  <span className="mission-row__index" style={{ backgroundColor: subject.softAccent, color: subject.accent }}>
                    {index + 1}
                  </span>
                  <span className="mission-row__copy">
                    <small>{subject.shortName} · {subject.dailyMinutes} min block</small>
                    <strong>{item.title}</strong>
                    <span>{nextWork.description}</span>
                  </span>
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              );
            })}
          </div>
        </section>

        <aside className="panel readiness-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Readiness</span>
              <h2>Subject map</h2>
            </div>
            <Target aria-hidden="true" size={21} />
          </div>

          <div className="readiness-list">
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
                <button className="readiness-row" key={subject.id} onClick={() => onOpenSubject(subject.id)} type="button">
                  <div className="readiness-row__top">
                    <span className="subject-dot" style={{ backgroundColor: subject.accent }} />
                    <strong>{subject.shortName}</strong>
                    <span>{average}%</span>
                  </div>
                  <div className="progress-track progress-track--slim" aria-hidden="true">
                    <span style={{ width: `${average}%`, backgroundColor: subject.accent }} />
                  </div>
                  <small>{mastered}/{subjectTopics.length} topics mastered · {subject.examDate}</small>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}

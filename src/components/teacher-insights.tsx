import { AlertTriangle, BarChart3, CalendarCheck2, Clock3, Target } from "lucide-react";

import { subjectById, topics } from "@/src/data/curriculum";
import { getLocalDateKey } from "@/src/lib/daily-plan";
import { getTopicMastery } from "@/src/lib/progress";
import { cn, ui } from "@/src/lib/ui";
import type { StudySession, TopicProgress } from "@/src/types/study";

interface TeacherInsightsProps {
  getProgress: (topicId: string) => TopicProgress;
  sessions: StudySession[];
}

const mistakeLabels: Record<string, string> = {
  concept: "Concept gap",
  method: "Wrong method",
  "algebra-sign": "Algebra / sign",
  "exam-technique": "Exam technique",
  time: "Time pressure",
};

function hasEvidence(progress: TopicProgress) {
  return Boolean(
    progress.completedObjectives.length ||
    progress.completedWork.length ||
    progress.completedResources.length ||
    Object.keys(progress.lessonAttempts).length ||
    Object.keys(progress.questionAttempts).length ||
    progress.latestScore !== null,
  );
}

export function TeacherInsights({ getProgress, sessions }: TeacherInsightsProps) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const cutoffKey = getLocalDateKey(cutoff);
  const weeklySessions = sessions.filter((session) => session.date >= cutoffKey);
  const weeklyMinutes = weeklySessions.reduce((total, session) => total + session.focusedMinutes, 0);
  const questions = weeklySessions.reduce((total, session) => total + session.questionsAttempted, 0);
  const correct = weeklySessions.reduce((total, session) => total + session.correctAnswers, 0);
  const accuracy = questions > 0 ? Math.round(correct / questions * 100) : 0;
  const activeDays = new Set(weeklySessions.map((session) => session.date)).size;
  const mistakeCounts = weeklySessions.reduce<Record<string, number>>((counts, session) => {
    if (session.mistakeType !== "none") counts[session.mistakeType] = (counts[session.mistakeType] ?? 0) + 1;
    return counts;
  }, {});
  const topMistakeEntry = Object.entries(mistakeCounts).sort((left, right) => right[1] - left[1])[0];
  const topMistake = topMistakeEntry ? mistakeLabels[topMistakeEntry[0]] ?? topMistakeEntry[0] : "No pattern yet";
  const weakTopics = topics
    .map((topic) => ({ topic, progress: getProgress(topic.id) }))
    .filter(({ progress }) => hasEvidence(progress))
    .map(({ topic, progress }) => ({ topic, mastery: getTopicMastery(topic, progress), score: progress.latestScore }))
    .sort((left, right) => left.mastery - right.mastery || left.topic.number - right.topic.number)
    .slice(0, 5);

  const cards = [
    { label: "Focused · 7 days", value: `${weeklyMinutes}m`, detail: `${Math.round(weeklyMinutes / 270 * 100)}% of one full study day`, icon: Clock3, tone: "bg-[#dff2ed] text-[#31736d]" },
    { label: "Question accuracy", value: questions ? `${accuracy}%` : "—", detail: `${correct}/${questions} correct`, icon: BarChart3, tone: "bg-[#e2eefb] text-[#4873a8]" },
    { label: "Active days", value: `${activeDays}/7`, detail: `${weeklySessions.length} logged sessions`, icon: CalendarCheck2, tone: "bg-[#ece8fa] text-[#6756a6]" },
    { label: "Main mistake", value: topMistake, detail: topMistakeEntry ? `${topMistakeEntry[1]} recent logs` : "Log corrections to reveal a pattern", icon: AlertTriangle, tone: "bg-[#fae8d7] text-[#bd6834]" },
  ];

  return (
    <section className={cn(ui.panel, ui.panelPadding, "mt-5 border-[#bdd6cf]")} aria-label="Teacher insights">
      <div className={ui.sectionHeading}>
        <div>
          <span className={ui.eyebrow}>Protected teacher view · read only</span>
          <h2 className={ui.sectionTitle}>Weekly evidence briefing</h2>
        </div>
        <Target aria-hidden="true" size={21} />
      </div>

      <div className="grid gap-3 min-[721px]:grid-cols-2 min-[1181px]:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className="rounded-[16px] border border-study-line bg-[#fafbf9] p-4" key={label}>
            <span className={cn("grid size-9 place-items-center rounded-[11px]", tone)}><Icon aria-hidden="true" size={17} /></span>
            <span className="mt-3 block text-[8px] font-extrabold uppercase tracking-[0.08em] text-study-muted">{label}</span>
            <strong className="mt-1 block truncate text-[18px] tracking-[-0.035em]">{value}</strong>
            <small className="mt-1 block text-[8px] text-[#82908d]">{detail}</small>
          </article>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div><span className={ui.eyebrow}>Intervention queue</span><h3 className="mt-1 text-[14px] font-bold">Weakest topics with evidence</h3></div>
          <span className={ui.subtleBadge}>{weakTopics.length} ranked</span>
        </div>
        {weakTopics.length ? (
          <div className="mt-3 grid gap-2 min-[721px]:grid-cols-2 min-[1181px]:grid-cols-3">
            {weakTopics.map(({ topic, mastery, score }, index) => {
              const subject = subjectById[topic.subjectId];
              return (
                <article className="rounded-[13px] border border-study-line bg-white p-3.5" key={topic.id}>
                  <div className="flex items-center justify-between gap-3"><span className="text-[8px] font-extrabold uppercase" style={{ color: subject.accent }}>{index + 1} · {subject.shortName}</span><strong className="text-[10px]">{mastery}%</strong></div>
                  <strong className="mt-1.5 block text-[11px]">{topic.title}</strong>
                  <small className="mt-1 block text-[8px] text-study-muted">{score === null ? "No marked test yet" : `Latest marked score: ${score}%`}</small>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-[13px] border border-dashed border-study-line bg-[#fafbf9] p-5 text-center text-[9px] text-study-muted">No cloud evidence yet. Rohan&apos;s first saved session will appear here.</p>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Bell, CalendarDays, X } from "lucide-react";

import { DashboardNavigation, type DashboardView } from "@/src/components/dashboard-navigation";
import { OverviewView } from "@/src/components/overview-view";
import { SubjectView } from "@/src/components/subject-view";
import { TopicWorkspace } from "@/src/components/topic-workspace";
import { subjectById, topicById } from "@/src/data/curriculum";
import { useStudyProgress } from "@/src/hooks/use-study-progress";
import type { StudyTopic, SubjectId } from "@/src/types/study";

export function StudyDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { getProgress, toggleObjective, toggleWork, saveScore } = useStudyProgress();

  const selectedTopic = selectedTopicId ? topicById[selectedTopicId] : null;

  function navigate(view: DashboardView) {
    setActiveView(view);
    setSelectedTopicId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSubject(subjectId: SubjectId) {
    navigate(subjectId);
  }

  function openTopic(topic: StudyTopic) {
    setActiveView(topic.subjectId);
    setSelectedTopicId(topic.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeTopic() {
    setSelectedTopicId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <DashboardNavigation activeView={activeView} onNavigate={navigate} />

      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar__date">
            <CalendarDays aria-hidden="true" size={17} />
            <span>Sunday, 16 August</span>
            <b>45 days to Pure 1</b>
          </div>
          <div className="topbar__account">
            <button aria-label="Notifications" className="icon-button" type="button">
              <Bell aria-hidden="true" size={18} />
              <span className="notification-dot" />
            </button>
            <div className="student-avatar" aria-hidden="true">RS</div>
            <div className="student-name"><strong>Rohan</strong><span>AS student</span></div>
          </div>
        </header>

        <div className="dashboard-content">
          {selectedTopic ? (
            <TopicWorkspace
              key={selectedTopic.id}
              onBack={closeTopic}
              onSaveScore={(score) => {
                saveScore(selectedTopic.id, score);
                setNotice(`${selectedTopic.title} score saved. Your mastery has been recalculated.`);
              }}
              onToggleObjective={(objective) => toggleObjective(selectedTopic.id, objective)}
              onToggleWork={(workId) => toggleWork(selectedTopic.id, workId)}
              onVoiceRequested={() =>
                setNotice(
                  `The ${selectedTopic.title} voice lesson is mapped. In-dashboard playback will connect through the secure server route next.`,
                )
              }
              progress={getProgress(selectedTopic.id)}
              subject={subjectById[selectedTopic.subjectId]}
              topic={selectedTopic}
            />
          ) : activeView === "overview" ? (
            <OverviewView getProgress={getProgress} onOpenSubject={openSubject} onOpenTopic={openTopic} />
          ) : (
            <SubjectView
              getProgress={getProgress}
              onOpenTopic={openTopic}
              subject={subjectById[activeView]}
            />
          )}
        </div>
      </main>

      {notice ? (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss message" onClick={() => setNotice(null)} type="button"><X size={16} /></button>
        </div>
      ) : null}
    </div>
  );
}
